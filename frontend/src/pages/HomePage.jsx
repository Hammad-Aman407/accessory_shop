import React, { useState, useContext } from 'react';
import { useForm } from "react-hook-form";
import { StoreContext } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {

    const { url, setToken } = useContext(StoreContext);

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword)
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await axios.post(`${url}/admin/login`, {
                username: data.email,
                password: data.password
            });

            const { token } = response.data;

            setToken(token);
            localStorage.setItem("token", token);

            toast.success("Login successful!");
            navigate("/admin");
            reset();

        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error("Invalid credentials");
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="d-flex justify-content-center align-items-center hero-section">
                <div className="container hero-content glass-card pt-3 pb-5 mx-3 rounded">
                    <div>
                        <h3 className="text-center mb-3">Welcome Back!</h3>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <div className="mt-4">
                                <div>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter Email"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Invalid email format",
                                            },
                                        })}
                                    />
                                    {errors.email && (
                                        <small className="text-danger">{errors.email.message}</small>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="position-relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-control"
                                        placeholder="Enter Password"
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 8,
                                                message: "Password must be at least 8 characters",
                                            },
                                            maxLength: {
                                                value: 18,
                                                message: "Password must not exceed 15 characters",
                                            },
                                        })}
                                    />
                                    <i
                                        className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'} eye-icon position-absolute top-50 end-0 translate-middle-y pe-1`}
                                        onClick={togglePassword}
                                    />
                                </div>
                                {errors.password && (
                                    <small className="text-danger">{errors.password.message}</small>
                                )}
                            </div>

                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="w-75 mt-4 border-0 fw-bold p-2 rounded login-btn"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                                aria-hidden="true"
                                            ></span>
                                            Logging in...
                                        </>
                                    ) : (
                                        "Login"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage
