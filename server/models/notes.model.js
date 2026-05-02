import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
    user_id : { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    title : {type: String , required : true},
    content: String,
    subject: {type: String, required: true},
    summary: String,
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});

export const Notes = mongoose.model("Notes", notesSchema);