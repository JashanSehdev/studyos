import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({
    user_id : { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    subject: {type: String, required: true},
    day: {type: String, required: true},
    start_time : {type: String, required: true},
    end_time : { type: String, required: true},
    room: String,
    professor: String
})

export const TimeTable = mongoose.model("TimeTable", timetableSchema);