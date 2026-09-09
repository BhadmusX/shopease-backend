const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'auth',
        required: true,
    },
    products: [{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            unique: true,
        },
        qty:{
            type:Number,
            required: true,
            min: 1,
        },
        price:{
            type:Number,
            required:true,
            min: 0
        }
}],
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    stripeSessionId: {
        type:String,
        unique:true,
    }
}, {timestamps: true});

const Order = mongoose.model('order', orderSchema);
module.exports = Order;