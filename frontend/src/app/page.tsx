'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSocket } from '../components/providers/socket-provider'
import { useState } from 'react'

export default function Home() {
  const router = useRouter()
  const { socket } = useSocket()
  const [pseudo, setPseudo] = useState('Pseuu')

  if (!socket) return <h1>Chargement...</h1>

  const createShotgun = () => {
    socket.emit('create shotgun', { pseudo })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-16 p-24">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Project Shotgun
      </h1>
      <div className="gap-4 flex flex-row">
        <Input
          type="text"
          placeholder="Pseudo"
          aria-label="pseudo"
          onChange={(e) => setPseudo(e.target.value)}
        />
        <Button
          onClick={() => {
            createShotgun()
          }}
        >
          Créer une bagarre
        </Button>
      </div>
    </main>
  )
}
