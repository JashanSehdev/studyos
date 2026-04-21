import dotenv from 'dotenv'
import { log } from 'console'
import mongoose from 'mongoose'

dotenv.config()

const url = process.env.DATABASE_URL

await mongoose.connect(url)
.then(() => {
  console.log("Mongo db has been connected")
})
.catch((err) => {
  console.log("failed to connect db:", err.message)
})



