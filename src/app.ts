import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import userRouter from './routes/auth'
import listRouter from './routes/list'
import favsRouter from './routes/favs'

const app = express()
dotenv.config()
app.use(express.json())
app.use(cors())

app.use('/auth', userRouter)
app.use('/api/list', listRouter)
app.use('/api/favs', favsRouter)

export default app
