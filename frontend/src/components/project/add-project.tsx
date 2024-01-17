/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { addProjectToShotgun } from '@/lib/utils'
import { Shotgun } from '@/app/types'

type Props = {
  shotgun: Shotgun
}

export function AddProject({ shotgun }: Props) {
  const [projectName, setProjectName] = useState('')

  return (
    <Dialog>
      <DialogTrigger>
        <div className="h-full w-[300px] flex justify-center items-center outline-slate-200 outline outline-offset-[-3px] outline-dashed cursor-pointer mr-2">
          <div>ajouter un projet</div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau projet</DialogTitle>
          <DialogDescription>
            Donner un nom de projet à ajouter au shotgun. (vérifier bien que le
            projet n'existe pas déjà 😏)
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-start gap-2">
          <Label htmlFor="name" className="text-right">
            Nom du projet
          </Label>
          <Input
            required
            id="name"
            value={projectName}
            aria-label="nom du projet"
            className="col-span-3"
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose>
            <Button
              onClick={() => {
                addProjectToShotgun(shotgun, projectName)
              }}
              type="submit"
            >
              Aouter le projet
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
