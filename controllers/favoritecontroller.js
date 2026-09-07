const Auth = require('../models/authmodel');
const Product = require('../models/productmodel');
const Favorite = require('../models/favoritemodel');

const createFavorite = async(req, res) => {
    try{
        const userId = req.user.id;
        const {productId} = req.body;
        const product = await Product.findById(productId);

        if(!product){
            return res.status(404).json({message: 'Product not found'});
        }

        const isFavorited = await Favorite.findOne({productId, userId});

        if(isFavorited){
            return res.status(404).json({message: "Favorite already exist"});
        }

        const favorite = new Favorite({
            productId,
            userId: req.user.id
        });

        await favorite.save();
        res.status(201).json(favorite)

    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }
}

module.exports = {createFavorite};