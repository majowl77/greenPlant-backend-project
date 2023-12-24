import mongoose, { Document } from 'mongoose'

import { orderStatus } from './constants'

export type OrderStatus = keyof typeof orderStatus

export type OrderDocument = Document & {
  name: string
  products: mongoose.Schema.Types.ObjectId[]
  userId: mongoose.Schema.Types.ObjectId
  orderStatus: OrderStatus
}

export type UserDocument = Document & {
  firstName: string
  lastName: string
  email: string
  password: string
  role: string
  isActive: Boolean
  activationToken: string | undefined
  forgotPasswordCode: string | undefined
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

export type DecodedUser = {
  userID: string
  email: string
  role: Role
  iat: number
  exp: number
}

export type Role = 'USER' | 'ADMIN'

export type CartDocument = Document & {
  user: string
  products: {
    product: mongoose.Schema.Types.ObjectId
    quantity: number
  }[]
}
