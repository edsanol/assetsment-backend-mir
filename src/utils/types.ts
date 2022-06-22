import { UserEntry } from '../models/user.model'
import { listModel } from '../models/list.model'
import { favsModel } from '../models/favs.model'

export type NewUserEntry = Pick<UserEntry, 'email' | 'password' >
export type newListModel = Pick<listModel, 'userId' | 'name' >
export type newFavsModel = Pick<favsModel, 'listId' | 'userId' | 'title' | 'description' | 'url' >
