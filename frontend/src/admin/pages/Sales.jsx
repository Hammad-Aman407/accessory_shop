import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import SaleModal from '../components/SaleModal';
import { toast } from "react-toastify";
import axios from "axios";

const Sales = () => {

    const { url, token } = useContext(StoreContext);

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchName, setSearchName] = useState("");
    const [searchCategory, setSearchCategory] = useState("");

    const [showSaleModal, setShowSaleModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleSaleClick = (product) => {
        setSelectedProduct(product);
        setShowSaleModal(true);
    };


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${url}/products/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProducts(res.data);
                setFilteredProducts(res.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load products");
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchProducts();
    }, [token, url]);

    useEffect(() => {
        let filtered = products;

        if (searchName) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchName.toLowerCase())
            );
        }

        if (searchCategory) {
            filtered = filtered.filter(product =>
                product.category.toLowerCase().includes(searchCategory.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    }, [searchName, searchCategory, products]);

    const handleSale = async (data) => {
        try {
            await axios.post(
                `${url}/sales/add`,
                {
                    productId: selectedProduct._id,
                    quantitySold: Number(data.quantitySold),
                    sellingPrice: Number(data.sellingPrice)
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setProducts((prev) =>
                prev
                    .map((p) =>
                        p._id === selectedProduct._id
                            ? { ...p, quantity: p.quantity - data.quantitySold }
                            : p
                    )
                    .filter((p) => p.quantity > 0)
            );

            toast.success("Sale recorded successfully");
            setShowSaleModal(false);
            setSelectedProduct(null);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to record sale");
        }
    };


    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-dark"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger text-center mt-4">
                {error}
            </div>
        );
    }

    return (
        <div className="container mt-5 mb-5 mx-lg-5 mx-2">
            <div>
                <h3>Sales</h3>
                <p>Sales the products from your inventory.</p>
            </div>

            <div className="row mb-4">
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
                        type="text"
                        className="form-control"
                        placeholder="Search by Category"
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                    />
                </div>
            </div>

            <div className="row mt-4">
                {filteredProducts.length === 0 ? (
                    <div className="col-12 text-center">
                        No products found
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <div className="col-lg-3 col-12 mb-3" key={product._id}>
                            <div className="bg-light px-3 py-3 rounded">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="mb-1">{product.name}</h6>
                                    <p className="bg-dark text-white px-1 rounded mb-1" style={{ fontSize: "0.75rem", fontWeight: "700" }}>
                                        {product.category}
                                    </p>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <p className="mb-1" style={{ fontSize: "0.85rem", fontWeight: "500" }}>Price</p>
                                    <p className="mb-1" style={{ fontSize: "0.85rem", fontWeight: "600" }}>{product.costPrice}</p>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <p className="mb-1" style={{ fontSize: "0.85rem", fontWeight: "500" }}>Quantity</p>
                                    <p className="mb-1" style={{ fontSize: "0.85rem", fontWeight: "600" }}>x{product.quantity}</p>
                                </div>
                                <div className="d-flex justify-content-end gap-2">
                                    <i
                                        className="bi bi-cash-coin text-success"
                                        role="button"
                                        title="Sell Product"
                                        onClick={() => handleSaleClick(product)}
                                    ></i>

                                </div>
                            </div>
                        </div>
                    ))
                )}
                <SaleModal
                    show={showSaleModal}
                    handleClose={() => setShowSaleModal(false)}
                    product={selectedProduct}
                    handleSale={handleSale}
                />

            </div>
        </div>
    );
};

export default Sales;
