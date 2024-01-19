'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useSocket } from '../../../components/providers/socket-provider'
import { useEffect } from 'react'
import { Bagarre } from '../../types'
import { useBagarre } from '../../../components/providers/bagarre-provider'
import { BACKEND_URL } from '../../../lib/utils'
import { Ring } from '../../../components/bagarre/ring'
import { Button } from '../../../components/ui/button'

export default function Bagarre() {
  const pathname = usePathname()
  const id = pathname?.split('/')[2]
  const router = useRouter()
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
    <div className="flex flex-col h-screen">
      {bagarre?.winner ? (
        <div className="flex flex-col gap-4 text-center p-3">
          <h1 className="font-bold text-3xl">
            {bagarre?.winner.user.pseudo} won !
          </h1>
          <Button
            onClick={() => {
              router.back()
            }}
          >
            Retour au shotgun
          </Button>
        </div>
      ) : (
        <h1 className="font-bold text-3xl text-center p-3">{bagarre?.name}</h1>
      )}
      <div className="flex flex-wrap h-full">
        {bagarre?.fighters.map((fighter) => (
          <Ring fighter={fighter} />
        ))}
      </div>
    </div>
  )
}
