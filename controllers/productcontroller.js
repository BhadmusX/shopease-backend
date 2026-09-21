const Product = require('../models/productmodel');
const {imageResolver} = require('../utils/imageResolver.js')
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
        res.status(201).json({message: 'Product Created', product})
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }
}

const getProducts = async (req, res) => {
    try{
        const products = await Product.find();
        if(products.length === 0){
            return res.status(200).json([]);
        }

        const product = products.map(p => {
            return {...p.toObject(), id: p._id};
        })
        res.status(200).json(product);
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }
}

const getCombinedProducts = async (req, res) => {
    try{
      const dbproducts = await Product.find();
      const fakeApisRes = await fetch('https://fakestoreapi.com/products');
      const fakeApiProducts = await fakeApisRes.json();
      
      const combined = [
                ...dbproducts.map(p => ({
                    ...p.toObject(),
                    image: p.image || p.imageUrl,
                    imageUrl: imageResolver(p.image || p.imageUrl, 'internal'),
                    id: p._id.toString(),
                    source: 'internal'
                })),
        ...fakeApiProducts.map(p => ({...p, id: p.id.toString(), source: 'external'}))
      ];
      res.status(201).json(combined);
    }catch(err){
        console.log(err);
        res.status(500).json({message: "couldn't fetch products"})
    }
}

const getProductById = async (req, res) => {
    try{
       const product = await Product.findById(req.params.id);

       if(!product){
        return res.status(404).json({message: "Product not found"});
       }

       res.status(200).json(product);
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }
}

const deleteProductById = async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({message: "product not found"});
        }

        const deleted = await Product.findByIdAndDelete(req.params.id);
        res.status(200).json(deleted);
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }
}

const updateProductById = async(req, res) => {
    try{
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({message: "Product not found"});
        }

        const {price, title, category} = req.body

        if(req.file){
            const updated = await Product.findByIdAndUpdate(req.params.id, {price, title, category, imageUrl: req.file.path}, {new: true});
            return res.status(200).json(updated);
        }
        const updated = await Product.findByIdAndUpdate(req.params.id, {price, title, category}, {new: true});

        res.status(200).json(updated);
    
        }catch(err){
            console.log(err);
            res.status(500).json({message: err.message})
        }
}

module.exports = {createProduct, getProducts, getProductById, deleteProductById, updateProductById, getCombinedProducts};