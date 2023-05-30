import express, { Request, Response } from 'express'
import { rooms as roomsData } from '..'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  const { userId } = req.headers
  if (!userId) return res.status(404).send('session not found')

  const rooms = roomsData.filter((r) => r.usersId[0] === userId)

  res.json({ rooms })
})

export default router
