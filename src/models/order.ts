import mongoose, { Document } from 'mongoose'
import { OrderDocument } from '../types.js'

// Orders: id, productId, userId, purchasedAt

const orderSchema = new mongoose.Schema({
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  purchasedAt: {
    type: Date,
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'accepted','shipped' ,'delivered'], //order statuses
    default: 'pending',
  },
})

export default mongoose.model<OrderDocument>('Order', orderSchema)
