'use client'
import { ShotgunProvider } from '../../components/providers/shotgun-provider'
import { UserProvider } from '../../components/providers/user-provider'
import '../globals.css'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ShotgunProvider>{children}</ShotgunProvider>
}
