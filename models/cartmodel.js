const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "auth",
        required:true
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
    },
    qty: {
        type: Number,
        required: true,
        default: 1
    }
});

const Cart = mongoose.model('cart', cartSchema);
module.exports = Cart;