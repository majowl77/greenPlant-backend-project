import express from 'express'

import {
  addNewOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrderStatus,
} from '../controllers/orderController'
import { checkAuth } from '../middlewares/checkAuth'
import { checkRole } from '../middlewares/checkRole'

const router = express.Router()

router.get('/', checkAuth, checkRole('ADMIN'), getOrders)

router.get('/:orderId', getOrderById)

router.put('/:orderId', updateOrderStatus)

router.post('/createNewOrder', addNewOrder)

router.delete('/:orderId', checkAuth, checkRole('ADMIN'), deleteOrder)

export default router
