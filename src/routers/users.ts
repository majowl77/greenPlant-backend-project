import express from 'express'
import {
  registerNewUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  loginUser,
} from '../controllers/userController'

const router = express.Router()
router.get('/', getUsers)
router.get('/:userId', getUserById)
router.post('/', registerNewUser)
router.post('/', loginUser)
router.delete('/:userId', deleteUser)
router.put('/:userId', updateUser)

// i will work on it in the bouns and additional req
// router.get('/:userId/page/:page', (req, res) => {
//   res.json({
//     msg: 'done',
//     user: req.user,
//   })
// })

export default router
