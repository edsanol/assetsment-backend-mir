import { NewUserEntry, newListModel, newFavsModel } from '../utils/types'

const parseEmail = (emailFromRequest: any): string => {
  if (!isString(emailFromRequest) || !isEmail(emailFromRequest)) {
    throw new Error('the email format is incorrect')
  }
  return emailFromRequest
}

const parsePassword = (passwordFromRequest: any): string => {
  if (!isString(passwordFromRequest) || !isPassword(passwordFromRequest)) {
    throw new Error('the password format is incorrect')
  }
  return passwordFromRequest
}

const parseUserId = (userIdFromRequest: any): string => {
  if (!isString(userIdFromRequest)) {
    throw new Error('the userId format is incorrect')
  }
  return userIdFromRequest
}

const parseString = (stringFromRequest: any): string => {
  if (!isString(stringFromRequest)) {
    throw new Error('the userId format is incorrect')
  }
  return stringFromRequest
}

const isString = (string: any): boolean => {
  return (typeof string === 'string')
}

const isPassword = (password: any): boolean => {
  const passwordFormat = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
  return passwordFormat.test(password)
}

const isEmail = (email: string): boolean => {
  const emailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  return emailFormat.test(email)
}

export const toNewUserEntry = (object: any): NewUserEntry => {
  const newUser: NewUserEntry = {
    email: parseEmail(object.email),
    password: parsePassword(object.password)
  }
  return newUser
}

export const toNewListEntry = (object: any): newListModel => {
  const newList: newListModel = {
    userId: parseUserId(object.uid),
    name: parseString(object.name)
  }
  return newList
}

export const toNewFavEntry = (object: any): newFavsModel => {
  const newFav: newFavsModel = {
    listId: parseUserId(object.listId),
    userId: parseUserId(object.uid),
    title: parseString(object.title),
    description: parseString(object.description),
    url: parseString(object.url)
  }
  return newFav
}
