import { User } from './types'

export const generateRoomId = () => {
  return Math.random().toString(36).slice(2, 7).toLocaleUpperCase()
}

export const filterOnline = (user: User) => user.online
