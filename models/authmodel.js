const mongoose = require('mongoose');
const authSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    refreshToken:{
        type: String,
        default: null
    },
    resetTokenExpiry: {
        type: Date,
        default: null
    },
    resetTokenHash: {
        type: String,
        default: null
    }
}, {timestamps: true});

const Auth = mongoose.model("auth", authSchema);
module.exports = Auth;