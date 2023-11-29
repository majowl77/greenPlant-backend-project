import express from 'express'

import { deleteUser, getUsers, updateUser } from '../controllers/userController'
import { acceptOrder, addNewOrder, addToCart, updateOrder } from '../controllers/orderController'

const router = express.Router()

router.get('/admin/getAllUsers', getUsers)

router.delete('/:userId', deleteUser)

router.put('profile/:userId', updateUser)

router.post('/orders/addNewOrder', addNewOrder)

router.post('/addToCart/:userId', addToCart)

router.put('/admin/orders/:orderId', acceptOrder)

router.put('/admin/orders/updatestatus/:orderId', updateOrder)



export default router
