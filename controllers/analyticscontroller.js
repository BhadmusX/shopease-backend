const Auth = require("../models/authmodel");
const Order = require("../models/ordermodel");
const Product = require("../models/productmodel");

const getAnalyticsData = async (req, res) => {
    try{
    const totalUser = await Auth.countDocuments();
    const totalProducts = await Product.countDocuments();

    const saleData = await Order.aggregate([
        {
            $group: {
                _id:null,
                totalSales:{$sum:1},
                totalRevenue: {$sum: "$totalAmount"}
            }
        }
    ])

    const {totalSales, totalRevenue} = saleData[0] || {totalSales:0, totalRevenue:0};

    // const endDate = new Date();
    // const startDate = new Date(endDate.getTime() * 7 * 24 * 60 * 60 * 1000);
    return res.status(200).json({totalUser, totalProducts, totalSales, totalRevenue});
}catch(err){
    console.log(err);
    return res.status(500).json({message: err.message});
}
}

module.exports = {getAnalyticsData};