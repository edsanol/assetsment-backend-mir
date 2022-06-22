import { Response } from 'express'
import { toNewListEntry } from '../middlewares/validateFields'
import User, { UserEntry } from '../models/user.model'
import List, { listModel } from '../models/list.model'
import Favs, { favsModel } from '../models/favs.model'
import { RequestWithUserId } from '../middlewares/validate-jwt'

export const createList = async (req: RequestWithUserId, res: Response): Promise<void> => {
  try {
    const { uid }: any = req
    const { name }: any = req.body
    const newList = await toNewListEntry({ uid, name })

    // Verificar que el usuario exista
    const user: UserEntry | null = await User.findById(newList.userId)

    if (!user) {
      throw new Error('Invalid user')
    }

    // Crear la lista
    const list: listModel = await List.create(newList)

    await user.updateOne(
      { $push: { lists: list } }
    )

    res.status(200).json({
      ok: true,
      message: 'User created',
      data: list
    })
  } catch (error: any) {
    res.status(404).json({
      ok: false,
      message: 'List coult not be create',
      data: error.message
    })
  }
}

export const showListByUser = async (req: RequestWithUserId, res: Response): Promise<void> => {
  try {
    const { uid }: any = req
    const user: UserEntry | null = await User.findById(uid)

    if (!user) {
      throw new Error('Invalid user')
    }

    const lists: listModel[] = user.lists

    res.status(200).json({
      ok: true,
      message: 'List founded',
      data: lists
    })
  } catch (error: any) {
    res.status(404).json({
      ok: false,
      message: 'List coult not be founded',
      data: error.message
    })
  }
}

export const getListById = async (req: RequestWithUserId, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { uid }: any = req
    const list: listModel | null = await List.findById(id)
      .populate('favs', 'title description url')
    const user: UserEntry | null = await User.findById(uid)

    if (!list) {
      throw new Error('Invalid list')
    }

    if (!user) {
      throw new Error('Invalid user')
    }

    if (list.userId !== user.id) {
      throw new Error('list not found')
    }

    res.status(200).json({
      ok: true,
      message: 'List found',
      data: list
    })
  } catch (error: any) {
    res.status(404).json({
      ok: false,
      message: 'List coult not be found',
      data: error.message
    })
  }
}

export const destoryList = async (req: RequestWithUserId, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const { uid }: any = req
    const list: listModel | null = await List.findById(id)
    const user: UserEntry | null = await User.findById(uid)

    if (!list) {
      throw new Error('Invalid list here')
    }

    if (!user) {
      throw new Error('Invalid user')
    }

    if (list.userId !== user.id) {
      throw new Error('list not found')
    }

    await List.findByIdAndDelete(list.id)
    const favsFromDB: favsModel[] | null = await Favs.find({ listId: list.id })

    if (favsFromDB.length > 0) {
      await Favs.deleteMany({ listId: list.id })
    }

    await User.updateOne(
      { $pull: { lists: list.id } }
    )

    res.status(200).json({
      ok: true,
      message: 'List deleted',
      data: list
    })
  } catch (error: any) {
    res.status(404).json({
      ok: false,
      message: 'List coult not be deleted',
      data: error.message
    })
  }
}
