'use client'
import React, { createContext, useState } from 'react'
import { Shotgun } from '../../app/types'

type ShotgunContextType = {
  shotgun: Shotgun | null
  setShotgun: React.Dispatch<React.SetStateAction<Shotgun | null>>
}

type Props = {
  children: React.ReactNode
}

const ShotgunContext = createContext<ShotgunContextType>({
  shotgun: null,
  setShotgun: () => {},
})

// Create the provider component
const ShotgunProvider = ({ children }: Props) => {
  // Define the state or any other data you want to provide
  const [shotgun, setShotgun] = useState<Shotgun | null>(null)

  // Provide the state and functions to the children components
  return (
    <ShotgunContext.Provider value={{ shotgun, setShotgun }}>
      {children}
    </ShotgunContext.Provider>
  )
}

export const useShotgun = () => React.useContext(ShotgunContext)

export { ShotgunProvider }
