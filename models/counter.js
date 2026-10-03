const mongoose = require('mongoose');
const counterSchema = new mongoose.Schema({
   _id: {
    type: String,
    unique: true,
   } ,
   seq: {
    type: Number,
   }
}, {timestamps: true});
const Counter = mongoose.model("counter", counterSchema);
module.exports = Counter;