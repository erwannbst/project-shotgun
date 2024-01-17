import { User } from '@/app/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { Avatar, AvatarFallback } from '../ui/avatar'

export interface SidebarProps {
  user: User
  users: User[]
}

export function Sidebar(props: SidebarProps) {
  const [filter, setFilter] = useState('progress')

  const filteredUsers = props.users.filter((user) => {
    if (filter === 'progress') {
      return !user.hasProject
    } else if (filter === 'finished') {
      return user.hasProject
    }
  })

  return (
    <aside className="h-full w-2/12 border-slate-200 p-2 border-l">
      <h3 className="font-extrabold tracking-tight">Participants</h3>
      <Select
        defaultValue="progress"
        onValueChange={(value) => setFilter(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="progress">en cours</SelectItem>
          <SelectItem value="finished">validé</SelectItem>
        </SelectContent>
      </Select>
      <div className="body h-full mt-6 flex flex-col gap-2">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="flex w-full items-center p-2 gap-3">
              <Avatar>
                <AvatarFallback>{user.pseudo.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <p>{user.pseudo}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </aside>
  )
}
