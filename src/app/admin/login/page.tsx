import type { Metadata } from 'next'
import { CosmicBackground } from '@/components/ui/cosmic-background'
import { LoginForm } from './login-form'

export const metadata: Metadata = {
  title: 'Admin | SOSUSHI',
  description: 'Panel de administración',
}

export default function AdminLoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <CosmicBackground />
      <div className="relative z-10 w-full max-w-md p-6">
        <LoginForm />
      </div>
    </div>
  )
}