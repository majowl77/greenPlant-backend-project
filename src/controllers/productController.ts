import { NextFunction, Request, Response } from 'express'

import ApiError from '../errors/ApiError'
import Product from '../models/product'

export type SortOrder = 1 | -1

export const getAllProducts = async (req: Request, res: Response) => {
  let pageNumber = parseInt(req.query.pageNumber as string) || 1

  const initialPerPage: number = Number(req.query.perPage) || 6
  const perPage: number = initialPerPage
  const sortBy = req.query.sortBy?.toString()
  const category = req.query.category?.toString()
  const searchText = req.query.searchText?.toString() || ''
  try {
    const totalProducts = await Product.countDocuments()

    const totalPages = Math.ceil(totalProducts / perPage)
    pageNumber = Math.min(pageNumber, totalPages)
    const regexSearch = new RegExp(searchText, 'i')
    const query: Record<string, any> = {}

    let sortQuery = {}
    if (sortBy === 'newest') {
      sortQuery = { createdAt: -1 }
    } else if (sortBy === 'asc') {
      sortQuery = { price: 1 }
    } else if (sortBy === 'desc') {
      sortQuery = { price: -1 }
    }

    if (category) {
      query.categories = category
    }

    if (searchText) {
      query.name = regexSearch
    }

    const products = await Product.find(query)
      .populate('categories')
      .sort(sortQuery)
      .skip((pageNumber - 1) * perPage)
      .limit(perPage)

    if (products.length === 0) {
      throw ApiError.notFound('There are no products')
    }

    res.status(200).json({ products, totalPages, pageNumber, totalProducts })
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error })
  }
}

export const getAllAdminProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find()
    res.status(200).json({
      products,
    })

    if (products.length === 0) {
      throw ApiError.notFound('There are no products')
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error })
  }
}

export const getProductById = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId

    const product = await Product.findById({
      _id: productId,
    })
    res.status(200).json(product)
  } catch (error) {
    res.status(500).json({ message: 'internal server error' })
  }
}

export const createNewProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { name, description, quantity, price, categories, variants, sizes } =
    req.validatedProduct || {}
  const fileLocation = req.fileLocation
  try {
    if (!name || !description || !price || !categories) {
      next(ApiError.badRequest('Name, Description, price and category are requried'))
      return
    }

    const product = new Product({
      name,
      description,
      quantity,
      image: `https://${fileLocation}`,
      price,
      categories,
      variants,
      sizes,
    })
    console.log('🚀 ~ file: productController.ts:102 ~ createNewProduct ~ product:', product)

    await product.save()
    res.status(201).json({ product, msg: 'product is created successfully' })
  } catch (error) {
    res.status(400).json({ error, msg: 'product is not created ' })
  }
}

export const deleteProductById = async (req: Request, res: Response) => {
  const productId = req.params.productId

  await Product.deleteOne({
    _id: productId,
  })
  res.status(204).send()
}

export const updateProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, quantity, price, categories, variants, sizes } =
      req.validatedProduct || {}
    const productId = req.params.productId
    const fileName = req.fileLocation

    const newProduct = await Product.findByIdAndUpdate(
      { _id: productId },
      {
        name,
        description,
        quantity,
        image: fileName,
        price,
        categories,
        variants,
        sizes,
      },
      {
        new: true,
      }
    )

    res.json({
      newProduct,
    })
  } catch (error) {
    next(ApiError.badRequest('somthing went wrong while updateing product  '))
  }
}
