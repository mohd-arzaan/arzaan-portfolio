import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("adminToken");

  // Agar token nahi hai, toh login page pe bhej do
  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  // Agar token hai, toh andar jaane do
  return <Outlet />;
};

export default ProtectedRoute;