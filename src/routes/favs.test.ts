import req from 'supertest'
import { cleanup, connectDb, disconnected } from '../db'
import app from '../app'
import { NewUserEntry, newListModel, newFavsModel } from '../utils/types'
import User, { UserEntry } from '../models/user.model'
import List, { listModel } from '../models/list.model'
import Favs, { favsModel } from '../models/favs.model'
import jwt from 'jsonwebtoken'

describe('List', () => {
  let user: UserEntry
  let token: string
  let list: listModel
  let fav: favsModel

  beforeAll(async () => {
    await connectDb()
  })

  beforeEach(async () => {
    await cleanup()

    const data: NewUserEntry = { email: 'test19@test.com', password: '12345678Aa' }
    user = await User.create(data)

    token = jwt.sign(
      { id: user.id },
      process.env.JWT_KEY as string,
      { expiresIn: 60 * 60 * 24 * 365 }
    )

    const newList: newListModel = { name: 'Carreers', userId: user.id }
    list = await List.create(newList)

    const newFav: newFavsModel = { description: 'Science', title: 'Science', url: 'http://example.com', userId: user.id, listId: list.id }
    fav = await Favs.create(newFav)
  })

  afterAll(async () => {
    await disconnected()
  })

  it('should create a fav correctly', async () => {
    const favs: newFavsModel = { description: 'Math', title: 'Math', url: 'http://example.com', userId: user.id, listId: list.id }
    const res = await req(app).post('/api/favs').send(favs).set('x-token', token)

    expect(res.statusCode).toBe(200)
    expect(res.body.message).toMatch(/Favs created/i)
  })

  it('should not create a fav because user is wrong', async () => {
    const favs: newFavsModel = { description: 'Math', title: 'Math', url: 'http://example.com', userId: user.id, listId: list.id }
    const res = await req(app).post('/api/favs').send(favs).set('x-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYjExYzczYTRiYWE1MjRiOTYyYmRmOSIsImlhdCI6MTY1NTg2MDg1OSwiZXhwIjoxNjU1OTQ3MjU5fQ.rJEreGFTYZOgZAhG6Jnm_TuHVun0QSjNmQDzWoBZZHI')

    expect(res.statusCode).toBe(404)
    expect(res.body.data).toMatch(/Invalid user/i)
  })

  it('should not create a fav because list is wrong', async () => {
    const favs: newFavsModel = { description: 'Math', title: 'Math', url: 'http://example.com', userId: user.id, listId: '62b11c73a4baa524b962bdf9' }
    const res = await req(app).post('/api/favs').send(favs).set('x-token', token)

    expect(res.statusCode).toBe(404)
    expect(res.body.data).toMatch(/Invalid list/i)
  })

  it('should get favs from lists', async () => {
    const res = await req(app).get(`/api/favs/${list.id}`).set('x-token', token)

    expect(res.statusCode).toBe(200)
    expect(res.body.message).toMatch(/Favs found/i)
  })

  it('should not get favs from lists, user wrong', async () => {
    const res = await req(app).get(`/api/favs/${list.id}`).set('x-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYjExYzczYTRiYWE1MjRiOTYyYmRmOSIsImlhdCI6MTY1NTg2MDg1OSwiZXhwIjoxNjU1OTQ3MjU5fQ.rJEreGFTYZOgZAhG6Jnm_TuHVun0QSjNmQDzWoBZZHI')

    expect(res.statusCode).toBe(404)
    expect(res.body.data).toMatch(/Invalid user/i)
  })

  it('should not get favs from lists, list wrong', async () => {
    const res = await req(app).get('/api/favs/62b11c73a4baa524b962bdf9').set('x-token', token)

    expect(res.statusCode).toBe(404)
    expect(res.body.data).toMatch(/Invalid list/i)
  })

  it('should not get list by its id', async () => {
    const res = await req(app).get(`/api/favs/search/${fav.id}`).set('x-token', token)

    expect(res.statusCode).toBe(404)
    expect(res.body.message).toMatch(/Fav coult not be found/i)
  })
})
