const stripe = require('stripe');

const stripe = new stripe(process.env.STRIPE_SECRET_KEY);
module.exports = stripe;