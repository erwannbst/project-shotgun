import express, { Request, Response } from 'express'
import { Server } from 'socket.io'
import http from 'http'

const app = express()
const port = 3001
const server = http.createServer(app)
// const io = new Server(server)
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
})

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('disconnect', () => {
    console.log('user disckonnected')
  })

  // handle shotgun creation
  socket.on('create shotgun', ({ pseudo }) => {
    console.log('create shotgun: ' + pseudo)
    const shotgun = {
      pseudo,
      id: socket.id.slice(0, 5).toLocaleUpperCase(),
    }
    io.emit('create shotgun', shotgun)
  })
})

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
