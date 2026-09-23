const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    isFeatured: {
        type: Boolean,
        default: true,
    }
}, {timestamps: true})

const Product = mongoose.model('product', productSchema);
module.exports = Product;