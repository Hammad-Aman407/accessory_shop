import React, { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const EditModal = ({ show, handleClose, product, handleUpdate }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        if (product) {
            reset({
                name: product.name,
                category: product.category,
                costPrice: product.costPrice,
                quantity: product.quantity
            });
        }
    }, [product, reset]);

    const onSubmit = (data) => {
        handleUpdate(data);
    };

    const onError = () => {
        toast.error("Please fix validation errors");
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Product</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="mb-2">
                    <label className="form-label">Product Name</label>
                    <input
                        type="text"
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                        {...register("name", {
                            required: "Product name is required"
                        })}
                    />
                    <div className="invalid-feedback">
                        {errors.name?.message}
                    </div>
                </div>

                <div className="mb-2">
                    <label className="form-label">Category</label>
                    <input
                        type="text"
                        className={`form-control ${errors.category ? "is-invalid" : ""}`}
                        {...register("category", {
                            required: "Category is required"
                        })}
                    />
                    <div className="invalid-feedback">
                        {errors.category?.message}
                    </div>
                </div>

                <div className="mb-2">
                    <label className="form-label">Price</label>
                    <input
                        type="number"
                        className={`form-control ${errors.costPrice ? "is-invalid" : ""}`}
                        {...register("costPrice", {
                            required: "Price is required",
                            min: {
                                value: 1,
                                message: "Price must be greater than 0"
                            }
                        })}
                    />
                    <div className="invalid-feedback">
                        {errors.costPrice?.message}
                    </div>
                </div>

                <div className="mb-2">
                    <label className="form-label">Quantity</label>
                    <input
                        type="number"
                        className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
                        {...register("quantity", {
                            required: "Quantity is required",
                            min: {
                                value: 1,
                                message: "Quantity must be greater than 0"
                            }
                        })}
                    />
                    <div className="invalid-feedback">
                        {errors.quantity?.message}
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit(onSubmit, onError)}
                >
                    Update Product
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default EditModal;
