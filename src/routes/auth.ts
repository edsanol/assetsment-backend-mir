import { Router } from 'express'
import { registerUser, login, listUsers, getUser, destroyUser } from '../controllers/user.controller'
import { validateJWT } from '../middlewares/validate-jwt'
const router = Router()

router.route('/register').post(registerUser)
router.route('/login').post(login)
router.route('/').get(listUsers)
router.route('/:id').get(validateJWT, getUser)
router.route('/:id').delete(validateJWT, destroyUser)

export default router
