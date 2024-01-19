'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useSocket } from '../../../components/providers/socket-provider'
import { useEffect } from 'react'
import { Shotgun } from '../../types'
import { BACKEND_URL } from '../../../lib/utils'
import { Sidebar } from '../../../components/sidebar/sidebar'
import { ProjectList } from '@/components/project/project-list'
import { useShotgun } from '../../../components/providers/shotgun-provider'
export type EmptyDict = { [key: string]: never }

export default function Home() {
  const pathname = usePathname()
  const { socket } = useSocket()
  const id = pathname?.split('/')[2]
  const router = useRouter()

  const { shotgun, updateShotgun } = useShotgun()

  useEffect(() => {
    fetch(`${BACKEND_URL}/shotgun/${id}`)
      .then((res) => {
        if (res.status !== 200) router.push('/')
        return res
      })
      .then((res) => res.json())
      .then((data) => {
        console.log('data', data)
        updateShotgun(data)
      })
  }, [])

  if (!socket || shotgun == null) return <h1>Chargement...</h1>

  socket.on('users', (users) => {
    console.log('users', users)
    updateShotgun({ ...shotgun, users } as Shotgun)
  })

  socket.on('projects', (projects) => {
    console.log('projects', projects)
    updateShotgun({ ...shotgun, projects } as Shotgun)
  })

  console.log("Room's id", socket.id)

  const author = shotgun.users.find((user) => user.id === shotgun.author)

  return (
    <div className="flex flex-row w-[100vw] h-[100vh]">
      <div className="flex flex-col h-full w-full gap-4 overflow-auto">
        <header className="flex flex-col p-3 lg:p-12">
          <span className="flex flex-row items-baseline gap-2	">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl h-1/3">
              {shotgun.name}
            </h1>
            <p className="font-bold text-gray-500">#{id}</p>
          </span>
          <h2>Créé par {author?.pseudo}</h2>
        </header>
        <ProjectList shotgun={shotgun} />
      </div>
      <Sidebar users={shotgun.users} />
    </div>
  )
}
