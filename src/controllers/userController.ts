import { Request, Response, NextFunction } from 'express'

import User from '../models/user'
import ApiError from '../errors/ApiError'

export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find({}, { password: 0 })
  res.status(200).json({
    users,
  })
}

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params
  try {
    await User.deleteOne({
      _id: userId,
    })
    res.status(204).send()
    console.log('it deleted it')
  } catch (error) {
    res.json({ msg: 'delete user faild' })
  }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params
  const { firstName, lastName } = req.validatedUserUpdate || {}

  // Validate the user
  if (!userId) {
    return ApiError.badRequest('Invalid user ID')
  }
  try {
    // Find and update the user in one step
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          firstName,
          lastName,
        },
      },
      // Save the updated user to the database
      { new: true }
    )
    // Check if the user exists
    if (!updatedUser) {
      throw ApiError.notFound('User not updated')
    }

    res.status(200).json({
      msg: 'User updated successfully',
      user: updatedUser,
    })
  } catch (error) {
    next(ApiError.badRequest('somthing went wrong while updateing profile info '))
  }
}

export const grantRoleToUsers = async (req: Request, res: Response) => {
  const userId = req.body.userId
  const role = req.body.role

  const user = await User.findByIdAndUpdate({ _id: userId }, { role }, { new: true }).select([
    '-password',
    '-activationToken',
  ])

  res.status(200).json({
    user,
  })
}
