import { NextFunction, Request, Response } from 'express'

import Category from '../models/category'
import ApiError from '../errors/ApiError'

// GET ALL CATEGORIES
export const getAllcategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find()
    res.status(200).json(categories)
  } catch (error) {
    next(ApiError.badRequest('Something went wrong while fetching categories.'))
    return
  }
}

// GET CRUD FOR SINGLE CATEGORY
export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = req.params.categoryId
    const category = await Category.findById(categoryId)
    if (!category) {
      next(ApiError.badRequest('Category not found.'))
      return
    }
    res.status(200).json(category)
  } catch (error) {
    next(ApiError.badRequest('Something went wrong while fetching the category.'))
    return
  }
}

//POST CRUD
export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.validatedCategory

    const existingCategory = await Category.findOne({ name })
    if (existingCategory) {
      return next(ApiError.conflict('Category is already exist '))
    }

    const category = new Category({
      name,
    })

    await category.save()

    res.status(201).json({
      status: true,
      category,
    })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong while creating the category.'))
    return
  }
}

// DELETE CRUD
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.params
    await Category.deleteOne({
      _id: categoryId,
    })
    res.status(204).send()
  } catch (error) {
    next(ApiError.badRequest('Something went wrong while deleting the category.'))
    return
  }
}

//PUT CRUD
export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.validatedCategory
    const { categoryId } = req.params
    const updateCategory = await Category.findByIdAndUpdate(
      { _id: categoryId },
      { name: name },
      {
        new: true,
      }
    )
    res.status(200).json({
      updatedCategory: updateCategory,
    })
  } catch (error) {
    next(ApiError.badRequest('Something went wrong while updating the category.'))
    return
  }
}
