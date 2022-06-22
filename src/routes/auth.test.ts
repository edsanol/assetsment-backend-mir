import req from 'supertest'
import { cleanup, connectDb, disconnected } from '../db'
import app from '../app'
import { NewUserEntry } from '../utils/types'
import User, { UserEntry } from '../models/user.model'
import jwt from 'jsonwebtoken'

describe('user', () => {
  let user: UserEntry
  let token: string

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
  })

  afterAll(async () => {
    await disconnected()
  })

  it('should create a user correctly', async () => {
    const user: NewUserEntry = { email: 'test21@test.com', password: '12345678Aa' }
    const res = await req(app).post('/auth/register').send(user)

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body.token).toMatch(
      /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
    )
  })

  it('should not create user when there is no email', async () => {
    const user = { password: '12345' }
    const res = await req(app).post('/auth/register').send(user)

    expect(res.statusCode).toBe(404)
    expect(res.body.data).toMatch(/the email format is incorrect/i)
  })

  it('should not create user when the email exists', async () => {
    const user: NewUserEntry = { email: 'test@test.com', password: '12345678Aa' }
    await req(app).post('/auth/register').send(user)
    const res = await req(app).post('/auth/register').send(user)

    expect(res.statusCode).toBe(404)
    expect(res.body.data).toMatch(/the email already exists/i)
  })

  it('should not create user when the email not exists', async () => {
    const user: NewUserEntry = { email: 'test5@test.com', password: '12345678Aa' }
    const res = await req(app).post('/auth/login').send(user)

    expect(res.statusCode).toBe(500)
    expect(res.body.data).toMatch(/the email does not exist/i)
  })

  it('should not create user when password is wrong', async () => {
    const user: NewUserEntry = { email: 'test5@test.com', password: '12345678Aa' }
    const userError: NewUserEntry = { email: 'test5@test.com', password: '1234567Aa' }
    await req(app).post('/auth/register').send(user)
    const res = await req(app).post('/auth/login').send(userError)

    expect(res.statusCode).toBe(500)
    expect(res.body.data).toMatch(/the password is incorrect/i)
  })

  it('should login correctly', async () => {
    const user: NewUserEntry = { email: 'test10@test.com', password: '12345678Aa' }
    await req(app).post('/auth/register').send(user)
    const res = await req(app).post('/auth/login').send(user)

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body.token).toMatch(
      /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/
    )
  })

  it('should list users', async () => {
    const res = await req(app).get('/auth')

    expect(res.statusCode).toBe(200)
    expect(res.body.message).toMatch(/Users found/i)
  })

  it('should get user', async () => {
    const res = await req(app).get(`/auth/${user.id}`).set('x-token', token)

    expect(res.statusCode).toBe(200)
    expect(res.body.message).toMatch(/User found/i)
  })

  it('should failed get user, wrong token', async () => {
    const res = await req(app).get(`/auth/${user.id}`).set('x-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYjExYzczYTRiYWE1MjRiOTYyYmRmOSIsImlhdCI6MTY1NTg2MDg1OSwiZXhwIjoxNjU1OTQ3MjU5fQ.rJEreGFTYZOgZAhG6Jnm_TuHVun0QSjNmQDzWoBZZHI')

    expect(res.statusCode).toBe(404)
    expect(res.body.data).toMatch(/the user does not exist/i)
  })

  it('should delete user by id', async () => {
    const res = await req(app).delete(`/auth/${user.id}`).set('x-token', token)

    expect(res.statusCode).toBe(200)
    expect(res.body.message).toMatch(/User deleted/i)
  })
})
