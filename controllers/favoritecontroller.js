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
            return res.status(409).json({message: "Favorite already exist"});
        }

        const favorite = new Favorite({
            productId,
            userId,
        });

        await favorite.save();
        res.status(201).json(favorite)

    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }
}

const deleteFavorite = async (req, res) => {
    const {favoriteId} = req.body;
    const favorite = await Favorite.findById(favoriteId);

    if(!favorite){
        return res.status(404).json({message: "Favorite not found"});
    }

    const deleted = await favorite.findByIdAndDelete(favorite._id);
    return res.status(200).json(deleted);
}

const getFavorites = async (req, res) => {
    try{
    const favorites = await Favorite.find({userId: req.user.id}).populate("productId");

    return res.status(200).json(favorites);
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err.message});
    }
}

module.exports = {createFavorite, deleteFavorite, getFavorites};