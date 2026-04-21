import mongoose from 'mongoose'

const Schema = mongoose.Schema;

// for user : name, email, password, created At
const userSchema = new Schema({
    name: {type: String, required : true},
    email: {type: String, required : true, unique:true},
    password: {type: String, required : true},
    created_at : { type: Date, default: Date.now}
});

export const User = mongoose.model('User', userSchema)