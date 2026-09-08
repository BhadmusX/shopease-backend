const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    category: {
        type: String,
    },
    price: {
        type: Number,
    },
    imageUrl: {
        type: String,
    }
}, {timestamps: true})

const Product = mongoose.model('product', productSchema);
module.exports = Product;