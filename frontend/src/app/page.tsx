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

export default function Home() {
  const { socket } = useSocket()
  const [pseudo, setPseudo] = useState('')
  const [code, setCode] = useState('')
  const [shotgunName, setShotgunName] = useState('')

  if (!socket) return <h1>Chargement...</h1>

  const createShotgun = () => {
    socket.emit('create shotgun', { pseudo, name: shotgunName })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-16 p-24">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl h-1/3">
        Project Shotgun
      </h1>
      <div className="flex flex-row flex-wrap  gap-4 p-20 h-2/3 align-center justify-center w-full">
        <Card className="w-6/12 max-w-2xl min-w-96">
          <CardHeader>
            <CardTitle>Créer un nouveau shotgun</CardTitle>
            <CardDescription>
              Le choix de projet n'a jamais été aussi simple (ou presque 🤏)
            </CardDescription>
          </CardHeader>
          <CardContent className="grid w-full items-center gap-4">
            <Input
              type="text"
              placeholder="Pseudo"
              aria-label="pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
            />
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
              Créer une bagarre
            </Button>
          </CardContent>
        </Card>
        <Card className="w-6/12 max-w-2xl min-w-96">
          <CardHeader>
            <CardTitle>Rejoindre un shotgun</CardTitle>
            <CardDescription>
              Prêt à avoir le projet de vos rêves ? (ou pas 🥲)
            </CardDescription>
          </CardHeader>
          <CardContent className="grid w-full items-center gap-4">
            <Input
              type="text"
              placeholder="Pseudo"
              aria-label="pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
            />
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
              Entrer dans la bagarre
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
