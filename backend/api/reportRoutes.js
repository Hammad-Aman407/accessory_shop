const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const cron = require("node-cron");

router.get("/daily", async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const report = await Sale.aggregate([
        { $match: { saleDate: { $gte: today } } },
        {
            $group: {
                _id: null,
                totalSalesAmount: {
                    $sum: { $multiply: ["$sellingPrice", "$quantitySold"] }
                },
                totalProfit: { $sum: "$profit" }
            }
        }
    ]);

    res.json(report[0] || { totalSalesAmount: 0, totalProfit: 0 });
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
                    dailySalesAmount: {
                        $sum: { $multiply: ["$sellingPrice", "$quantitySold"] }
                    },
                    dailyProfit: { $sum: "$profit" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const totalReport = await Sale.aggregate([
            { $match: { saleDate: { $gte: firstDay } } },
            {
                $group: {
                    _id: null,
                    totalSalesAmount: { $sum: { $multiply: ["$sellingPrice", "$quantitySold"] } },
                    totalProfit: { $sum: "$profit" }
                }
            }
        ]);

        res.json({
            daily: dailyReport || [],
            total: totalReport[0] || { totalSalesAmount: 0, totalProfit: 0 }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching monthly report" });
    }
});

cron.schedule(
    "0 0 1 * *",
    async () => {
        try {
            const now = new Date();
            const firstDayOfCurrentMonth = new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            );

            const result = await Sale.deleteMany({
                saleDate: { $lt: firstDayOfCurrentMonth }
            });

            console.log(
                `Monthly cleanup done. Deleted ${result.deletedCount} records`
            );
        } catch (error) {
            console.error("Monthly cleanup error", error);
        }
    },
    {
        timezone: "Asia/Karachi"
    }
);

module.exports = router;