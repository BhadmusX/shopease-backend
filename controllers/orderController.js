const Order = require('../models/ordermodel.js');

const getUserOrders = async(req, res) => {
    try{
    const userId = req.user.id;
    const orders = await Order.find({user: userId});
    return res.status(200).json(orders);
    }catch(err){
        return res.status(500).json({message: "Error while getting orders" || err.message})
    }
}

const getOrders = async(req, res) => {
    try{
        const orders = await Order.find();
        return res.status(200).json(orders);
    }catch(err){
        return res.status(500).json({message: "Error while getting orders" || err.message})
    }
}

const updateOrderStatus = async(req, res) => {
    try{
        const {status} = req.body;
        const orderId = req.params.id;

        if(!orderId){
            return res.status(400).json({message: "Invalid orderId"});
        }

        const order = await Order.find({orderId: orderId});
        if(!order){
            return res.status(404).json({message: "Order not found."})
        }
        

        const updatedOrder = await Order.findByIdAndUpdate(orderId, {status: status}, {new: true, runValidators: true});

        return res.status(200).json({message: "Order updated", updatedOrder});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: "Error while updating order" || err.message});
    }
}

module.exports = {getOrders, getUserOrders, updateOrderStatus};