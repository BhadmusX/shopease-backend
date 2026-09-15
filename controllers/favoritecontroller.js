const Auth = require('../models/authmodel');
const Product = require('../models/productmodel');
const Favorite = require('../models/favoritemodel');
const {imageResolver} = require('../utils/imageResolver')

const createFavorite = async(req, res) => {
    try{
        const userId = req.user.id;
        const {productId, title, category, source, price, imageUrl} = req.body;
        if(!productId || !source || !title || !category || !price || !imageUrl){
            return res.status(400).json({message: "Fill in favorite details"})
        }

        const isFavorited = await Favorite.findOne({productId, userId});

        if(isFavorited){
            return res.status(409).json({message: "Favorite already exist", productId});
        }

            const favorite = new Favorite({
                title,
                category,
                source,
                price,
                imageUrl,
                userId,
                productId
            })
            await favorite.save();
            return res.status(201).json({message: "Favorite added", favorite});

    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }
}

const deleteFavorite = async (req, res) => {
    const favorite = await Favorite.findOne({
        productId: req.params.id,
        userId: req.user.id
    });

    if(!favorite){
        return res.status(404).json({message: "Favorite not found"});
    }

    const deleted = await Favorite.findByIdAndDelete(favorite._id);
    return res.status(200).json(deleted);
}

const getFavorites = async (req, res) => {
    try{
    const favorites = await Favorite.find({userId: req.user.id})
    const newFavorite = favorites.map(fav => {
        
                const resolvedImage = imageResolver(fav.imageUrl, fav.source);
                return{
                    image: resolvedImage,
                    imageUrl: resolvedImage,
          id: fav._id,
          title: fav.title,
          category: fav.category,
          price:fav.price,
          productId:fav.productId,
          source: fav.source,
        }
        } )

    return res.status(200).json(newFavorite);
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err.message});
    }
}

module.exports = {createFavorite, deleteFavorite, getFavorites};