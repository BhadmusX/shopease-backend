const Order = require('../models/ordermodel.js');

const getUserOrders = async(req, res) => {
    try{
    const userId = req.user.id;
    const orders = await Order.find({user: userId});
    return res.status(200).json({orders});
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

module.exports = {getOrders, getUserOrders};