import { useState } from 'react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Project } from '@/app/types'
import { useSocket } from '../providers/socket-provider'
import { useShotgun } from '../providers/shotgun-provider'
import { Progress } from '../ui/progress'

export function LockProjectRequestModal() {
  const [project, setProject] = useState<Project | null>(null)
  const [open, setOpen] = useState(true)
  const { shotgun } = useShotgun()

  const { socket } = useSocket()

  if (!socket) return null
  if (!shotgun) return null

  socket?.on('lock project request', (project: Project) => {
    console.log('lock project request', project)
    setProject(project)
  })

  const letProject = () => {
    socket?.emit('lock project response', {
      projectId: project?.id,
      response: true,
    })
  }

  const refuseLock = () => {
    socket?.emit('lock project response', {
      projectId: project?.id,
      response: false,
    })
  }

  const projectResponses = Object.values(project?.lockRequestResponses || {})

  // show modal if project and if everyone has not yet responded
  const canClose =
    !!project &&
    projectResponses.length ==
      shotgun.users.filter((user) => user.online).length - 1

  const iHaveInitiatedTheLockRequest =
    project?.candidates[0].user.id === socket?.id

  const description = canClose
    ? ''
    : iHaveInitiatedTheLockRequest
    ? `Vous avez demandé à prendre le projet ${project?.name} sans violence.`
    : `${project?.candidates[0].user.pseudo} demande à prendre le projet ${project?.name} sans violence. Que voulez-vous faire ?`

  const title = canClose ? (
    projectResponses.some((r) => r === false) ? (
      <span className="text-red-500 font-extrabold text-3xl">
        Demande refusée
      </span>
    ) : (
      <span className="text-green-500 font-extrabold text-3xl">
        Demande acceptée
      </span>
    )
  ) : (
    "Demande de verrouillage à l'amiable"
  )

  return (
    <Dialog open={open && !!project && !!project.lockRequestResponses}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
          <Progress
            value={
              (projectResponses.length /
                (shotgun.users.filter((user) => user.online).length - 1)) *
                100 || 1
            }
            max={shotgun.projects.length}
            indicatorColor={
              projectResponses.some((r) => r === false)
                ? 'bg-red-400'
                : 'bg-green-400'
            }
          />
        </DialogHeader>
        <DialogFooter>
          {!iHaveInitiatedTheLockRequest &&
            (project?.lockRequestResponses || {})[socket?.id ?? ''] ===
              undefined && (
              <>
                <Button onClick={refuseLock} variant="destructive">
                  Refuser la demande
                </Button>

                <Button onClick={letProject}>Lui laisser le projet</Button>
              </>
            )}
          {canClose && <Button onClick={() => setOpen(false)}>Fermer</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
