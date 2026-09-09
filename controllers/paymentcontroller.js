const stripe = require("../config/stripe");
const Order = require("../models/ordermodel");

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
                        name: product.title,
                        images:[product.imageUrl],
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
                userId: req.user.id,
                products: JSON.stringify(
                    products.map((p) => ({
                        id: p._id,
                        qty: p.qty,
                        price:p.price,
                    }))
                )
            }
        })    
        res.status(201).json({id: session.id, totalAmount: totalAmount / 100});
        }catch(err){
            console.log(err);
            res.status(500).json({message: err.message});
        }

}

const checkOutSuccess = async (req, res) => {
    try{
        const {sessionId} = req.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if(session.payment_status === "paid"){
            const products = JSON.parse(session.metadata.products);
            const newOrder = new Order({
                user: session.metadata.userId,
                products: products.map(product => ({
                    product:product.id,
                    qty: product.qty,
                    price: product.price
                })
            ),
            totalAmount: session.amount_total / 100,
            stripeSessionId: sessionId
            })

            await newOrder.save();
            return res.status(201).json({success: true, message: "payment successful", orderId: newOrder._id})
        }
        else {
    return res.status(400).json({ success: false, message: "Payment not completed" });
}
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message})
    }
}
module.exports = {createCheckoutSession, checkOutSuccess};