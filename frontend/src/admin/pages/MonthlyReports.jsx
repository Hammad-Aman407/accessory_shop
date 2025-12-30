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
import dayjs from "dayjs";

const MonthlyReports = () => {
    const { url, token } = useContext(StoreContext);
    const [dailyData, setDailyData] = useState([]);
    const [total, setTotal] = useState({ totalSalesAmount: 0, totalProfit: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMonthlyReport = async () => {
            try {
                const res = await axios.get(`${url}/reports/monthly`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setDailyData(
                    res.data.daily.map((item) => ({
                        date: dayjs(item._id).format("DD/MM"),
                        sales: item.dailySalesAmount,
                        profit: item.dailyProfit,
                    }))
                );

                setTotal(res.data.total);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMonthlyReport();
    }, [url, token]);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-dark"></div>
            </div>
        );
    }

    return (
        <div className="container mt-5 mb-5 mx-lg-5 mx-2">
            <h3>Monthly Reports</h3>
            <p>View this month’s sales and profit overview.</p>

            <div className="mb-4">
                <div className="row">
                    <div className="col-md-4 mb-2">
                        <div className="p-3 bg-light border rounded">
                            <h5>Total Sales</h5>
                            <p className="fs-5">{total.totalSalesAmount}</p>
                        </div>
                    </div>
                    <div className="col-md-4 mb-2">
                        <div className="p-3 bg-light border rounded">
                            <h5>Total Profit</h5>
                            <p className="fs-5">{total.totalProfit}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-5" style={{ height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" fill="#8884d8" name="Sales" />
                        <Bar dataKey="profit" fill="#82ca9d" name="Profit" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Sales</th>
                            <th>Profit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dailyData.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    No sales data available
                                </td>
                            </tr>
                        ) : (
                            dailyData.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.date}</td>
                                    <td>{item.sales}</td>
                                    <td>{item.profit}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MonthlyReports;
