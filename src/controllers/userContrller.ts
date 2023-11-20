import express from 'express'
import ApiError from '../errors/ApiError'
import User from '../models/user'
import users from '../routers/users'

export const getUserById = (req, res, next, userId) => {
  const user = users.find((user) => user.id === userId)
  if (!user) {
    next(ApiError.badRequest('user id is required.'))
    return
  }
  req.user = user
  next()
}

export const deleteUser = (req, res) => {
  const updatedUsers = users.filter((user) => user.id !== req.user.id)
  res.json({ users: updatedUsers })
}

export const updateUser = (req, res) => {
  const { first_name } = req.body

  const updatedUsers = users.map((user) => {
    if (user.id === req.user.id) {
      return {
        ...user,
        first_name,
      }
    }
    return user
  })
  res.json({ users: updatedUsers })
}

export const createUser = (req, res, next) => {
  const { id, first_name } = req.body

  if (!id || !first_name) {
    next(ApiError.badRequest('id and username are required'))
    return
  }
  const updatedUsers = [{ id, first_name }, ...users]
  res.json({
    msg: 'done',
    users: updatedUsers,
  })
}
export const getUsers = async (_, res) => {
  const users = await User.find().populate('order')
  res.json({
    users,
  })
}
