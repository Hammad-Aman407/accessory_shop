import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';

const AddProduct = () => {

    const { url, token } = useContext(StoreContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post(
                `${url}/products/add`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            toast.success(response.data.message || "Product added successfully");
            reset();

        } catch (error) {
            console.error(error);

            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
        }
    };

    return (
        <>
            <div className="container mt-5 mb-5 mx-lg-5 mx-2">
                <div>
                    <h3>Add New Product</h3>
                    <p>Fill in the details below to add a new product to the inventory.</p>
                </div>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="w-75 mt-4">
                            <label className="form-lable">Product Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter product name"
                                {...register("name", {
                                    required: "Product name is required",
                                })}
                            />
                            {errors.name && (
                                <small className="text-danger">{errors.name.message}</small>
                            )}
                        </div>

                        <div className="w-75 mt-2">
                            <label className="form-lable">Category</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter category"
                                {...register("category", {
                                    required: "Category is required",
                                })}
                            />
                            {errors.category && (
                                <small className="text-danger">{errors.category.message}</small>
                            )}
                        </div>

                        <div className="w-75 mt-2">
                            <label className="form-lable">Cost Price</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter cost price"
                                {...register("costPrice", {
                                    required: "Cost price is required",
                                    min: {
                                        value: 1,
                                        message: "Cost price must be greater than 0",
                                    },
                                })}
                            />
                            {errors.costPrice && (
                                <small className="text-danger">{errors.costPrice.message}</small>
                            )}
                        </div>

                        <div className="w-75 mt-2">
                            <label className="form-lable">Quantity</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter quantity"
                                {...register("quantity", {
                                    required: "Quantity is required",
                                    min: {
                                        value: 1,
                                        message: "Quantity must be at least 1",
                                    },
                                })}
                            />
                            {errors.quantity && (
                                <small className="text-danger">{errors.quantity.message}</small>
                            )}
                        </div>

                        <div className="mt-3">
                            <button type="submit" className="btn btn-dark px-2">
                                Add Product
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}

export default AddProduct
