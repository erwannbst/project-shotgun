import { Shotgun } from '@/app/types'
import { AddProject } from './add-project'
import { ProjectItem } from './project'

type Props = {
  shotgun: Shotgun
}

export function ProjectList({ shotgun }: Props) {
  return (
    <div className="flex flex-row w-full h-full  overflow-x-auto justify-items-start">
      <AddProject shotgun={shotgun} />
      {shotgun.projects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </div>
  )
}
