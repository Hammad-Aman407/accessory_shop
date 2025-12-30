import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import DeleteModal from '../components/DeleteModal';
import EditModal from '../components/EditModal';
import { toast } from "react-toastify";
import axios from "axios";

const ViewProducts = () => {

    const { url, token } = useContext(StoreContext);

    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchName, setSearchName] = useState("");
    const [searchCategory, setSearchCategory] = useState("");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

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

    const handleDeleteClick = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const handleCloseModal = () => {
        setSelectedProduct(null);
        setShowDeleteModal(false);
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setShowEditModal(true);
    };


    const handleConfirmDelete = async () => {
        try {
            const response = await axios.delete(`${url}/products/delete/${selectedProduct._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(products.filter((p) => p._id !== selectedProduct._id));
            handleCloseModal();
            toast.success(response.data.message || "Product deleted successfully");
        } catch (err) {
            console.error(err);
            toast.error(
                err.response?.data?.message || "Failed to delete product"
            );
        }
    };

    const handleUpdateProduct = async (updatedData) => {
        try {
            const res = await axios.put(
                `${url}/products/update/${editProduct._id}`,
                updatedData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setProducts((prev) =>
                prev.map((p) =>
                    p._id === editProduct._id ? { ...p, ...updatedData } : p
                )
            );

            toast.success(res.data.message || "Product updated successfully");
            setShowEditModal(false);
            setEditProduct(null);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to update product");
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
                <h3>Products</h3>
                <p>Manage and view all products in your inventory.</p>
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
                            <div className="px-3 py-3 rounded" style={{
                                backgroundColor: "#F5F7FA",
                                border: "1px solid #E5E7EB",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
                            }}>
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
                                        className="bi bi-pencil-square text-primary"
                                        role="button"
                                        title="Edit Product"
                                        onClick={() => handleEdit(product)}
                                    ></i>
                                    <i
                                        className="bi bi-trash-fill text-danger"
                                        role="button"
                                        title="Delete Product"
                                        onClick={() => handleDeleteClick(product)}
                                    ></i>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <DeleteModal
                    show={showDeleteModal}
                    handleClose={handleCloseModal}
                    handleConfirm={handleConfirmDelete}
                />

                <EditModal
                    show={showEditModal}
                    handleClose={() => setShowEditModal(false)}
                    product={editProduct}
                    handleUpdate={handleUpdateProduct}
                />


            </div>
        </div>
    );
};

export default ViewProducts;
