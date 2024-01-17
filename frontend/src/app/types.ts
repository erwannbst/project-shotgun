export type User = {
  id: string
  pseudo: string
}

export type Shotgun = {
  id: string
  name: string
  users: User[]
}
