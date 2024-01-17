export type User = {
  id: string
  pseudo: string
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
  author: User
  name: string
  users: User[]
  projects: Project[]
}

export type Bagarre = {
  id: string
  name: string
  candidates: (Candidate & { score: number })[]
}
