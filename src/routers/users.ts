import express from 'express'

import {
  registerNewUser,
  deleteUser,
  getUsers,
  updateUser,
  loginUser,
} from '../controllers/userController'
import { ValidateUser } from '../middlewares/validateUser'
import { acceptOrder, addNewOrder, updateOrder } from '../controllers/orderController'

const router = express.Router()

router.get('/', getUsers)

router.post('/register', ValidateUser, registerNewUser)

router.post('/login', loginUser)

router.post('/admin/orders/addNewOrder', addNewOrder)

router.delete('/:userId', deleteUser)

router.put('/admin/orders/:orderId', acceptOrder)

router.put('/admin/orders/updatestatus/:orderId', updateOrder)

router.put('profile/:userId', updateUser)

export default router
