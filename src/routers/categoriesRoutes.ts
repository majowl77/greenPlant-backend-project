import { Router } from 'express'

import {
  getAllcategories,
  getCategory,
  newCategory,
  deleteCategory,
  updateCategory,
} from '../controllers/categoriesController'

const router = Router()

//-- CRUD OPREATIONS --

//  GET all categories
router.get('/', getAllcategories)

// GET single category
router.get('/:categoryId', getCategory)

// CREATE category
router.post('/', newCategory)

// DELETE category by id
router.delete('/:categoryId', deleteCategory)

router.put('/:categoryId', updateCategory)

export default router
