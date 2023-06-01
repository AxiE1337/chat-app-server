import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router()
const prisma = new PrismaClient()
const jwt_secret = process.env.JWT_SECRET_KEY as string

router.post('/register', async (req: Request, res: Response) => {
  const { username, password, name } = req.body

  if (!username || !password || !name) {
    return res.status(400).json({
      message: 'Username, password, and name fields cannot be empty!',
    })
  }

  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
  })

  if (user) {
    return res
      .status(409)
      .json({ message: `User named ${user.username} already exists` })
  }

  const newUser = await prisma.user.create({
    data: {
      username: username,
      password: password,
      name: name,
    },
  })
  const token = jwt.sign({ uid: newUser.id }, jwt_secret, { expiresIn: '1h' })
  res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true })
  return res.json({ token: token })
})

router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password fields cannot be empty!' })
  }

  const user = await prisma.user.findFirst({
    where: { username: username, password: password },
  })

  if (user) {
    const token = jwt.sign({ uid: user.id }, jwt_secret, { expiresIn: '1h' })
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
    return res.json({ token: token })
  }

  return res.status(401).json({ message: 'Invalid username or password' })
})

router.get('/logout', async (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  })
  return res.status(200).send('logged out')
})

export default router

export interface IToken {
  uid: string
  iat: number
}
