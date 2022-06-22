import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import User, { UserEntry } from '../models/user.model'
import List, { listModel } from '../models/list.model'
import Favs, { favsModel } from '../models/favs.model'
import { toNewUserEntry } from '../middlewares/validateFields'
import { JWTgenerator } from '../utils/jwt'
import { RequestWithUserId } from '../middlewares/validate-jwt'

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const newUser = await toNewUserEntry(req.body)

    // Verificar que el email no exista
    const email: string = newUser.email
    const emailExists: UserEntry | null = await User.findOne({ email })

    if (emailExists) {
      throw new Error('the email already exists')
    }

    // Encrypta la contraseña
    const encryptPassword = await bcrypt.hash(newUser.password, 8)
    const user: UserEntry = await User.create({ ...newUser, password: encryptPassword })

    // Generar el JWT
    const token = await JWTgenerator(user.id)

    res.status(200).json({
      ok: true,
      message: 'User created',
      data: user,
      token
    })
  } catch (error: any) {
    res.status(404).json({
      ok: false,
      message: 'User coult not be create',
      data: error.message
    })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  try {
    // Verificar si existe el correo
    const userFromDB: UserEntry | null = await User.findOne({ email })
    if (!userFromDB) {
      throw new Error('the email does not exist')
    }

    // Validar el password
    const validPassword = bcrypt.compareSync(password, userFromDB.password)
    if (!validPassword) {
      throw new Error('the password is incorrect')
    }

    // Generar el JWT
    const token = await JWTgenerator(userFromDB.id)

    res.json({
      ok: true,
      usuario: userFromDB,
      token,
      message: 'User logged'
    })
  } catch (error: any) {
    res.status(500).json({
      ok: false,
      message: 'Incorrect Sesion',
      data: error.message
    })
  }
}

export const listUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users: UserEntry[] = await User.find()
      .populate('lists')
    res.status(200).json({
      ok: true,
      message: 'Users found',
      data: users
    })
  } catch (error: any) {
    res.status(404).json({
      ok: false,
      message: 'Users coult not be found',
      data: error.message
    })
  }
}

export const getUser = async (req: RequestWithUserId, res: Response): Promise<void> => {
  const { id } = req.params
  const { uid }: any = req

  try {
    const user: UserEntry | null = await User.findById(id)
      .select('-password')
      .populate('lists', 'id name favs')
    if (!user || user.id !== uid) {
      throw new Error('the user does not exist')
    }

    res.status(200).json({
      ok: true,
      message: 'User found',
      data: user
    })
  } catch (error: any) {
    res.status(404).json({
      ok: false,
      message: 'User coult not be found',
      data: error.message
    })
  }
}

export const destroyUser = async (req: RequestWithUserId, res: Response): Promise<void> => {
  const { id } = req.params
  const { uid }: any = req

  try {
    const user: UserEntry | null = await User.findById(id)
    if (!user || user.id !== uid) {
      throw new Error('the user does not exist here')
    }

    await User.findByIdAndDelete(user.id)

    const listFromDB: listModel[] | null = await List.find({ userId: user.id })
    if (listFromDB.length > 0) {
      await List.deleteMany({ userId: user.id })
    }

    const favsFromDB: favsModel[] | null = await Favs.find({ userId: user.id })
    if (favsFromDB.length > 0) {
      await Favs.deleteMany({ userId: user.id })
    }

    res.status(200).json({
      ok: true,
      message: 'User deleted'
    })
  } catch (error: any) {
    res.status(404).json({
      ok: false,
      message: 'User coult not be deleted',
      data: error.message
    })
  }
}
