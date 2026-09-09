const Stripe = require('Stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
module.exports = stripe;