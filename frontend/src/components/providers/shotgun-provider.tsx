'use client'
import React, { createContext, useState } from 'react'
import { Shotgun } from '../../app/types'

type ShotgunContextType = {
  shotgun: Shotgun | null
  updateShotgun: (shotgun: Shotgun) => void
}

type Props = {
  children: React.ReactNode
}

const ShotgunContext = createContext<ShotgunContextType>({
  shotgun: null,
  updateShotgun: () => {},
})

// Create the provider component
const ShotgunProvider = ({ children }: Props) => {
  // Define the state or any other data you want to provide
  const [shotgun, setShotgun] = useState<Shotgun | null>(null)

  const updateShotgun = (shotgun: Shotgun) => {
    // Set the candidates to owner if there is only one candidate per project
    // shotgun.projects.map((project) =>
    //   project.candidates.length === 1
    //     ? project.candidates.map((candidate) => {
    //         candidate.owner = true
    //         return candidate
    //       })
    //     : project.candidates,
    // )

    setShotgun(shotgun)
  }

  // Provide the state and functions to the children components
  return (
    <ShotgunContext.Provider value={{ shotgun, updateShotgun }}>
      {children}
    </ShotgunContext.Provider>
  )
}

export const useShotgun = () => React.useContext(ShotgunContext)

export { ShotgunProvider }
