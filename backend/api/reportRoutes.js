const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const cron = require("node-cron");

router.get("/daily", async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const report = await Sale.aggregate([
            { $match: { saleDate: { $gte: today } } },
            {
                $group: {
                    _id: null,
                    totalSalesAmount: { $sum: { $multiply: ["$quantitySold", "$costPrice"] } },
                    totalProfit: { $sum: "$profit" }
                }
            }
        ]);

        res.json(report[0] || { totalSalesAmount: 0, totalProfit: 0 });
    } catch (error) {
        res.status(500).json({ message: "Error fetching daily report" });
    }
});

router.get("/monthly", async (req, res) => {
    try {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

        const dailyReport = await Sale.aggregate([
            { $match: { saleDate: { $gte: firstDay } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$saleDate" } },
                    dailySalesAmount: { $sum: { $multiply: ["$quantitySold", "$costPrice"] } },
                    dailyProfit: { $sum: "$profit" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const totalReport = await Sale.aggregate([
            { $match: { saleDate: { $gte: firstDay } } },
            {
                $group: {
                    _id: null,
                    totalSalesAmount: { $sum: { $multiply: ["$quantitySold", "$costPrice"] } },
                    totalProfit: { $sum: "$profit" }
                }
            }
        ]);

        res.json({
            daily: dailyReport,
            total: totalReport[0] || { totalSalesAmount: 0, totalProfit: 0 }
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching monthly report" });
    }
});

cron.schedule("0 0 1 * *", async () => {
    try {
        await Sale.deleteMany({});
        console.log("Monthly sales reset automatically");
    } catch (error) {
        console.error("Error resetting monthly sales:" );
    }
});

module.exports = router;