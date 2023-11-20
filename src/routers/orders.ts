import express from 'express'
const router = express.Router()

import { addNewOrder, getOrders } from '../controllers/orderController'

router.get('/', getOrders)

router.post('/', addNewOrder)

export default router
