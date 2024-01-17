import express, { Request, Response } from 'express'
import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors'
import { Shotgun } from './types'
import { generateRoomId } from './utils'

const corsOptions = {
  origin: 'http://localhost:3000',
}
const app = express()
app.use(cors(corsOptions))
const port = 3001
const server = http.createServer(app)
const io = new Server(server, {
  cors: corsOptions,
})

const shotguns: Shotgun[] = []

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('disconnect', () => {
    console.log('user disckonnected')
  })

  // handle shotgun creation
  socket.on('create shotgun', ({ pseudo }) => {
    const shotgun: Shotgun = {
      name: pseudo + "'s shotgun",
      id: generateRoomId(),
      users: [
        {
          id: socket.id,
          pseudo,
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
        shotgun.users.push({ id: socket.id, pseudo })
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
