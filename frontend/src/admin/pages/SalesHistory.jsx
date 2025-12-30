import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";

dayjs.extend(customParseFormat);
dayjs.extend(utc);

const SalesHistory = () => {
    const { url, token } = useContext(StoreContext);

    const [sales, setSales] = useState([]);
    const [filteredSales, setFilteredSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchName, setSearchName] = useState("");
    const [searchDate, setSearchDate] = useState("");

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const res = await axios.get(`${url}/sales/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSales(res.data);
                setFilteredSales(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load sales history");
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchSales();
    }, [token, url]);

    useEffect(() => {
        let filtered = sales;

        if (searchName) {
            filtered = filtered.filter((sale) =>
                sale.name.toLowerCase().includes(searchName.toLowerCase())
            );
        }

        if (searchDate) {
            filtered = filtered.filter((sale) =>
                dayjs(sale.createdAt).format("YYYY-MM-DD") === searchDate
            );
        }

        setFilteredSales(filtered);
    }, [searchName, searchDate, sales]);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-dark"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center mt-4">{error}</div>
        );
    }

    return (
        <div className="container mt-5 mb-5 mx-lg-5 mx-2">
            <h3>Sales History</h3>
            <p>View all recorded sales with product details and time.</p>

            <div className="row mb-3">
                <div className="col-lg-4 col-12 mb-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Product Name"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </div>
                <div className="col-lg-4 col-12 mb-2">
                    <input
                        type="date"
                        className="form-control"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Quantity Sold</th>
                            <th>Cost Price</th>
                            <th>Selling Price</th>
                            <th>Profit</th>
                            <th>Sale Date & Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSales.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    No sales found
                                </td>
                            </tr>
                        ) : (
                            filteredSales.map((sale, index) => (
                                <tr key={sale._id}>
                                    <td>{index + 1}</td>
                                    <td>{sale.name}</td>
                                    <td>{sale.category}</td>
                                    <td>{sale.quantitySold}</td>
                                    <td>{sale.costPrice}</td>
                                    <td>{sale.sellingPrice}</td>
                                    <td>{sale.profit}</td>
                                    <td>
                                        {dayjs(sale.createdAt).format("DD/MM/YYYY hh:mm A")}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesHistory;
