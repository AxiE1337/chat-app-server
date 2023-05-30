import { PrismaClient } from '@prisma/client'
import express, { Request, Response } from 'express'

const router = express.Router()
const prisma = new PrismaClient()

router.get('/get', async (req: Request, res: Response) => {
  const { userId } = req.headers
  const data = await prisma.user.findUnique({
    where: { id: userId as string },
  })
  res.json({
    user: { name: data?.name, id: data?.id, username: data?.username },
  })
})

export default router
