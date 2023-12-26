import express from 'express'

import {
  deleteUser,
  getUserById,
  getUsers,
  grantRoleToUsers,
  updateUser,
} from '../controllers/userController'
import { checkAuth } from '../middlewares/checkAuth'
import { checkRole } from '../middlewares/checkRole'
import { validateUserUpdate } from '../validation/validateUserUpdate'

const router = express.Router()

// ---- Admin Routes ---- Private Routes------
router.get('/admin/getAllUsers', checkAuth, checkRole('ADMIN'), getUsers)

router.delete('/admin/deleteUser/:userId', checkAuth, checkRole('ADMIN'), deleteUser)

router.put('/admin/role', checkAuth, checkRole('ADMIN'), grantRoleToUsers)


// ---- User Normal Routes
router.put('/profile/:userId', validateUserUpdate, updateUser)

router.get('/:userId', checkAuth, getUserById)

export default router
