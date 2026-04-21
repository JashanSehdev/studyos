import mongoose from 'mongoose'

const AssignmentSchema = new mongoose.Schema({
    user_id : { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    title : {type: String , required : true},
    subject : String,
    due_date : Date,
    priority: {type: String, default: "medium"},
    status: {type: String, default: "pending"},
    created_at: {type: Date, default: Date.now}
})

export const Assignment = mongoose.model('Assignment', AssignmentSchema);
