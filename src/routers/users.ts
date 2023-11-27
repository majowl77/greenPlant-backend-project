import express from 'express'

import {
  registerNewUser,
  deleteUser,
  getUsers,
  updateUser,
  loginUser,
} from '../controllers/userController'
import { validateUser } from '../middlewares/validateUser'

const router = express.Router()

router.get('/admin/getAllUsers', getUsers)

router.post('/register', validateUser, registerNewUser)

router.post('/login', loginUser)

router.delete('/:userId', deleteUser)

router.put('profile/:userId', updateUser)

export default router
