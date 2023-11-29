import mongoose, { Document } from 'mongoose'

export type OrderDocument = Document & {
  name: string
  products: mongoose.Schema.Types.ObjectId[]
  userId: mongoose.Schema.Types.ObjectId
}

export type UserDocument = Document & {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
}

export type CategoryDocument = Document & {
  name: string
}

export type ProductDocument = Document & {
  name: string
  description: string
  image: string
  quantity: number
  price: number
  category: mongoose.Types.ObjectId[]
  variants: string[]
  sizes: string[]
}
