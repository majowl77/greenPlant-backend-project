import express from 'express'

import {
  registerNewUser,
  deleteUser,
  getUsers,
  updateUser,
  loginUser,
} from '../controllers/userController'
import { ValidateUser } from '../middlewares/validateUser'
import { AcceptOrder } from '../controllers/orderController'

const router = express.Router()

router.get('/', getUsers)

router.post('/register', ValidateUser, registerNewUser)

router.post('/login', loginUser)

router.delete('/:userId', deleteUser)

router.put('admin/orders/:orderId', AcceptOrder)

router.put('profile/:userId', updateUser)

export default router
