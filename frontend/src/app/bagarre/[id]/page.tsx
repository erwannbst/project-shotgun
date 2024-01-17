'use client'
import { usePathname, useRouter } from 'next/navigation'
import { useSocket } from '../../../components/providers/socket-provider'
import { EmptyDict } from '../../shotgun/[id]/page'
import { useState } from 'react'
import { Bagarre } from '../../types'

export default function Bagarre() {
  const pathname = usePathname()
  const { socket } = useSocket()
  const id = pathname?.split('/')[2]
  const router = useRouter()

  const [bagarre, setBagarre] = useState<Bagarre | EmptyDict>({})
}
