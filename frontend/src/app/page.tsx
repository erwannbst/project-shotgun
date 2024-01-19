/* eslint-disable react/no-unescaped-entities */
'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSocket } from '../components/providers/socket-provider'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '../components/ui/label'

export default function Home() {
  const { socket } = useSocket()
  const [pseudo, setPseudo] = useState(
    process.env.NODE_ENV === 'development' ? 'user' : '',
  )
  const [code, setCode] = useState('')
  const [shotgunName, setShotgunName] = useState('')

  if (!socket) return <h1>Chargement...</h1>

  const createShotgun = () => {
    socket.emit('create shotgun', { pseudo, name: shotgunName })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-16 p-24 overflow-y-auto">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl h-1/3">
        Project Shotgun
      </h1>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="pseudo">Pseudo</Label>
        <Input
          type="text"
          placeholder="Pseudo"
          aria-label="pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
        />
      </div>
      <div className="flex flex-row flex-wrap gap-4 h-2/3 align-center justify-center w-full">
        <Card className="w-full max-w-xl min-w-96 flex-col md:flex-row">
          <CardHeader className="md:w-2/3">
            <CardTitle>Créer un nouveau shotgun</CardTitle>
            <CardDescription>
              Le choix de projet n'a jamais été aussi simple (ou presque 🤏)
            </CardDescription>
          </CardHeader>
          <div className="grid md:w-1/3 items-center gap-4 p-6">
            <Input
              type="text"
              placeholder="Nom du shotgun"
              aria-label="shotgun-name"
              value={shotgunName}
              onChange={(e) => setShotgunName(e.target.value)}
            />
            <Button
              className="w-full"
              onClick={() => {
                createShotgun()
              }}
            >
              Créer un shotgun
            </Button>
          </div>
        </Card>
        <Card className="w-full max-w-xl min-w-96 flex-col md:flex-row">
          <CardHeader className="md:w-2/3">
            <CardTitle>Rejoindre un shotgun</CardTitle>
            <CardDescription>
              Prêt à avoir le projet de vos rêves ? (ou pas 🥲)
            </CardDescription>
          </CardHeader>
          <div className="grid md:w-1/3 items-center gap-4 p-6">
            <Input
              type="text"
              placeholder="Shotgun ID"
              aria-label="code"
              onChange={(e) => setCode(e.target.value)}
            />
            <Button
              className="w-full"
              onClick={() => {
                socket.emit('join shotgun', { pseudo, id: code })
              }}
            >
              Rejoindre un shotgun
            </Button>
          </div>
        </Card>
      </div>
    </main>
  )
}
