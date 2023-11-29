import { Request, Response, NextFunction } from 'express'

import ApiError from '../errors/ApiError'
import { UserRole } from '../models/user'

export function checkRole(userRole: UserRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    const decodedUser = req.decodedUser

    if (decodedUser.role !== userRole) {
      next(ApiError.forbidden('NOT ALLOWED'))
      return
    }
    next()
  }
}
