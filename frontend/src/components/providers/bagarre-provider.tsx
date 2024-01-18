'use client'
import React, { createContext, useState } from 'react'
import { Bagarre } from '../../app/types'
import { Socket } from 'socket.io-client'
import { useSocket } from './socket-provider'

type BagarreContextType = {
  bagarre: Bagarre | null
  setBagarre: (bagarre: Bagarre | null) => void
}

type Props = {
  children: React.ReactNode
}

const BagarreContext = createContext<BagarreContextType>({
  bagarre: null,
  setBagarre: () => {},
})

// Create the provider component
const BagarreProvider = ({ children }: Props) => {
  // Define the state or any other data you want to provide
  const [bagarre, setBagarre] = useState<Bagarre | null>(null)

  const { socket } = useSocket()

  socket?.on('bagarre', (bagarre: Bagarre) => {
    setBagarre(bagarre)
  })

  // Provide the state and functions to the children components
  return (
    <BagarreContext.Provider value={{ bagarre, setBagarre }}>
      {children}
    </BagarreContext.Provider>
  )
}

export const useBagarre = () => React.useContext(BagarreContext)

export { BagarreProvider }
