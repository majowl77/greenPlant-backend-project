import { NextFunction, Request, Response } from 'express'

import ApiError from '../errors/ApiError'

// error handleing
const apiErrorHandler = (err: typeof ApiError, req: Request, res: Response, next: NextFunction) => {
  console.error(err) // Log the error for further inspection

  if (err instanceof ApiError) {
    res.status(err.code).json({ msg: err.message })
    return
  }

  res.status(500).json({ msg: 'Something went wrong.' })
}

export default apiErrorHandler
