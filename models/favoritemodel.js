const mongoose = require('mongoose');
const favoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "auth"
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    }
}, {timestamps: true})
const Favorite = mongoose.model('favorite', favoriteSchema);
module.exports = Favorite;