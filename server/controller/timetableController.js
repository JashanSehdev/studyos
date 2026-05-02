import mongoose from "mongoose";
import { TimeTable } from "../models/timetable.model.js";
import { Assignment } from "../models/assignment.model.js";

export async function getTimetable(req, res) {
    try{
        const result = await TimeTable.find({
            user_id : new mongoose.Types.ObjectId(req.userId)
        })
        
        res.json(result);

    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Server Error'})        
    }
}

// create timetable

export async function createEntry (req, res) {

    try{
        const {subject, day, start_time, end_time, room, professor} = req.body;

        const entry = await TimeTable.create({
            user_id : new mongoose.Types.ObjectId(req.userId),
            subject,
            day,
            start_time,
            end_time,
            room,
            professor
        })

        if (!entry) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        res.status(201).json(entry);

    } catch (err) {
        console.error(err);
        res.status(500).json({message:'Server Error'});        
    }
}

export async function deleteEntry (req, res) {
    const {id} = req.params;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid entry id' });
    }

    try {
        const result = await TimeTable.findOneAndDelete({
            user_id : new mongoose.Types.ObjectId(req.userId),
            _id : id
        })

        if (!result) {
            return res.status(404).json({ message: 'Entry not found' });
        }

        return res.sendStatus(204);
    } catch (err) {
        console.error(err);
        res.status(500).json({message:'Server Error'});
    }
}