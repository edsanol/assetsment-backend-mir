import { Router } from 'express'
import { createList, showListByUser, getListById, destoryList } from '../controllers/list.controller'
import { validateJWT } from '../middlewares/validate-jwt'
const router = Router()

router.route('/').post(validateJWT, createList)
router.route('/').get(validateJWT, showListByUser)
router.route('/:id').get(validateJWT, getListById)
router.route('/delete/:id').delete(validateJWT, destoryList)

export default router
