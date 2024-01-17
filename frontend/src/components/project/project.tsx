import { Project } from '@/app/types'

export interface ProjectProps {
  project: Project
}

export function ProjectItem(props: ProjectProps) {
  return (
    <div className="h-full w-[300px] border-slate-200 border">
      <div className="header w-full p-3  bg-slate-50  border-slate-200 border-b text-center font-extrabold ">
        {props.project.name}
      </div>
    </div>
  )
}
