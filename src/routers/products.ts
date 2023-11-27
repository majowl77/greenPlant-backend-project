import express from 'express'
const router = express.Router()

import Product from '../models/product'
import Order from '../models/order'
import ApiError from '../errors/ApiError'
import {
  createNewProduct,
  deleteProductById,
  filterProductByVariantstoSize,
  getAllProducts,
  getProductById,
  updateProductById,
} from '../controllers/productController'

router.get('/',  filterProductByVariantstoSize, getAllProducts)

router.get('/:productId', getProductById)

router.post('/', createNewProduct)

router.put('/:productId', updateProductById)

router.delete('/:productId', deleteProductById)
//Implement a route to handle GET requests with query parameters for filtering items
//or products based on specific criteria (e.g., by category, price range).



export default router
