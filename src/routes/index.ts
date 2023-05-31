import express from 'express'
import usersRoute from './userRoute'
import authRoute from './authRoute'
import { verifyToken } from '../middleware'

const router = express.Router()

router.use('/user', verifyToken, usersRoute)
router.use('/auth', authRoute)

export default router
