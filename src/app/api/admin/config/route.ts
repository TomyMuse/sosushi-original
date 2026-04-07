import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

const configPath = join(process.cwd(), 'src', 'data', 'site-config.json')

function getDefaultConfig() {
  return {
    brandName: 'SOSUSHI',
    whatsappNumber: '5491150948993',
    whatsappGreeting: 'Hola! Quiero hacer un pedido.',
    instagramUrl: 'https://instagram.com/sosushiok',
    instagramHandle: '@sosushiok',
    phoneDisplay: '+54 9 11 5094-8993',
    city: 'San Clemente del Tuyu, Buenos Aires',
    schedule: 'Mar a Dom de 19:00 a 00:00'
  }
}

export async function GET() {
  try {
    let config = getDefaultConfig()
    
    if (existsSync(configPath)) {
      const fileContent = readFileSync(configPath, 'utf-8')
      config = { ...config, ...JSON.parse(fileContent) }
    }
    
    return NextResponse.json(config)
  } catch (error) {
    console.error('Config error:', error)
    return NextResponse.json(getDefaultConfig())
  }
}

export async function PUT(request: Request) {
  try {
    const config = await request.json()
    
    const dir = join(process.cwd(), 'src', 'data')
    writeFileSync(configPath, JSON.stringify(config, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Save config error:', error)
    return NextResponse.json({ error: 'Error saving config' }, { status: 500 })
  }
}