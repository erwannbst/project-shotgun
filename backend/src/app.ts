import express, { Request, Response } from 'express'
import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors'
import { Bagarre, Candidate, Shotgun } from './types'
import { filterOnline, generateRoomId } from './utils'

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
          hasProject: false,
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
        shotgun.users.push({
          id: socket.id,
          pseudo,
          online: true,
          hasProject: false,
        })
      }
    })
    socket.join(id)
    socket.emit('join shotgun', { pseudo, id })
    const users = shotguns.find((shotgun) => shotgun.id === id)?.users
    console.log({ users })
    io.to(id).emit('users', users)
  })

  // handle bagarre clicking
  socket.on('click bagarre', ({ id }) => {
    console.log('click bagarre: ' + id)
    bagarres.forEach((bagarre) => {
      if (bagarre.id === id) {
        bagarre.fighters.forEach((fighter) => {
          if (fighter.user.id === socket.id) {
            fighter.score++
            if (fighter.score >= 150) {
              bagarre.winner = fighter
              // set user owner of project
              attributeProjectToCandidate(bagarre.project_id, fighter.user.id)
            }
          }
        })
      }
    })
    io.to(id).emit(
      'bagarre',
      bagarres.find((bagarre) => bagarre.id === id),
    )
  })

  socket.on('lock project response', ({ projectId, response }) => {
    console.log('lock project response: ' + projectId + ' ' + response)
    const shotgun = shotguns.find((shotgun) =>
      shotgun.projects.find((project) => project.id === projectId),
    )
    if (!shotgun) {
      console.log('shotgunnn not found')
      return
    }

    const project = shotgun.projects.find((project) => project.id === projectId)
    if (!project) {
      console.log('project not found')
      return
    }

    // set vote if not already set
    if (project?.lockRequestResponses?.[socket.id] === undefined) {
      project.lockRequestResponses = {
        ...project.lockRequestResponses,
        [socket.id]: response,
      }
    }

    // if all users have voted
    if (
      project.lockRequestResponses &&
      Object.keys(project.lockRequestResponses).length ===
        shotgun.users.filter(filterOnline).length - 1
    ) {
      // the user that initiated the lock request is the only one not to have voted
      const allUsers = shotgun.users.map((user) => user.id)
      const initiatorId = allUsers.find(
        (userId) =>
          !Object.keys(project.lockRequestResponses || {}).includes(userId),
      )

      if (!initiatorId) {
        console.log('initiator not found')
        return
      }

      // if all users voted yes
      if (
        Object.values(project.lockRequestResponses).every(
          (response) => response === true,
        )
      ) {
        // set user owner of project
        attributeProjectToCandidate(projectId, initiatorId)
      } else {
        // remove lock request responses
        project.lockRequestResponses = undefined
      }
    }

    io.to(shotgun.id).emit('lock project request', project)
  })
})

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// get shotgun data from id
app.get('/shotgun/:id', (req: Request, res: Response) => {
  const shotgun = shotguns.find((shotgun) => shotgun.id === req.params.id)
  console.log({ shotguns, shotgun })
  if (!shotgun) {
    res.status(404).send('Shotgun not found')
    return
  }
  const user_id = req.query.socketId
  const user = shotgun.users.find((user) => user.id === user_id)
  if (!user) {
    res.status(401).send('User not found')
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
    // reject if user already subscribed
    if (project.candidates.find((candidate) => candidate.user.id === userId)) {
      res.status(400).send('User already subscribed')
      return
    }
    project.candidates.push({ user, timestamp: Date.now() } as Candidate)
    io.to(shotgun.id).emit('projects', shotgun.projects)
    res.send(project)
  },
)

function attributeProjectToCandidate(project_id: string, user_id: string) {
  const shotgun = shotguns.find((shotgun) =>
    shotgun.users.find((user) => user.id === user_id),
  )
  if (!shotgun) {
    console.log('shotgunn not found')
    return
  }
  const project = shotgun.projects.find((project) => project.id === project_id)
  if (!project) {
    console.log('projectt not found')
    return
  }
  const candidate = project.candidates.find(
    (candidate) => candidate.user.id === user_id,
  )

  if (!candidate) {
    console.log('candidatee not found')
    return
  }
  candidate.owner = true
  // remove self from other projects
  shotgun.projects.forEach((project) => {
    project.candidates = project.candidates.filter(
      (candidate) => candidate.user.id !== user_id,
    )
  })
  // remove other candidates from project owned
  project.candidates = [candidate]
  // set user hasProject property to true
  shotgun.users.forEach((user) => {
    if (user.id === user_id) {
      user.hasProject = true
    }
  })
  io.to(shotgun.id).emit('projects', shotgun.projects)
  io.to(shotgun.id).emit('users', shotgun.users)
}

// user request to lock a project he is the only candidate of
app.post(
  '/shotguns/:shotgunId/projects/:projectId/candidates/:candidateId/lock',
  (req: Request, res: Response) => {
    console.log(
      'user lock project: ' +
        req.params.shotgunId +
        ' ' +
        req.params.projectId +
        ' ' +
        req.params.candidateId,
    )
    const shotgun = shotguns.find(
      (shotgun) => shotgun.id === req.params.shotgunId,
    )
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
    const candidate = project.candidates.find(
      (candidate) => candidate.user.id === req.params.candidateId,
    )
    if (!candidate) {
      res.status(404).send('Candidate not found')
      return
    }
    // reject if user is not the only candidate
    if (project.candidates.length > 1) {
      res.status(400).send('There is more than one candidate')
      return
    }

    project.lockRequestResponses = {}

    io.to(shotgun.id).emit('lock project request', project)
    res.send(project)
  },
)

function joinBagarre(bagarre: Bagarre, candidates: Candidate[]) {
  candidates.forEach((candidate) => {
    // join bagarre socket room
    const socket = io.sockets.sockets.get(candidate.user.id)
    if (socket) {
      socket.join(bagarre.id)
    }

    bagarre.fighters.push({ user: candidate.user, score: 0 })
  })
  return bagarre
}

// create bagarre
app.post('/bagarres', (req: Request, res: Response) => {
  const project = shotguns
    .find((shotgun) =>
      shotgun.users.find((user) => user.id === req.body.user_id),
    )
    ?.projects.find((project) => project.id === req.body.project_id)

  if (!project) {
    res.status(404).send('Project not found')
    return
  }

  console.log('create bagarre')
  let bagarre = {
    id: generateRoomId(),
    name: 'Bagarre ' + project.name,
    project_id: project.id,
    fighters: [],
  } as Bagarre

  bagarre = joinBagarre(bagarre, project.candidates as Candidate[])

  if (!bagarre) {
    res.status(404).send('User not found')
    return
  }

  bagarres.push(bagarre)

  io.to(bagarre.id).emit('cest lheure de la bagarre', bagarre)

  res.send(bagarre)
})

// get bagarre data from id
app.get('/bagarres/:id', (req: Request, res: Response) => {
  console.log('get bagarre: ' + req.params.id)
  const bagarre = bagarres.find((bagarre) => bagarre.id === req.params.id)
  if (!bagarre) {
    res.status(404).send('Bagarre not found')
    return
  }
  res.send(bagarre)
})

// add fighter to bagarre
app.post('/bagarres/:id/join', (req: Request, res: Response) => {
  console.log('add fighter to bagarre: ' + req.params.id)
  const bagarre = bagarres.find((bagarre) => bagarre.id === req.params.id)
  if (!bagarre) {
    res.status(404).send('Bagarre not found')
    return
  }
  const userId = req.body.user_id

  const user = shotguns
    .find((shotgun) => shotgun.users.find((user) => user.id === userId))
    ?.users.find((user) => user.id === userId)

  if (!user) {
    res.status(404).send('User not found')
    return
  }

  bagarre.fighters.push({ user, score: 0 })
  res.send(bagarre)
})
