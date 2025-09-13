import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 50
    },
    email: {
        type: String,
        required: [true, 'User Email is required'],
        unique: true,
        trim: true,
        lowercasee: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
    },

    password: {
        type: String,
        required: [true, 'User Password is required'],
        minLength: 6
    }
}, { timestamp: true });

const User = mongoose.model('User', userSchema);

export default User;