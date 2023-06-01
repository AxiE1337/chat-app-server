import * as dotenv from 'dotenv'
import express, { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
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

//socket
io.on('connection', (socket: Socket) => {
  try {
    console.log(`connected ${socket.id}`)
    socketOn(socket, io)
  } catch (e: unknown) {
    console.error(e)
  }
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
  console.log(`Listening on port ${port}`)
})
