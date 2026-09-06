const Product = require('../models/productmodel');
const createProduct = async (req, res) => {
    const {category, title, price} =  req.body;

    if(!category || !title|| !price){
        return res.status(400).json({message: "Fill in all fields"})
    }
    try{

    const productInfo = await Product.findOne({title});
    if(productInfo){
        return res.status(409).json({message: "Product already exist"})
    };

        const product = new Product({
            title,
            price,
            category,
            imageUrl: req.file ? req.file.path : null
        })
        await product.save();
        res.status(201).json(product)
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }
}

module.exports = {createProduct};