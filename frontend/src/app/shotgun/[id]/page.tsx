'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useSocket } from '../../../components/providers/socket-provider'
import { useEffect, useState } from 'react'
import { Shotgun } from '../../types'
import { AddProject } from '../../../components/AddProject'
import { BACKEND_URL } from '../../../lib/utils'
import { Sidebar } from '../../../components/sidebar/sidebar'
export type EmptyDict = { [key: string]: never }

export default function Home() {
  const pathname = usePathname()
  const { socket } = useSocket()
  const id = pathname?.split('/')[2]
  const router = useRouter()

  const [shotgun, setShotgun] = useState<Shotgun | EmptyDict>({})

  useEffect(() => {
    fetch(`${BACKEND_URL}/shotgun/${id}`)
      .then((res) => {
        if (res.status !== 200) router.push('/')
        return res
      })
      .then((res) => res.json())
      .then((data) => {
        console.log('data', data)
        setShotgun(data)
      })
  }, [])

  if (!socket || shotgunIsEmpty(shotgun)) return <h1>Chargement...</h1>

  socket.on('users', (users) => {
    console.log('users', users)
    setShotgun({ ...shotgun, users })
  })

  socket.on('projects', (projects) => {
    console.log('projects', projects)
    setShotgun({ ...shotgun, projects })
  })

  console.log("Room's id", socket.id)

  return (
    <div className="flex flex-row w-full h-full">
      <div className="flex flex-col w-10/12 h-full p-20">
        <header className="flex flex-col ">
          <span className="flex flex-row items-baseline gap-2	">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl h-1/3">
              Projet recherche
            </h1>
            <p className="font-bold text-gray-500">#{id}</p>
          </span>
          <h2>Créé par {shotgun.author.pseudo}</h2>
        </header>
        <div className="f">
          <div
            className={`flex flex-row gap-4 p-8 min-w-[${
              50 + 50 * shotgun.projects.length
            }] w-full`}
          >
            {shotgun.projects.map((project) => (
              <div
                key={project.id}
                className="flex flex-col gap-4 p-8 border-slate-700 border-l-2"
              >
                <h2>{project.name}</h2>
                {project.candidates.map((candidate) => (
                  <div key={candidate.user.id}>{candidate.user.pseudo}</div>
                ))}
              </div>
            ))}

            <AddProject shotgun={shotgun} />
          </div>
        </div>
      </div>
      <Sidebar user={shotgun.users[0]} users={shotgun.users} />
    </div>
  )
}

function shotgunIsEmpty(shotgun: Shotgun | EmptyDict): shotgun is EmptyDict {
  return Object.keys(shotgun).length === 0
}
