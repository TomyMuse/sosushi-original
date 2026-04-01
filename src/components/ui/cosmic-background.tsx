'use client'

import { useEffect, useRef } from 'react'

export function CosmicBackground() {
  const bgCanvasRef = useRef<HTMLCanvasElement>(null)
  const nebulaCanvasRef = useRef<HTMLCanvasElement>(null)
  const starsCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const bgCanvas = bgCanvasRef.current
    const nebulaCanvas = nebulaCanvasRef.current
    const starsCanvas = starsCanvasRef.current

    if (!bgCanvas || !nebulaCanvas || !starsCanvas) return

    const bgCtx = bgCanvas.getContext('2d')
    const nebulaCtx = nebulaCanvas.getContext('2d')
    const starsCtx = starsCanvas.getContext('2d')

    if (!bgCtx || !nebulaCtx || !starsCtx) return

    let W: number
    let H: number
    let stars: Star[] = []
    let nebulaParticles: NebulaParticle[] = []
    let animTime = 0
    let animationId: number

    const STAR_COUNT = 1000
    const NEBULA_PARTICLE_COUNT = 40

    interface Star {
      x: number
      y: number
      size: number
      baseAlpha: number
      alpha: number
      twinkleSpeed: number
      twinkleOffset: number
      color: string
    }

    interface NebulaParticle {
      x: number
      y: number
      size: number
      color: string
      vx: number
      vy: number
      pulseSpeed: number
      pulseOffset: number
    }

    function resize() {
      W = window.innerWidth
      H = window.innerHeight
      ;[bgCanvas, nebulaCanvas, starsCanvas].forEach((canvas) => {
        canvas.width = W
        canvas.height = H
      })
      drawBackground()
      drawNebulae()
      initStars()
      initNebulaParticles()
    }

    function drawBackground() {
      const grad = bgCtx.createRadialGradient(W * 0.3, H * 0.4, 0, W * 0.5, H * 0.5, W * 0.9)
      grad.addColorStop(0, '#0a0512')
      grad.addColorStop(0.3, '#050308')
      grad.addColorStop(0.6, '#020206')
      grad.addColorStop(1, '#000002')
      bgCtx.fillStyle = grad
      bgCtx.fillRect(0, 0, W, H)

      const grad2 = bgCtx.createRadialGradient(W * 0.75, H * 0.7, 0, W * 0.75, H * 0.7, W * 0.5)
      grad2.addColorStop(0, 'rgba(80, 20, 60, 0.3)')
      grad2.addColorStop(1, 'transparent')
      bgCtx.fillStyle = grad2
      bgCtx.fillRect(0, 0, W, H)

      const grad3 = bgCtx.createRadialGradient(W * 0.5, H * 0.3, 0, W * 0.5, H * 0.3, W * 0.4)
      grad3.addColorStop(0, 'rgba(100, 30, 80, 0.2)')
      grad3.addColorStop(1, 'transparent')
      bgCtx.fillStyle = grad3
      bgCtx.fillRect(0, 0, W, H)
    }

    function drawNebula(cx: number, cy: number, radius: number, colors: string[], rotation = 0) {
      nebulaCtx.save()
      nebulaCtx.translate(cx, cy)
      nebulaCtx.rotate(rotation)

      for (let layer = 0; layer < 6; layer++) {
        const layerRadius = radius * (1 - layer * 0.1)
        const opacity = 0.012 + layer * 0.006

        for (let i = 0; i < 800; i++) {
          const angle = Math.random() * Math.PI * 2
          const dist = Math.pow(Math.random(), 0.7) * layerRadius
          const spiralOffset = Math.sin(angle * 3 + dist * 0.008) * layerRadius * 0.25
          const turbulence = Math.sin(angle * 7 + dist * 0.02) * layerRadius * 0.05

          const x =
            Math.cos(angle) * (dist + spiralOffset + turbulence) * (0.85 + Math.random() * 0.3)
          const y =
            Math.sin(angle) * (dist + spiralOffset + turbulence) * (0.85 + Math.random() * 0.3)

          const size = Math.pow(Math.random(), 1.5) * 2 + 0.4
          const colorIndex = Math.floor(Math.random() * colors.length)
          const color = colors[colorIndex]

          nebulaCtx.beginPath()
          nebulaCtx.arc(x, y, size, 0, Math.PI * 2)
          nebulaCtx.fillStyle = color.replace('ALPHA', String(opacity * (0.3 + Math.random() * 0.7)))
          nebulaCtx.fill()
        }
      }

      for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2
        const dist = Math.pow(Math.random(), 0.5) * radius * 0.35
        const x = Math.cos(angle) * dist
        const y = Math.sin(angle) * dist
        const cloudRadius = radius * (0.08 + Math.random() * 0.1)
        const colorIndex = Math.floor(Math.random() * colors.length)

        const grad = nebulaCtx.createRadialGradient(x, y, 0, x, y, cloudRadius)
        grad.addColorStop(0, colors[colorIndex].replace('ALPHA', '0.05'))
        grad.addColorStop(0.3, colors[colorIndex].replace('ALPHA', '0.025'))
        grad.addColorStop(0.7, colors[colorIndex].replace('ALPHA', '0.01'))
        grad.addColorStop(1, 'transparent')

        nebulaCtx.fillStyle = grad
        nebulaCtx.beginPath()
        nebulaCtx.arc(x, y, cloudRadius, 0, Math.PI * 2)
        nebulaCtx.fill()
      }

      nebulaCtx.restore()
    }

    function drawGlowingCloud(
      cx: number,
      cy: number,
      radiusX: number,
      radiusY: number,
      color1: string,
      color2: string,
      alpha: number
    ) {
      nebulaCtx.save()
      nebulaCtx.translate(cx, cy)

      const grad = nebulaCtx.createRadialGradient(0, 0, 0, 0, 0, Math.max(radiusX, radiusY))
      grad.addColorStop(0, color1)
      grad.addColorStop(0.5, color2)
      grad.addColorStop(1, 'transparent')

      nebulaCtx.globalAlpha = alpha
      nebulaCtx.scale(1, radiusY / radiusX)
      nebulaCtx.fillStyle = grad
      nebulaCtx.beginPath()
      nebulaCtx.arc(0, 0, radiusX, 0, Math.PI * 2)
      nebulaCtx.fill()

      nebulaCtx.restore()
    }

    function drawNebulae() {
      nebulaCtx.clearRect(0, 0, W, H)
      nebulaCtx.globalCompositeOperation = 'screen'

      drawGlowingCloud(
        W * 0.2,
        H * 0.35,
        W * 0.42,
        H * 0.38,
        'rgba(200, 50, 150, 0.14)',
        'rgba(150, 30, 100, 0.07)',
        1
      )
      drawNebula(W * 0.2, H * 0.35, Math.min(W, H) * 0.4, [
        'rgba(220, 60, 180, ALPHA)',
        'rgba(180, 40, 140, ALPHA)',
        'rgba(255, 80, 200, ALPHA)',
        'rgba(160, 50, 160, ALPHA)',
        'rgba(200, 70, 170, ALPHA)',
      ], -0.3)

      drawGlowingCloud(
        W * 0.7,
        H * 0.5,
        W * 0.32,
        H * 0.38,
        'rgba(201, 162, 77, 0.12)',
        'rgba(150, 120, 50, 0.06)',
        1
      )
      drawNebula(W * 0.7, H * 0.5, Math.min(W, H) * 0.32, [
        'rgba(201, 162, 77, ALPHA)',
        'rgba(180, 140, 60, ALPHA)',
        'rgba(220, 180, 90, ALPHA)',
        'rgba(255, 210, 120, ALPHA)',
        'rgba(170, 130, 50, ALPHA)',
      ], 0.5)

      drawGlowingCloud(
        W * 0.45,
        H * 0.78,
        W * 0.3,
        H * 0.24,
        'rgba(180, 40, 120, 0.1)',
        'rgba(120, 20, 80, 0.05)',
        1
      )
      drawNebula(W * 0.45, H * 0.78, Math.min(W, H) * 0.28, [
        'rgba(200, 50, 140, ALPHA)',
        'rgba(180, 30, 110, ALPHA)',
        'rgba(220, 60, 160, ALPHA)',
        'rgba(170, 40, 130, ALPHA)',
      ], 0.2)

      drawGlowingCloud(
        W * 0.85,
        H * 0.18,
        W * 0.18,
        H * 0.14,
        'rgba(230, 70, 180, 0.1)',
        'rgba(180, 40, 130, 0.05)',
        1
      )
      drawNebula(W * 0.85, H * 0.18, Math.min(W, H) * 0.16, [
        'rgba(255, 90, 200, ALPHA)',
        'rgba(230, 60, 170, ALPHA)',
        'rgba(255, 110, 220, ALPHA)',
        'rgba(210, 50, 160, ALPHA)',
      ], -0.8)

      drawGlowingCloud(
        W * 0.15,
        H * 0.65,
        W * 0.25,
        H * 0.2,
        'rgba(140, 50, 180, 0.08)',
        'rgba(100, 30, 140, 0.04)',
        1
      )
      drawNebula(W * 0.15, H * 0.65, Math.min(W, H) * 0.22, [
        'rgba(160, 60, 200, ALPHA)',
        'rgba(180, 50, 180, ALPHA)',
        'rgba(140, 70, 220, ALPHA)',
        'rgba(200, 80, 190, ALPHA)',
      ], 0.4)

      nebulaCtx.globalCompositeOperation = 'multiply'
      for (let i = 0; i < 10; i++) {
        const x = Math.random() * W
        const y = Math.random() * H
        const r = Math.random() * 220 + 100
        const grad = nebulaCtx.createRadialGradient(x, y, 0, x, y, r)
        grad.addColorStop(0, 'rgba(0, 0, 0, 0.4)')
        grad.addColorStop(0.3, 'rgba(0, 0, 0, 0.25)')
        grad.addColorStop(0.7, 'rgba(5, 5, 8, 0.1)')
        grad.addColorStop(1, 'rgba(8, 8, 15, 0)')
        nebulaCtx.fillStyle = grad
        nebulaCtx.fillRect(x - r, y - r, r * 2, r * 2)
      }

      nebulaCtx.globalCompositeOperation = 'source-over'
    }

    function getStarColor(): string {
      const colors = [
        '255, 255, 255',
        '255, 250, 245',
        '255, 245, 230',
        '245, 240, 255',
        '255, 240, 210',
        '201, 162, 77',
        '255, 200, 230',
        '255, 220, 240',
        '235, 230, 255',
        '255, 180, 220',
      ]
      return colors[Math.floor(Math.random() * colors.length)]
    }

    function initStars() {
      stars = []
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          size: Math.random() * 2 + 0.3,
          baseAlpha: Math.random() * 0.7 + 0.3,
          alpha: 0,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinkleOffset: Math.random() * Math.PI * 2,
          color: getStarColor(),
        })
      }
    }

    function initNebulaParticles() {
      nebulaParticles = []
      const nebulaColors = [
        'rgba(220, 60, 180, 0.012)',
        'rgba(200, 50, 150, 0.01)',
        'rgba(201, 162, 77, 0.01)',
        'rgba(255, 80, 200, 0.008)',
        'rgba(180, 40, 140, 0.01)',
        'rgba(240, 200, 130, 0.008)',
        'rgba(255, 245, 230, 0.006)',
        'rgba(200, 70, 170, 0.01)',
        'rgba(160, 50, 200, 0.008)',
      ]

      for (let i = 0; i < NEBULA_PARTICLE_COUNT; i++) {
        nebulaParticles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          size: 60 + Math.random() * 200,
          color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.5) * 0.04,
          pulseSpeed: Math.random() * 0.002 + 0.001,
          pulseOffset: Math.random() * Math.PI * 2,
        })
      }
    }

    function drawStars(time: number) {
      starsCtx.clearRect(0, 0, W, H)

      stars.forEach((star) => {
        star.alpha =
          star.baseAlpha * (0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.twinkleOffset))

        if (star.size > 1.3) {
          const glowGrad = starsCtx.createRadialGradient(
            star.x,
            star.y,
            0,
            star.x,
            star.y,
            star.size * 4
          )
          glowGrad.addColorStop(0, `rgba(${star.color}, ${star.alpha * 0.25})`)
          glowGrad.addColorStop(1, 'transparent')
          starsCtx.fillStyle = glowGrad
          starsCtx.fillRect(
            star.x - star.size * 4,
            star.y - star.size * 4,
            star.size * 8,
            star.size * 8
          )
        }

        starsCtx.beginPath()
        starsCtx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2)
        starsCtx.fillStyle = `rgba(${star.color}, ${star.alpha})`
        starsCtx.fill()

        if (star.size > 1.6) {
          starsCtx.strokeStyle = `rgba(${star.color}, ${star.alpha * 0.25})`
          starsCtx.lineWidth = 0.4
          starsCtx.beginPath()
          starsCtx.moveTo(star.x - star.size * 2.5, star.y)
          starsCtx.lineTo(star.x + star.size * 2.5, star.y)
          starsCtx.stroke()
          starsCtx.beginPath()
          starsCtx.moveTo(star.x, star.y - star.size * 2.5)
          starsCtx.lineTo(star.x, star.y + star.size * 2.5)
          starsCtx.stroke()
        }
      })
    }

    function drawNebulaParticles(time: number) {
      nebulaParticles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < -particle.size) particle.x = W + particle.size
        if (particle.x > W + particle.size) particle.x = -particle.size
        if (particle.y < -particle.size) particle.y = H + particle.size
        if (particle.y > H + particle.size) particle.y = -particle.size

        const pulse = 0.7 + 0.3 * Math.sin(time * particle.pulseSpeed + particle.pulseOffset)
        const currentSize = particle.size * pulse

        starsCtx.globalCompositeOperation = 'screen'
        const grad = starsCtx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          currentSize
        )
        grad.addColorStop(0, particle.color)
        grad.addColorStop(1, 'transparent')
        starsCtx.fillStyle = grad
        starsCtx.fillRect(
          particle.x - currentSize,
          particle.y - currentSize,
          currentSize * 2,
          currentSize * 2
        )
        starsCtx.globalCompositeOperation = 'source-over'
      })
    }

    function animate() {
      animTime++
      drawStars(animTime)
      drawNebulaParticles(animTime)
      animationId = requestAnimationFrame(animate)
    }

    resize()
    animate()

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10">
      <canvas ref={bgCanvasRef} className="absolute inset-0" style={{ zIndex: 1 }} />
      <canvas ref={nebulaCanvasRef} className="absolute inset-0" style={{ zIndex: 2 }} />
      <canvas ref={starsCanvasRef} className="absolute inset-0" style={{ zIndex: 3 }} />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(180, 50, 140, 0.04) 0%, transparent 70%)',
          zIndex: 5,
        }}
      />
    </div>
  )
}
