import type { Metadata, Viewport } from 'next'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sosushi | Sushi Premium Online',
  description:
    'Sushi premium en San Clemente del Tuyu con pedidos online y confirmacion rapida por WhatsApp.',
  keywords: [
    'sushi',
    'sushi premium',
    'delivery',
    'rolls',
    'sashimi',
    'nigiri',
    'comida japonesa',
  ],
  authors: [{ name: 'Sosushi' }],
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Sosushi | Sushi Premium Online',
    description:
      'Experiencia de sushi premium. Rolls artesanales con ingredientes de calidad superior.',
    type: 'website',
    locale: 'es_AR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sosushi | Sushi Premium Online',
    description:
      'Experiencia de sushi premium. Rolls artesanales con ingredientes de calidad superior.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="dark">
      <body className="font-sans text-xl antialiased text-foreground">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
