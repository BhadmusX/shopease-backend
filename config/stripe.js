const stripe = require('stripe');

const Stripe = new stripe(process.env.STRIPE_SECRET_KEY);
module.exports = Stripe;