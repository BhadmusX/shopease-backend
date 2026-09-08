const Cart = require('../models/cartmodel');
const createcartItem = async (req, res) => {
    try{
        const userId = req.user.id;
        const {productId, qty} = req.body
        const item = await Cart.findOne({userId});

        if(item){
            item.qty += qty || 1;
            await item.save();
            return res.status(200).json(item)
        };

        const newitem = new Cart({
            productId,
            qty: qty || 1,
            userId: userId
        })

        await newitem.save();
        return res.status(201).json(newitem);
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err.message});
    }
}

module.exports = {createcartItem};