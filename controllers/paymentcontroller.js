const stripe = require("../config/stripe");
const Order = require("../models/ordermodel");
const Cart = require('../models/cartmodel');

const createCheckoutSession = async (req, res)=> {
    try{
        const {products} = req.body;

        if(!Array.isArray(products) || products.length === 0){
            return res.status(400).json({message: 'Invalid or empty product array'});
        }

        let totalAmount = 0;
        const lineItems = products.map(product => {
            const amount = Math.round(product.price * 100)
            totalAmount += amount * product.qty;

            return{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.title
                    },
                    unit_amount: amount
                },
                quantity: product.qty
            }
        })

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode:"payment",
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
            metadata: {
                userId: String(req.user.id),
                products: JSON.stringify(
                    products.map((p) => ({
                        productId: p._id,
                        qty: p.qty,
                    }))
                )
            }
        })    
        res.status(201).json({id: session.id, url: session.url, totalAmount: totalAmount / 100});
        }catch(err){
            console.log(err);
            res.status(500).json({message: err.message});
        }

}

const checkOutSuccess = async (req, res) => {
    try{
        const {sessionId} = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if(session.payment_status !== "paid"){
             return res.status(400).json({ success: false, message: "Payment not completed" });
            }


            const checkedOutItems = JSON.parse(session.metadata.products);
            const productIds = checkedOutItems.map(item => item.productId);

            const cartItems = await Cart.find({
                userId: session.metadata.userId,
                productId: {$in: productIds}
            })

            const orderProducts = cartItems.map(cartItem => {
                const checkedOut = checkedOutItems.find(c => c.productId === cartItem.productId);
                return {
                    productId: cartItem.productId,
                    source: cartItem.source,
                    title: cartItem.title,
                    imageUrl: cartItem.imageUrl,
                    category: cartItem.category,
                    price: cartItem.price,
                    qty: checkedOut.qty
                };
            })


            const newOrder = new Order({
                user: session.metadata.userId,
                products: orderProducts,
            totalAmount: session.amount_total / 100,
            stripeSessionId: sessionId
            })

            await newOrder.save();

            await Cart.deleteMany({userId: session.metadata.userId,
                productId: {$in: productIds}
            })

            return res.status(201).json({success: true, message: "payment successful", orderId: newOrder._id})
    
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message})
    }
}
module.exports = {createCheckoutSession, checkOutSuccess};