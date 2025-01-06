import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user")); // Lấy thông tin người dùng từ localStorage
    const role = localStorage.getItem("role"); // Kiểm tra vai trò người dùng (admin hoặc user)

    // Nếu không phải admin, điều hướng đến trang chủ hoặc đăng nhập
    if (role !== "admin") {
        return <Navigate to="/" />;
    }else{

    }

    return children;
};

export default ProtectedRoute;
