import express from 'express'

import { deleteUser, getUsers, updateUser } from '../controllers/userController'
import { acceptOrder, addNewOrder, updateOrder } from '../controllers/orderController'

const router = express.Router()

router.get('/admin/getAllUsers', getUsers)

router.delete('/:userId', deleteUser)

router.put('profile/:userId', updateUser)

router.post('/orders/addNewOrder', addNewOrder)

router.put('/admin/orders/:orderId', acceptOrder)

router.put('/admin/orders/updatestatus/:orderId', updateOrder)

export default router
