import mongoose from "mongoose";

const gpaSchema = new mongoose.Schema({
    user_id : { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    name: {type: String, required: true},
    credits: {type: Number, required: true},
    grade: {type: String , required: true},
    grade_point: {type: Number, required: true},
    semester: {type: String , required: true},
    created_at: {type: Date, default: Date.now},
})

export const GPA = mongoose.model("GPA", gpaSchema);
