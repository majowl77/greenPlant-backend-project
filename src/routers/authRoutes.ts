import express from 'express'

import { registerNewUser, loginUser, activateUser } from '../controllers/userController'
import { validateUser } from '../middlewares/Validation/validateUser'

const router = express.Router()

router.get('/activateUser/:activationToken', activateUser)

router.post('/register', validateUser, registerNewUser)

router.post('/login', loginUser)

export default router
