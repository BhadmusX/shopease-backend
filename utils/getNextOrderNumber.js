const Counter = require('../models/counter');
async function getNextOrderNumber() {
    const counter = await Counter.findOneAndUpdate(
        {_id: "order"},
        {$inc : {seq: 1}},
        {new: true, upsert: true}
    )  ;

    return counter.seq;
}

module.exports = {getNextOrderNumber};