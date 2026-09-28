const Product = require('../models/productmodel');
const {imageResolver} = require('../utils/imageResolver.js');
const uploadToCloudinary = require('../utils/uploadToCloudinary.js');
const cloudinary = require('../config/cloudinary.js');

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

    let imageUrl = null;
    let cloudinaryPublicId = null;

    if(req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
        cloudinaryPublicId = result.public_id;
    }

        const product = new Product({
            title,
            price,
            category,
            imageUrl,
            cloudinaryPublicId
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

      //fetch from fakeAPIstore

            let fakeApiProducts = [];
            try{
                const fakeApisRes = await fetch('https://fakestoreapi.com/products');
                if(!fakeApisRes.ok){
                    throw new Error(`Fake Store API responded with status ${fakeApisRes.status}`);
                }
                const contentType = fakeApisRes.headers.get('content-type') || '';
                if(!contentType.includes('application/json')){
                    throw new Error(`Fake Store API returned non-JSON content (${contentType || 'unknown content type'})`);
                }
                fakeApiProducts = await fakeApisRes.json();
                console.log(fakeApiProducts);
                if(!Array.isArray(fakeApiProducts)){
                    throw new Error('Fake Store API returned an unexpected response');
                }
            }catch(err){
                console.error(`Using database products only: ${err.message}`);
            }
      
      const combined = [
                ...dbproducts.map(p => ({
                    ...p.toObject(),
                    image: p.imageUrl,
                    source: 'internal'
                })),
        ...fakeApiProducts.map(p => ({...p, id: p.id.toString(), source: 'external'}))
      ];
            res.status(200).json(combined);
    }catch(err){
        console.log(err);
                res.status(500).json({message: err.message || "couldn't fetch products"})
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

        if(product.cloudinaryPublicId){
            await cloudinary.uploader.destroy(product.cloudinaryPublicId);
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
            const  result = await uploadToCloudinary(req.file.buffer);
            const updated = await Product.findByIdAndUpdate(req.params.id, {
                price,
                title,
                category,
                imageUrl: result.secure_url,
                cloudinaryPublicId: result.public_id
            }, {new: true});

            if(product.cloudinaryPublicId){
                try{
                    await cloudinary.uploader.destroy(product.cloudinaryPublicId);
                }catch(cleanupError){
                    console.error('Failed to delete replaced Cloudinary image:', cleanupError);
                }
            }
            return res.status(200).json({message: "Product Updated", updated});
        }
        const updated = await Product.findByIdAndUpdate(req.params.id, {price, title, category}, {new: true});

        res.status(200).json(updated);
    
        }catch(err){
            console.log(err);
            res.status(500).json({message: err.message})
        }
}
const toggleFeaturedProduct = async (req, res) => {
    try{
        const productId = req.params.id;

        const product = await Product.findById(productId);

        if(!product){
            return res.status(404).json({message: 'Product not found.'});
        }

        product.isFeatured = !product.isFeatured;

        const updatedProduct = await product.save();
        return res.status(200).json({message: 'product updated', updatedProduct});
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err.message});
    }
}

const getFeaturedProducts = async(req, res) => {
    try{
        const products = await Product.find({isFeatured: true}).lean()

        const formattedProducts = products.map(p => {
            const resolvedImage = imageResolver(p.imageUrl, 'internal');
            return {...p, id: p._id, image: resolvedImage, imageUrl: resolvedImage, source: 'internal'};
        });

        return res.status(200).json(formattedProducts);
    }catch(err){
        console.log(err);
        return res.status(500).json({message: err.message});
    }
}

module.exports = {createProduct, getProducts, getProductById, deleteProductById, updateProductById, getCombinedProducts, toggleFeaturedProduct, getFeaturedProducts};