import { Response } from 'express'
import { RequestWithUserId } from '../middlewares/validate-jwt'
import User, { UserEntry } from '../models/user.model'
import List, { listModel } from '../models/list.model'
import Favs, { favsModel } from '../models/favs.model'
import { toNewFavEntry } from '../middlewares/validateFields'

export const createFavorite = async (req: RequestWithUserId, res: Response): Promise<void> => {
  try {
    const { uid }: any = req
    const { listId, title, description, url }: any = req.body
    const newFav = await toNewFavEntry({ listId, uid, title, description, url })

    // Verificar que el usuario exista
    const user: UserEntry | null = await User.findById(uid)
    if (!user) {
      throw new Error('Invalid user')
    }

    // Verificar que la lista exista
    const list: listModel | null = await List.findById(newFav.listId)
    if (!list) {
      throw new Error('Invalid list')
    }

    // Crear la lista
    const fav: favsModel = await Favs.create(newFav)

    await list.updateOne(
      { $push: { favs: fav } }
    )

    res.status(200).json({
      ok: true,
      message: 'Favs created',
      data: fav
    })
  } catch (error: any) {
    res.status(404).json({
      ok: false,
      message: 'Fav coult not be create',
      data: error.message
    })
  }
}

export const showFavsByList = async (req: RequestWithUserId, res: Response): Promise<void> => {
  try {
    const { uid }: any = req
    const { listId }: any = req.params

    const user: UserEntry | null = await User.findById(uid)
    if (!user) {
      throw new Error('Invalid user')
    }

    const list: listModel | null = await List.findById(listId)
      .populate('favs', 'title description url')

    if (!list) {
      throw new Error('Invalid list')
    }

    const favs: favsModel[] = list.favs
    res.status(200).json({
      ok: true,
      message: 'Favs found',
      data: favs
    })
  } catch (error: any) {
    res.status(404).json({
      ok: false,
      message: 'Fav coult not be found',
      data: error.message
    })
  }
}

export const getFavsById = async (req: RequestWithUserId, res: Response): Promise<void> => {
  try {
    const { uid }: any = req
    const { id } = req.params
    const { listId } = req.body

    const user: UserEntry | null = await User.findById(uid)
    if (!user) {
      throw new Error('Invalid user')
    }

    const list: listModel | null = await List.findById(listId)
    if (!list) {
      throw new Error('Invalid list')
    }

    const fav: favsModel | null = await Favs.findById(id)
    if (!fav) {
      throw new Error('Invalid fav')
    }

    if (list.id !== fav.listId) {
      throw new Error('Fav not found')
    }

    res.status(200).json({
      ok: true,
      message: 'Fav founded',
      data: fav
    })
  } catch (error: any) {
    res.status(404).json({
      ok: false,
      message: 'Fav coult not be found',
      data: error.message
    })
  }
}

export const destroyFavorite = async (req: RequestWithUserId, res: Response): Promise<void> => {
  try {
    const { uid }: any = req
    const { id } = req.params
    const { listId } = req.body

    const user: UserEntry | null = await User.findById(uid)
    if (!user) {
      throw new Error('Invalid user')
    }

    const list: listModel | null = await List.findById(listId)
    if (!list) {
      throw new Error('Invalid list')
    }

    const fav: favsModel | null = await Favs.findById(id)
    if (!fav) {
      throw new Error('Invalid fav')
    }

    await Favs.findByIdAndDelete(fav.id)
    await list.updateOne(
      { $pull: { favs: fav.id } }
    )

    res.status(200).json({
      ok: true,
      message: 'Favs deleted',
      data: fav
    })
  } catch (error: any) {
    res.status(404).json({
      ok: false,
      message: 'Fav coult not be deleted',
      data: error.message
    })
  }
}
