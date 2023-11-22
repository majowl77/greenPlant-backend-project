import mongoose, { Document } from 'mongoose'
import { UserDocument } from '../types'

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      // this is a unique index
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: UserRole, // Literal values using enum
      default: UserRole.User, // Default value for the 'role' is a user
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
)

export default mongoose.model<UserDocument>('User', userSchema)
