import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SocketProvider } from '../components/providers/socket-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Project Shotgun',
  description: 'Never miss a project again',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SocketProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </SocketProvider>
  )
}
