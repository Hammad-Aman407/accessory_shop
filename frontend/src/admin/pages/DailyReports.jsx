import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

const DailyReports = () => {
    const { url, token } = useContext(StoreContext);
    const [report, setReport] = useState({ totalSalesAmount: 0, totalProfit: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDailyReport = async () => {
            try {
                const res = await axios.get(`${url}/reports/daily`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReport(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDailyReport();
    }, [url, token]);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-dark"></div>
            </div>
        );
    }

    const chartData = [
        {
            name: "Today",
            sales: report.totalSalesAmount,
            profit: report.totalProfit,
        },
    ];

    return (
        <div className="container mt-5 mb-5 mx-lg-5 mx-2">
            <h3>Daily Reports</h3>
            <p>View today's sales and profit overview.</p>

            <div className="mb-4">
                <div className="row">
                    <div className="col-md-4 mb-2">
                        <div className="p-3 bg-light border rounded">
                            <h5>Total Sales Amount</h5>
                            <p className="fs-5">{report.totalSalesAmount}</p>
                        </div>
                    </div>
                    <div className="col-md-4 mb-2">
                        <div className="p-3 bg-light border rounded">
                            <h5>Total Profit</h5>
                            <p className="fs-5">{report.totalProfit}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-5" style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" fill="#8884d8" name="Sales" />
                        <Bar dataKey="profit" fill="#82ca9d" name="Profit" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DailyReports;
