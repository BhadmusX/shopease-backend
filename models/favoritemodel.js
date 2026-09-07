const mongoose = require('mongoose');
const favoriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth"
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }
}, {timestamps: true})
const Favorite = mongoose.model('favorite', favoriteSchema);
module.exports = Favorite;