const Stripe = require('Stripe');

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);