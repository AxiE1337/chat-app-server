import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express'

const router = express.Router()
const prisma = new PrismaClient()

router.get('/get', async (req: Request, res: Response) => {
  const { userId } = req.headers
  console.log(userId)
  const data = await prisma.user.findUnique({
    where: { id: userId as string },
  })
  res.json({
    user: { name: data?.name, id: data?.id, username: data?.username },
  })
})
router.get('/search', async (req: Request, res: Response) => {
  const { username } = req.query
  if (!username) {
    return res.sendStatus(404)
  }

  const users = await prisma.user.findMany({
    where: {
      username: username as string,
    },
    select: {
      username: true,
      name: true,
      id: true,
    },
  })

  res.json({
    users: users,
  })
})

export default router
