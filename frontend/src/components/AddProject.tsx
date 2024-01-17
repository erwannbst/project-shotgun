import { useState } from 'react'
import { Shotgun } from '../app/types'
import { addProjectToShotgun } from '../lib/utils'
import { Button } from './ui/button'
import { Input } from './ui/input'

type Props = {
  shotgun: Shotgun
}

export const AddProject = ({ shotgun }: Props) => {
  const [projectName, setProjectName] = useState('Nom du projet')
  return (
    <div className="flex flex-col gap-4 p-20 align-center w-full">
      <Input
        type="text"
        placeholder="Nom du projet"
        aria-label="project-name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />
      <Button
        onClick={() => {
          addProjectToShotgun(shotgun, projectName)
        }}
        variant="outline"
      >
        Ajouter un projet
      </Button>
    </div>
  )
}
