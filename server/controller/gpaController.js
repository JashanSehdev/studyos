import mongoose, { mongo } from 'mongoose'
import { GPA } from '../models/GPA.model.js'
const GRADE_POINTS = {
  'O':  10,
  'A+': 9,
  'A':  8,
  'B+': 7,
  'B':  6,
  'C':  5,
}

// get all subjects
export async function getSubjects (req, res) {

    try{
        const result = await GPA.find({
            user_id : new mongoose.Types.ObjectId(req.userId)
        })

        if (!result){
            return res.status("404").json({message: "no record found"})
        }
        res.json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server Error'});  
    }
}

export async function createSubject (req, res) {
    const { name, credits, grade, semester } = req.body

    if (!name || !credits || !grade) {
        return res.status(400).json({ message: 'name, credits, and grade are required' })
    }

    const creditsInt = Number(credits)
    if (!Number.isInteger(creditsInt) || creditsInt <= 0) {
        return res.status(400).json({ message: 'credits must be a positive integer' })
    }

    const grade_point = GRADE_POINTS[grade] ?? 0

    try {
        const result = await GPA.create({
            user_id : new mongoose.Types.ObjectId(req.userId),
            name,
            credits,
            grade,
            grade_point,
            semester
        })

        if (!result) {
            return res.status(401).json({message:"Cannot create new entry"})
        }
        res.json(result)

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}

export async function deleteSubject (req, res) {
    const id = req.params;

    try {
        const result = await GPA.findOneAndDelete({
            user_id: new mongoose.Types.ObjectId(req.userId),
            _id : new mongoose.Types.ObjectId(id)
        })

        if (!result){
            return res.json({message: "error while deleting entry"})
        }

        res.status(200).json({ message: 'Subject has been deleted' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server Error' })
    }
}