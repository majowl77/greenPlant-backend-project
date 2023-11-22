import { Router } from "express";

import { getAllcategories, getcategory, postcategory ,deletecategory, putcategory, } from "../controllers/categoriesController";

const router = Router();


//-- CRUD OPREATIONS --

//  GET all categories
router.get('/', getAllcategories)

// GET single category
router.get('/:categoryId', getcategory)

// CREATE category
router.post('/', postcategory)

// DELETE category by id 
router.delete('/:categoryId', deletecategory)

router.put('/:categoryId', putcategory)

export default router