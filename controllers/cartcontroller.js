const Cart = require('../models/cartmodel');
const createcartItem = async (req, res) => {
    try{
        const userId = req.user.id;
        const {productId, title, category, price, source, imageUrl, qty} = req.body
        const item = await Cart.findOne({userId, productId});

        if(item){
            item.qty += qty || 1;
            await item.save();
            return res.status(200).json(item)
        };

        const newitem = new Cart({
            productId,
            title,
            category,
            price,
            source,
            imageUrl,
            qty: qty || 1,
            userId: userId
        })

        await newitem.save();
        return res.status(201).json({message: "item Added", newitem});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err.message});
    }
}

const getCartItems = async(req, res) => {
    try{
        const userid = req.user.id;
        const items = await Cart.find({userId: userid}).populate("productId");

        return res.status(200).json(items);
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err.message});
    }
}

const deleteCartItem = async(req, res) => {
    try{
        const userid = req.user.id;
        const cartId = req.params.id;

        const item = await Cart.findOne({userId: userid, _id: cartId});
        if(!item){
            return res.status(404).json({message: "Cart item not found"});
        }

    const deleted = await Cart.findByIdAndDelete(item._id);
    return res.status(200).json(deleted);
    }catch(err){
        console(err);
        return res.status(500).json({message: err.message});
    }
}

const updateCartQty = async(req, res) => {
    try{
        const userId = req.user.id;
        const {qty} = req.body;
        const cartId = req.params.id;
        

        if(!Number.isInteger(qty) || qty < 1){
            return res.status(400).json({message: "Quantity must be at least 1"})
        }

        const item = await Cart.findOne({userId: userId, _id: cartId});

        if(!item){
            return res.status(404).json({message: "Item not found"});
        }

        const updated = await Cart.findByIdAndUpdate(
            item._id,
            {qty},
            {"returnDocument": "after"}
        );
        return res.status(200).json(updated);
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err.message})
    }
}

module.exports = {createcartItem, deleteCartItem, getCartItems, updateCartQty};