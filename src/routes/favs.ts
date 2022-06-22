import { Router } from 'express'
import { validateJWT } from '../middlewares/validate-jwt'
import { createFavorite, showFavsByList, getFavsById, destroyFavorite } from '../controllers/favs.controller'
const router = Router()

router.route('/').post(validateJWT, createFavorite)
router.route('/:listId').get(validateJWT, showFavsByList)
router.route('/search/:id').get(validateJWT, getFavsById)
router.route('/delete/:id').delete(validateJWT, destroyFavorite)

export default router
