import req from 'supertest'
import { cleanup, connectDb, disconnected } from '../db'
import app from '../app'
import { NewUserEntry, newListModel } from '../utils/types'
import User, { UserEntry } from '../models/user.model'
import List, { listModel } from '../models/list.model'
import jwt from 'jsonwebtoken'

describe('List', () => {
  let user: UserEntry
  let token: string
  let list: listModel

  beforeAll(async () => {
    await connectDb()
  })

  beforeEach(async () => {
    await cleanup()

    const data: NewUserEntry = { email: 'test@test.com', password: '12345678Aa' }
    user = await User.create(data)

    token = jwt.sign(
      { id: user.id },
      process.env.JWT_KEY as string,
      { expiresIn: 60 * 60 * 24 * 365 }
    )

    const newList: newListModel = { name: 'courses', userId: user.id }
    list = await List.create(newList)
  })

  afterAll(async () => {
    await disconnected()
  })

  it('should create a list correctly', async () => {
    const list: newListModel = { name: 'books', userId: user.id }
    const res = await req(app).post('/api/list').send(list).set('x-token', token)

    expect(res.statusCode).toBe(200)
    expect(res.body.message).toMatch(/User created/i)
  })

  it('should not create a list because user is wrong', async () => {
    const list: newListModel = { name: 'books', userId: user.id }
    const res = await req(app).post('/api/list').send(list).set('x-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYjExYzczYTRiYWE1MjRiOTYyYmRmOSIsImlhdCI6MTY1NTg2MDg1OSwiZXhwIjoxNjU1OTQ3MjU5fQ.rJEreGFTYZOgZAhG6Jnm_TuHVun0QSjNmQDzWoBZZHI')

    expect(res.statusCode).toBe(404)
    expect(res.body.data).toMatch(/Invalid user/i)
  })

  it("should search user's list", async () => {
    const res = await req(app).get('/api/list').set('x-token', token)

    expect(res.statusCode).toBe(200)
    expect(res.body.message).toMatch(/List founded/i)
  })

  it("should not found user's wrong", async () => {
    const res = await req(app).get('/api/list').set('x-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYjExYzczYTRiYWE1MjRiOTYyYmRmOSIsImlhdCI6MTY1NTg2MDg1OSwiZXhwIjoxNjU1OTQ3MjU5fQ.rJEreGFTYZOgZAhG6Jnm_TuHVun0QSjNmQDzWoBZZHI')

    expect(res.statusCode).toBe(404)
    expect(res.body.data).toMatch(/Invalid user/i)
  })

  it('should get list by id', async () => {
    const res = await req(app).get(`/api/list/${list.id}`).set('x-token', token)

    expect(res.statusCode).toBe(200)
    expect(res.body.message).toMatch(/List found/i)
  })

  it('should not found list by id, token wrong', async () => {
    const res = await req(app).get(`/api/list/${list.id}`).set('x-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYjExYzczYTRiYWE1MjRiOTYyYmRmOSIsImlhdCI6MTY1NTg2MDg1OSwiZXhwIjoxNjU1OTQ3MjU5fQ.rJEreGFTYZOgZAhG6Jnm_TuHVun0QSjNmQDzWoBZZHI')

    expect(res.statusCode).toBe(404)
    expect(res.body.data).toMatch(/Invalid user/i)
  })

  it('should not found get list by id', async () => {
    const res = await req(app).get('/api/list/62b110ff56a236f82b9aa8b2').set('x-token', token)

    expect(res.statusCode).toBe(404)
    expect(res.body.data).toMatch(/Invalid list/i)
  })

  it('should delete list by id', async () => {
    const res = await req(app).delete(`/api/list/delete/${list.id}`).set('x-token', token)

    expect(res.statusCode).toBe(200)
    expect(res.body.message).toMatch(/List deleted/i)
  })
})
