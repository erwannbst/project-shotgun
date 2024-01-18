import express, { Request, Response } from 'express'
import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors'
import { Bagarre, Candidate, Shotgun } from './types'
import { generateRoomId } from './utils'

const corsOptions = {
  origin: '*',
}
const app = express()
app.use(cors(corsOptions))
app.use(express.json())
const port = 3001
const server = http.createServer(app)
const io = new Server(server, {
  cors: corsOptions,
})

const shotguns: Shotgun[] = []

const bagarres: Bagarre[] = []

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('disconnect', () => {
    shotguns.forEach((shotgun) => {
      shotgun.users.forEach((user) => {
        if (user.id === socket.id) {
          user.online = false
        }
      })
    })
    // send updated users list
    shotguns.forEach((shotgun) => {
      io.to(shotgun.id).emit('users', shotgun.users)
    })
    console.log('user disckonnected')
  })

  // handle shotgun creation
  socket.on('create shotgun', ({ pseudo, name }) => {
    const shotgun: Shotgun = {
      name,
      id: generateRoomId(),
      author: socket.id,
      projects: [],
      users: [
        {
          id: socket.id,
          pseudo,
          online: true,
        },
      ],
    }
    shotguns.push(shotgun)
    console.log('create shotgun: ' + shotgun)
    socket.join(shotgun.id)
    socket.emit('create shotgun', shotgun)
  })

  // handle shotgun joining
  socket.on('join shotgun', ({ pseudo, id }) => {
    console.log('join shotgun: ' + pseudo + ' ' + id)
    shotguns.forEach((shotgun) => {
      if (shotgun.id === id) {
        shotgun.users.push({ id: socket.id, pseudo, online: true })
      }
    })
    socket.join(id)
    socket.emit('join shotgun', { pseudo, id })
    const users = shotguns.find((shotgun) => shotgun.id === id)?.users
    console.log({ users })
    io.to(id).emit('users', users)
  })
})

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// get shotgun data from id
app.get('/shotgun/:id', (req: Request, res: Response) => {
  console.log('get shotgun: ' + req.params.id)
  const shotgun = shotguns.find((shotgun) => shotgun.id === req.params.id)
  console.log({ shotguns, shotgun })
  if (!shotgun) {
    res.status(404).send('Shotgun not found')
    return
  }
  res.send(shotgun)
})

// add project to shotgun
app.post('/shotguns/:id/projects', (req: Request, res: Response) => {
  console.log('add project to shotgun: ' + req.params.id)
  const shotgun = shotguns.find((shotgun) => shotgun.id === req.params.id)
  if (!shotgun) {
    res.status(404).send('Shotgun not found')
    return
  }
  const project = {
    id: generateRoomId(),
    name: req.body.name,
    candidates: [],
  }
  shotgun.projects.push(project)
  io.to(shotgun.id).emit('projects', shotgun.projects)
  res.send(project)
})

// user subscribe to project
app.post(
  '/shotguns/:id/projects/:projectId/subscribe',
  (req: Request, res: Response) => {
    console.log(
      'user subscribe to project: ' +
        req.params.id +
        ' ' +
        req.params.projectId,
    )
    const shotgun = shotguns.find((shotgun) => shotgun.id === req.params.id)
    if (!shotgun) {
      res.status(404).send('Shotgun not found')
      return
    }
    const project = shotgun.projects.find(
      (project) => project.id === req.params.projectId,
    )
    if (!project) {
      res.status(404).send('Project not found')
      return
    }
    const userId = req.body.user_id
    const user = shotgun.users.find((user) => user.id === userId)
    if (!user) {
      res.status(404).send('User not found')
      return
    }
    project.candidates.push({ user, timestamp: Date.now() } as Candidate)
    io.to(shotgun.id).emit('projects', shotgun.projects)
    res.send(project)
  },
)

// create bagarre
app.post('/bagarres', (req: Request, res: Response) => {
  console.log('create bagarre')
  const bagarre = {
    id: generateRoomId(),
    name: req.body.name,
    candidates: [],
  }
  bagarres.push(bagarre)
  res.send(bagarre)
})
