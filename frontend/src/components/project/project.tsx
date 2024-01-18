import { Project } from '@/app/types'
import { useShotgun } from '../providers/shotgun-provider'
import { useUser } from '../providers/user-provider'
import { SubscribeProject } from './subscribe-projects'
import { CandidateCard } from '../ui/card'

export interface ProjectProps {
  project: Project
}

export function ProjectItem(props: ProjectProps) {
  const { user } = useUser()
  const iAmCandidateOfThisProject = props.project.candidates.some(
    (candidate) => candidate.user.id === user?.id,
  )

  return (
    <div className="h-full min-w-80 border-slate-200 border">
      <div className="header w-full p-3  bg-slate-50  border-slate-200 border-b text-center font-extrabold ">
        {props.project.name}
      </div>
      <div className="flex flex-col p-2 gap-2">
        {props.project.candidates.map((candidate) => (
          <CandidateCard candidate={candidate} />
        ))}
        {!iAmCandidateOfThisProject && (
          <SubscribeProject project={props.project} />
        )}
      </div>
    </div>
  )
}
