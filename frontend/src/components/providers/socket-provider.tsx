'use client'

import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import { io as ClientIO, Socket } from 'socket.io-client'
import { BACKEND_URL } from '../../lib/utils'
import { useUser } from './user-provider'
import { User } from '../../app/types'

type SocketContextType = {
  socket: Socket | null
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
})

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const { user, setUser } = useUser()
  const router = useRouter()

  useEffect(() => {
    // server is running on port 3001
    const socket = ClientIO(BACKEND_URL)
    console.log('socket', socket)

    socket.on('disconnect', () => {
      router.push('/')
    })

    socket.on('create shotgun', ({ pseudo, id }) => {
      // a shotgun has been created
      console.log('create shotgun', pseudo, id)
      setUser({ ...user, pseudo, id: socket.id } as User)
      router.push(`/shotgun/${id}`)
    })

    socket.on('join shotgun', ({ pseudo, id }) => {
      // the user has joined a shotgun
      console.log('joining shotgun', pseudo, id)
      setUser({ ...user, pseudo, id: socket.id } as User)
      router.push(`/shotgun/${id}`)
    })

    setSocket(socket)
    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}
