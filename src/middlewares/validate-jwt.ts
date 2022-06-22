import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

export interface RequestWithUserId extends Request {
  uid?: string
}

export const validateJWT = (req: RequestWithUserId, res: Response, next: NextFunction): any => {
  const token: string | undefined = req.header('x-token')

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: 'No token provided'
    })
  }

  try {
    const { id }: any = jwt.verify(token, process.env.JWT_KEY as any)
    req.uid = id
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: 'Invalid token'
    })
  }

  next()
}
