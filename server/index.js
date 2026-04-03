import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import cookieParser from 'cookie-parser'
import assignmentRoutes from './routes/assignments.js'
import timetableRoutes from "./routes/timetable.js"
import gpaRoutes from "./routes/gpa.js"
import notesRoutes from "./routes/notes.js"


dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')))
}

//routes
app.use("/api/auth",            authRoutes)
app.use("/api/assignments",     assignmentRoutes)
app.use("/api/timetable",       timetableRoutes)
app.use("/api/gpa",             gpaRoutes)
app.use("/api/notes",            notesRoutes)

if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res)=> {
        res.sendFile(path.join(__dirname,'../client/dist', 'index.html'));
    })
}



// app.get("/", (req, res) => {
//     res.json({ message : ` Study API is running for ${process.env.CLIENT_URL}`})
// })

app.listen(process.env.PORT || 5000, async ()=>{
    console.log(`Server running on port ${process.env.PORT}`);    
})
