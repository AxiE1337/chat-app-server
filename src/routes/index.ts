import express from 'express'
import usersRoute from './userRoute'
import authRoute from './authRoute'
import roomRoute from './roomRoute'
import { verifyToken } from '../middleware'

const router = express.Router()

router.use('/user', verifyToken, usersRoute)
router.use('/room', verifyToken, roomRoute)
router.use('/auth', authRoute)

export default router
