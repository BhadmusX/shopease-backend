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


function getDatesInRange(startDate, endDate) {
	const dates = [];
	let currentDate = new Date(startDate);

	while (currentDate <= endDate) {
		dates.push(currentDate.toISOString().slice(0, 10));
		currentDate.setUTCDate(currentDate.getUTCDate() + 1);
	}

	return dates;
}

const getDailySalesData = async (startDate, endDate) => {
	const dailySalesData = await Order.aggregate([
			{
				$match: {
					createdAt: {
						$gte: startDate,
						$lte: endDate,
					},
				},
			},
			{
				$group: {
					_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
					sales: { $sum: 1 },
					revenue: { $sum: "$totalAmount" },
				},
			},
			{ $sort: { _id: 1 } },
	]);

		// example of dailySalesData
		// [
		// 	{
		// 		_id: "2024-08-18",
		// 		sales: 12,
		// 		revenue: 1450.75
		// 	},
		// ]

	const dateArray = getDatesInRange(startDate, endDate);

	return dateArray.map((date) => {
		const foundData = dailySalesData.find((item) => item._id === date);

		return {
			date,
			sales: foundData?.sales || 0,
			revenue: foundData?.revenue || 0,
		};
	});
};

const getDailySales = async (req, res) => {
	try {
		const endDate = new Date();
		endDate.setUTCHours(23, 59, 59, 999);

		const startDate = new Date(endDate);
		startDate.setUTCDate(startDate.getUTCDate() - 6);
		startDate.setUTCHours(0, 0, 0, 0);

		const dailySales = await getDailySalesData(startDate, endDate);
		return res.status(200).json(dailySales);
	} catch (err) {
		console.log(err);
		return res.status(500).json({message: err.message});
	}
};

module.exports = {getAnalyticsData, getDailySales, getDailySalesData};