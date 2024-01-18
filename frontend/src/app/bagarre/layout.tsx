'use client'
import { BagarreProvider } from '../../components/providers/bagarre-provider'
import '../globals.css'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <BagarreProvider>{children}</BagarreProvider>
}
