import { Shotgun } from '@/app/types'
import { AddProject } from './add-project'
import { ProjectItem } from './project'
import { CreateBagarre } from '../create-bagarre'

type Props = {
  shotgun: Shotgun
}

export function ProjectList({ shotgun }: Props) {
  return (
    <div className="flex flex-row w-full h-full overflow-x-auto p-3 justify-items-start gap-2">
      {shotgun.projects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
      <AddProject shotgun={shotgun} />
      <CreateBagarre />
    </div>
  )
}
