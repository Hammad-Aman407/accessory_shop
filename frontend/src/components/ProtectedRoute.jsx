import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../context/StoreContext";

const ProtectedRoute = () => {
  const { token } = useContext(StoreContext);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
