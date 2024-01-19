import { useRouter } from 'next/navigation'
import { BACKEND_URL } from '../lib/utils'
import { useUser } from './providers/user-provider'
import { Project } from '../app/types'
import { Button } from './ui/button'

type Props = {
  project: Project
}

export const CreateBagarre = ({ project }: Props) => {
  const { user } = useUser()

  if (!user) return null

  const createBagarre = () => {
    fetch(`${BACKEND_URL}/bagarres`, {
      method: 'POST',
      body: JSON.stringify({ user_id: user.id, project_id: project.id }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return (
    <div className="flex flex-col items-center justify-center mt-3">
      <Button onClick={createBagarre}>Départager dans une bagarre</Button>
    </div>
  )
}
