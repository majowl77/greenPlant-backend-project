import { Router } from 'express'

import {
  getAllcategories,
  getcategory,
  newCategory,
  deletecategory,
  update,
} from '../controllers/categoriesController'

const router = Router()

//-- CRUD OPREATIONS --

//  GET all categories
router.get('/', getAllcategories)

// GET single category
router.get('/:categoryId', getcategory)

// CREATE category
router.post('/', newCategory)

// DELETE category by id
router.delete('/:categoryId', deletecategory)

router.put('/:categoryId', update)

export default router
