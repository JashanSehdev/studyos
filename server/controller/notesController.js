import mongoose from "mongoose";
import { Notes } from "../models/notes.model.js"

export async function getNotes(req, res) {
    try{
        const notes = await Notes.find({
            user_id : new mongoose.Types.ObjectId(req.userId)
        })

        if (!notes) {
            return res.status(400).send({message: "Invalid input, Entry not found"})
        }
        res.status(200).json(notes);

    } catch (err) {
        console.error(err);
        res.status(500).json({message : 'Internal Server Error'});
    }
}

export async function createNote(req, res) {
    const{title, content, subject} = req.body;
    try{

        const result = await Notes.create({
            user_id : new mongoose.Types.ObjectId(req.userId),
            title,
            content,
            subject
        })
        
        if (!result) {
            return res.status(400).json({message:"failed to create Note"})
        }
        res.status(200).json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({message : 'Internal Server Error'});        
    }
}

export async function updateNote(req, res) {
    const {title, content, subject, summary} = req.body;
    const {id} = req.params;

    try {

        const result = await Notes.findOneAndUpdate({
            user_id: new mongoose.Types.ObjectId(req.userId),
            _id : id
        },{title, content, subject}, {returnDocument: 'after'})

        res.status(200).json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({message : 'Internal Server Error'});        
    }
}

export async function deleteNote (req, res) {
    const {id} = req.params;
    try {

        const result = await Notes.findOneAndDelete({
            user_id: new mongoose.Types.ObjectId(req.userId),
            _id : id
        })

        res.status(200).json({message : 'Note Deleted Successfully'})

    } catch (err) {
        console.error(err);
        res.status(500).json({message : 'Internal Server Error'});       
    }
}