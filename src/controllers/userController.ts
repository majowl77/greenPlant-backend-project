import { Request, Response, NextFunction } from 'express'
import ApiError from '../errors/ApiError'
import bcrypt from 'bcrypt'

import User from '../models/user'

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find()
  res.status(200).json({
    users,
  })
}

export const registerNewUser = async (req: Request, res: Response, next: NextFunction) => {
  // as first step receive everthing from the request body as it's in our schema
  const { firstName, lastName, email, password } = req.body

  // check all the requierd fields are not empty
  const requiredFields = ['firstName', 'lastName', 'email', 'password']
  const missingFields = requiredFields.filter((field) => !req.body[field])

  if (missingFields.length > 0) {
    const errorMessage = `${missingFields.join(', ')} ${
      missingFields.length > 1 ? 'are' : 'is'
    } required`
    return next(ApiError.badRequest(errorMessage))
  }
  // Check if the user is already registered by using the email as unique
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return next(ApiError.conflict('Email is already registered'))
  }
  const hashedPassword = await bcrypt.hash(password, 10)

  // create a new instant form the schema and provied the properites to it
  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  })
  // save it to the database
  await user.save()
  res.status(201).json({
    msg: 'user has been created ',
    user,
  })
}
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  //check the requset body not empty
  if (!email || !password) {
    const errorMessage = `${!email ? 'email' : ''}, ${!password ? 'password' : ''} required`
    return next(ApiError.conflict(errorMessage))
  }

  // find the user uing its email
  const existingUser = await User.findOne({ email })
  if (!existingUser) {
    return next(ApiError.badRequest('can not find the user '))
  }
  // Check if the entered password matches the stored hashed password
  const passwordMatch = await bcrypt.compare(password, existingUser.password)
  if (!passwordMatch) {
    return next(ApiError.unauthorized('Invalid password'))
  }

  // At this point, the user is authenticated
  res.status(200).json({
    _id: existingUser._id,
    email: existingUser.email,
    firstName: existingUser.firstName,
    lastName: existingUser.lastName,
  })
}

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params
  await User.deleteOne({
    _id: userId,
  })
  res.status(204).send()
}

export const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params
  const { firstName, lastName, email, password } = req.body

  // Validate input
  if (!userId) {
    return ApiError.badRequest('Invalid user ID')
  }
  // Find the user by ID
  const user = await User.findById(userId)

  // Check if the user exists
  if (!user) {
    throw ApiError.notFound('User not found')
  }

  // Update user information
  if (firstName) user.firstName = firstName
  if (lastName) user.lastName = lastName
  if (email) user.email = email
  const hashedPassword = await bcrypt.hash(password, 10)
  if (password) user.password = hashedPassword

  // Save the updated user to the database
  await user.save()
  res.status(200).json({
    msg: 'User updated successfully',
    user,
  })
}
