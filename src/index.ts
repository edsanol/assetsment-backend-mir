// import dotenv from 'dotenv'
// import Server from './models/server'

// dotenv.config()
// const server = new Server()
// server.execute()

import app from './app'
import { connectDb } from './db'

const port: number = 8080
void connectDb()

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
