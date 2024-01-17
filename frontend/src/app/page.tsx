'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSocket } from '../components/providers/socket-provider'
import { useState } from 'react'

export default function Home() {
  const { socket } = useSocket()
  const [pseudo, setPseudo] = useState('Pseuudo')
  const [code, setCode] = useState('ABCDEF')

  if (!socket) return <h1>Chargement...</h1>

  const createShotgun = () => {
    socket.emit('create shotgun', { pseudo })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-16 p-24">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl h-1/3">
        Project Shotgun
      </h1>
      <div className="gap-4 flex flex-row gap-20 p-20 h-2/3 align-center w-full">
        <div className="flex flex-col gap-4 p-20 align-center w-full">
          <Input
            type="text"
            placeholder="Pseudo"
            aria-label="pseudo"
            value={pseudo}
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
        <div className="flex flex-col gap-4 p-20 align-center w-full">
          <Input
            type="text"
            placeholder="Pseudo"
            aria-label="pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
          />
          <Input
            type="text"
            placeholder="ABCDEF"
            aria-label="code"
            onChange={(e) => setCode(e.target.value)}
          />
          <Button
            onClick={() => {
              socket.emit('join shotgun', { pseudo, id: code })
            }}
          >
            Entrer dans la bagarre
          </Button>
        </div>
      </div>
    </main>
  )
}
