import { cpSync, existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const projectRoot = process.cwd()
const tempRoot = path.join(projectRoot, '.hostinger-temp')
const distPath = path.join(projectRoot, 'dist')
const outPath = path.join(projectRoot, 'out')

const dynamicPaths = [
  { source: path.join(projectRoot, 'src', 'app', 'api'), target: path.join(tempRoot, 'api') },
  { source: path.join(projectRoot, 'src', 'app', 'admin'), target: path.join(tempRoot, 'admin') },
  { source: path.join(projectRoot, 'src', 'middleware.ts'), target: path.join(tempRoot, 'middleware.ts') },
]

const moved = []

try {
  mkdirSync(tempRoot, { recursive: true })

  for (const entry of dynamicPaths) {
    if (!existsSync(entry.source)) continue
    mkdirSync(path.dirname(entry.target), { recursive: true })
    renameSync(entry.source, entry.target)
    moved.push(entry)
  }

  rmSync(outPath, { recursive: true, force: true })
  rmSync(distPath, { recursive: true, force: true })

  const command = process.platform === 'win32'
    ? path.join(projectRoot, 'node_modules', '.bin', 'next.cmd')
    : path.join(projectRoot, 'node_modules', '.bin', 'next')

  if (!existsSync(command)) {
    throw new Error('Next.js is not installed. Run "npm install" before building for Hostinger.')
  }

  const result = spawnSync(command, ['build'], {
    stdio: 'inherit',
    cwd: projectRoot,
    env: {
      ...process.env,
      BUILD_TARGET: 'static',
    },
  })

  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }

  cpSync(outPath, distPath, { recursive: true })
  writeFileSync(
    path.join(distPath, '.htaccess'),
    ['DirectoryIndex index.html', 'Options -Indexes', 'ErrorDocument 404 /404.html'].join('\n')
  )

  console.log('Static Hostinger build ready in dist/')
} finally {
  for (const entry of moved.reverse()) {
    if (existsSync(entry.target)) {
      mkdirSync(path.dirname(entry.source), { recursive: true })
      renameSync(entry.target, entry.source)
    }
  }

  rmSync(tempRoot, { recursive: true, force: true })
}
