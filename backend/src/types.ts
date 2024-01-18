export type User = {
  id: string
  pseudo: string
  online: boolean
}

export type Project = {
  id: string
  name: string
  candidates: Candidate[]
}

export type Candidate = {
  user: User
  timestamp: number
}

export type Shotgun = {
  id: string
  author: string
  name: string
  users: User[]
  projects: Project[]
}

export type Fighter = {
  user: User
  score: number
}

export type Bagarre = {
  id: string
  name: string
  fighters: Fighter[]
}
