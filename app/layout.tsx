// app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { GameProvider } from '@/context/GameProvider'

export const metadata: Metadata = {
  title: 'Ludo Realtime',
  description: 'Realtime Ludo PWA Game',
  manifest: '/manifest.json',
  themeColor: '#111111',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Ludo',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <GameProvider>
          {children}
        </GameProvider>
      </body>
    </html>
  )
}