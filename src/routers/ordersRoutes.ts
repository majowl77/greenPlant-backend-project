import express from 'express'

import {
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrder,
} from '../controllers/orderController'
import { checkAuth } from '../middlewares/checkAuth'
import { checkRole } from '../middlewares/checkRole'

const router = express.Router()

router.get('/', getOrders)

router.get('/:orderId', getOrderById)

router.put('/:orderId', updateOrder)

router.delete('/:orderId', checkAuth, checkRole('ADMIN'), deleteOrder)



export default router
