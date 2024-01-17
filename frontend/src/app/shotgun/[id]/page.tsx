'use client'

import { usePathname } from 'next/navigation'
import { useSocket } from '../../../components/providers/socket-provider'
import { use, useEffect, useState } from 'react'
import { User } from '../../types'

export default function Home() {
  const pathname = usePathname()
  const { socket } = useSocket()
  const id = pathname?.split('/')[2]
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetch(`http://localhost:3001/shotgun/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('data', data)
        setUsers(data.users)
      })
  }, [])

  if (!socket) return <h1>Chargement...</h1>

  socket.on('users', (users) => {
    console.log('users', users)
    setUsers(users)
  })

  console.log("Room's id", socket.id)

  return (
    <>
      <h1>Shotgun #{id}</h1>
      <h2>Projet recherche</h2>
      <br />
      <h2>Participants</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.pseudo}</li>
        ))}
      </ul>
    </>
  )
}
