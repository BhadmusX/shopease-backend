const mongoose = require('mongoose');
const favoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "auth",
        required:true,
    },
    productId:{
        type: String,
        required: true,
    },
    title: {
        type:String,
        required:true,
    },
    category: {
         type:String,
        required:true,
    },
    imageUrl: {
         type:String,
        required:true,
    },
    price:{
         type:Number,
        required:true,
    },
    source: {
        enum: ["external", "internal"],
        type: String,
        required: true,
    }
}, {timestamps: true})
const Favorite = mongoose.model('favorite', favoriteSchema);
module.exports = Favorite;