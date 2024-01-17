'use client'

import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import { io as ClientIO, Socket } from 'socket.io-client'

type SocketContextType = {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export const useSocket = () => useContext(SocketContext)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // server is running on port 3001
    const socket = ClientIO('http://localhost:3001')
    console.log('socket', socket)

    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
      router.push('/')
    })

    socket.on('create shotgun', ({ pseudo, id }) => {
      console.log('create shotgun', pseudo, id)
      router.push(`/shotgun/${id}`)
    })

    socket.on('join shotgun', ({ pseudo, id }) => {
      console.log('joining shotgun', pseudo, id)
      router.push(`/shotgun/${id}`)
    })

    setSocket(socket)
    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}
