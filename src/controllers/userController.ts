import { Request, Response, NextFunction } from 'express'
import ApiError from '../errors/ApiError'

import User from '../models/user'

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find()
  res.status(200).json({
    users,
  })
}
// for the admin
export const getUserById = (req: Request, res: Response) => {
  const { userId } = req.params
  const user = User.findById(userId)
  if (!user) {
    return
  }
}

export const registerNewUser = async (req: Request, res: Response, next: NextFunction) => {
  // as first step receive everthing from the request body as it's in your schema
  const { firstName, lastName, email, password } = req.body
  // check if it's not empty
  if (!firstName || !lastName || !email || !password) {
    next(ApiError.badRequest('FirstName and lastName and email and password ar requierd'))
    return
  }
  // create a new instant form the schema and provied the properites to it
  const user = new User({
    firstName,
    lastName,
    email,
    password,
  })
  // save it to the database
  await user.save()
  res.status(201).json({
    msg: 'user has been created ',
    user,
  })
}
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {}

export const deleteUser = (req: Request, res: Response) => {
  res.status(204)
}

export const updateUser = (req: Request, res: Response) => {
  const { first_name } = req.body

  res.json()
}
