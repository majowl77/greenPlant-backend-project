import express from 'express'

import { deleteUser, getUsers, updateUser } from '../controllers/userController'

const router = express.Router()

router.get('/admin/getAllUsers', getUsers)

router.delete('/:userId', deleteUser)

router.put('profile/:userId', updateUser)

export default router
