import { useRouter } from 'next/navigation'
import { BACKEND_URL } from '../lib/utils'
import { useUser } from './providers/user-provider'

export const CreateBagarre = () => {
  const { user } = useUser()
  const router = useRouter()

  if (!user) return null

  const createBagarre = () => {
    fetch(`${BACKEND_URL}/bagarres`, {
      method: 'POST',
      body: JSON.stringify({ user_id: user.id }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then(({ id }) => {
        router.push(`/bagarre/${id}`)
      })
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <button onClick={createBagarre}>Create bagarre</button>
    </div>
  )
}
