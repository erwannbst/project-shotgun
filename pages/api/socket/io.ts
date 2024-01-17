import { Server as HTTPServer } from 'http'
import { Server as NetServer, Socket } from 'net'
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as ServerIO } from 'socket.io'

export const config = {
  api: {
    bodyParser: false,
  },
}

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io?: ServerIO
    }
  }
}

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io')
    const path = '/api/socket/io'
    const httpServer: HTTPServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false,
    })
    res.socket.server.io = io

    io.on('connection', (socket) => {
      console.log('a user connected')

      socket.on('disconnect', () => {
        console.log('user disconnected')
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
  }
  res.end()
}

export default ioHandler
