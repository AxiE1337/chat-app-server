import * as dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import { IRoom } from '../types'
import cookieParser from 'cookie-parser'
import routes from './routes'
import cors from 'cors'
import socketOn from './socketOn'
dotenv.config()

export const prisma = new PrismaClient()
const app = express()
const server = createServer(app)
const whitelist = [process.env.CORS_ORIGIN, process.env.CORS_ORIGIN2]
const port = process.env.PORT || 3001

const io = new Server(server, {
  cors: {
    origin: (origin: any, callback: any) => {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
  },
})

export const rooms: IRoom[] = [
  {
    usersId: [
      'e8bf7f21-20dc-4318-bd8b-973649c81fb4',
      'd0c64d88-b683-4783-b55a-3c9a4865e6a1',
    ],
    id: '123123',
    roomName: ['john123', 'alex123'],
    messages: [],
  },
  {
    usersId: ['412312', 'e8bf7f21-20dc-4318-bd8b-973649c81fb4'],
    id: '123123132',
    roomName: ['no name', 'john123'],
    messages: [],
  },
]

//socket
io.on('connection', (socket: Socket) => {
  socketOn(socket, io)
})

const corsOptions = {
  origin: (origin: string | undefined, callback: any) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
}

//middleware
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())

//routes
app.get('/', async (req, res) => {
  res.send({ message: 'Hello World!' })
})
app.use('/api', routes)

app.use((req: Request, res: Response) => {
  res.status(404).send("Sorry can't find that!")
})

server.listen(port, () => {
  console.log(`Listening on port ${port} origin: ${process.env.CORS_ORIGIN}`)
})
