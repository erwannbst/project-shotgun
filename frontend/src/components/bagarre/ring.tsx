import { useEffect } from 'react'
import { Fighter } from '../../app/types'
import { useBagarre } from '../providers/bagarre-provider'
import { useSocket } from '../providers/socket-provider'
import { Button } from '../ui/button'

type Props = {
  fighter: Fighter
}

export const Ring = ({ fighter }: Props) => {
  const { socket } = useSocket()
  const { bagarre } = useBagarre()

  const iAmThisFighter = fighter.user.id === socket?.id
  const progress = (fighter.score / 150) * 100

  useEffect(() => {
    if (bagarre?.winner) {
      socket?.off('click bagarre')
    }
  }, [bagarre])

  return (
    <div className="flex w-full flex-col relative items-center justify-center border-8 border-gray-500 rounded-lg">
      <div
        className={`flex h-full w-full flex-col items-center justify-center`}
      >
        {/* Progress background */}
        <div
          className={`absolute z-0 bottom-0 right-0 left-0 bg-green-400 rounded-b-lg`}
          style={{ height: `${progress}%` }}
        />
        {!iAmThisFighter && (
          <div
            className={`absolute z-20 inset-0 bg-gray-400 opacity-45 rounded-b-lg filter brightness-150`}
          />
        )}
        <p className="font-bold z-10">{fighter.user.pseudo}</p>

        <Button
          onClick={() => {
            socket?.emit('click bagarre', { id: bagarre?.id })
          }}
          className="z-10"
          disabled={!iAmThisFighter || !!bagarre?.winner}
        >
          {fighter.score} click
        </Button>
      </div>
    </div>
  )
}
