'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useSocket } from '../../../components/providers/socket-provider'
import { useEffect } from 'react'
import { Bagarre } from '../../types'
import { useBagarre } from '../../../components/providers/bagarre-provider'
import { BACKEND_URL } from '../../../lib/utils'

export default function Bagarre() {
  const pathname = usePathname()
  const id = pathname?.split('/')[2]
  const router = useRouter()
  const { socket } = useSocket()
  const { bagarre, setBagarre } = useBagarre()

  useEffect(() => {
    fetch(`${BACKEND_URL}/bagarres/${id}`)
      .then((res) => {
        console.log('res', res)
        if (res.status !== 200) router.push('/')
        return res
      })
      .then((res) => res.json())
      .then((data) => {
        console.log('data', data)
        setBagarre(data)
      })
  }, [])

  return (
    <div>
      <h1>Bagarre {id}</h1>
      <div>
        {bagarre?.fighters.map((fighter) => (
          <div key={fighter.user.id}>
            {fighter.user.pseudo}
            {fighter.score}
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          socket?.emit('click bagarre', id)
        }}
      >
        Click
      </button>
    </div>
  )
}
