import React, { useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const SaleModal = ({ show, handleClose, product, handleSale }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        if (product) {
            reset({
                quantitySold: "",
                sellingPrice: "",
                costPrice: product.costPrice
            });
        }
    }, [product, reset]);

    const onSubmit = (data) => {
        handleSale(data);
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Sell Product</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="mb-2">
                    <label className="form-label">Product</label>
                    <input
                        type="text"
                        className="form-control"
                        value={product?.name || ""}
                        disabled
                    />
                </div>

                <div className="mb-2">
                    <label className="form-label">Cost Price</label>
                    <input
                        type="number"
                        className="form-control"
                        disabled
                        {...register("costPrice")}
                    />
                </div>

                <div className="mb-2">
                    <label className="form-label">Quantity</label>
                    <input
                        type="number"
                        className={`form-control ${errors.quantitySold ? "is-invalid" : ""}`}
                        {...register("quantitySold", {
                            required: "Quantity is required",
                            min: {
                                value: 1,
                                message: "Quantity must be greater than 0"
                            },
                            validate: (value) =>
                                value <= product.quantity ||
                                `Only ${product.quantity} items available in stock`
                        })}
                    />
                    <div className="invalid-feedback">
                        {errors.quantitySold?.message}
                    </div>
                </div>


                <div className="mb-2">
                    <label className="form-label">Selling Price</label>
                    <input
                        type="number"
                        className={`form-control ${errors.sellingPrice ? "is-invalid" : ""}`}
                        {...register("sellingPrice", {
                            required: "Selling price is required",
                            validate: (value) =>
                                value > product.costPrice ||
                                "Selling price must be greater than cost price"
                        })}
                    />
                    <div className="invalid-feedback">
                        {errors.sellingPrice?.message}
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    variant="success"
                    onClick={handleSubmit(onSubmit)}
                >
                    Confirm Sale
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SaleModal;
