import express from 'express'
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../controllers/userController'

const router = express.Router()

router.param('userId', getUserById)
router.delete('/:userId', deleteUser)
router.put('/:userId', updateUser)
router.post('/', createUser)

// router.get('/:userId/page/:page', (req, res) => {
//   res.json({
//     msg: 'done',
//     user: req.user,
//   })
// })

router.get('/', getUsers)

export default router
