import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import cookieParser from 'cookie-parser'
import assignmentRoutes from './routes/assignments.js'
import timetableRoutes from "./routes/timetable.js"
import gpaRoutes from "./routes/gpa.js"
import notesRoutes from "./routes/notes.js"

dotenv.config()

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

//routes
app.use("/api/auth",            authRoutes)
app.use("/api/assignments",     assignmentRoutes)
app.use("/api/timetable",       timetableRoutes)
app.use("/api/gpa",             gpaRoutes)
app.use("/api/notes",            notesRoutes)



app.get("/", (req, res) => {
    res.json({ message : ' Study API is running'})
})

app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port ${process.env.PORT}`);
    
})
