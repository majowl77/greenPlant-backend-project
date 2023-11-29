import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

import User from '../models/user'
import ApiError from '../errors/ApiError'
<<<<<<< HEAD
import { dev } from '../config'
=======
>>>>>>> backend

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find()
  res.status(200).json({
    users,
  })
}

<<<<<<< HEAD
function generateActivationToken() {
  return crypto.randomBytes(32).toString('hex')
}
// service to send emails in your behalf i.e. Node.js library for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: dev.email.user,
    pass: dev.email.pass,
  },
})

function sendActivationEmail(userEmail: string, activationToken: string) {
  const activationLink = `${dev.email.domain}/api/users/activateUser/${activationToken}`
  console.log('activationLINK', activationLink)

  const mailOptions = {
    form: dev.email.user,
    to: userEmail,
    subject: 'Account Activation ',
  }
  try{
    
  }catch(error){

  }
}

export const activateUser = async () => {}
export const registerNewUser = async (req: Request, res: Response, next: NextFunction) => {
  // as first step receive everything from the request body as it's in our schema
  const { firstName, lastName, email, password } = req.validateUser

  // Check if the user is already registered by using the email as unique
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return next(ApiError.conflict('Email is already registered'))
  }
  const activationToken = generateActivationToken()

  const hashedPassword = await bcrypt.hash(password, 10)

  // create a new instant form the schema and provied the properites to it
  const user = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    activationToken,
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

=======
>>>>>>> backend
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

  // Validate the user
  if (!userId) {
    return ApiError.badRequest('Invalid user ID')
  }

  // Hash the password if provided
  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined

  // Find and update the user in one step
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    },
    // Save the updated user to the database
    { new: true }
  )
  // Check if the user exists
  if (!updatedUser) {
    throw ApiError.notFound('User not found')
  }

  res.status(200).json({
    msg: 'User updated successfully',
    user: updatedUser,
  })
}
