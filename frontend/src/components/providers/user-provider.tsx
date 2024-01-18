'use client'
import React, { createContext, useState } from 'react'
import { User } from '../../app/types'

type UserContextType = {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

type Props = {
  children: React.ReactNode
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
})

// Create the provider component
const UserProvider = ({ children }: Props) => {
  // Define the state or any other data you want to provide
  const [user, setUser] = useState<User | null>(null)

  // Provide the state and functions to the children components
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => React.useContext(UserContext)

export { UserProvider }
