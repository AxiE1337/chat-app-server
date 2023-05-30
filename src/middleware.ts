import { Request, Response, NextFunction } from 'express'
import { IToken } from './routes/authRoute'
import jwt from 'jsonwebtoken'

const jwt_secret = process.env.JWT_SECRET_KEY as string

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies

  try {
    const decoded = jwt.verify(token, jwt_secret) as IToken
    req.headers.userId = decoded.uid
  } catch (e: unknown) {
    return res.status(401).send('Unauthorized')
  }
  next()
}
