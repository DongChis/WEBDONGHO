import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "./style.scss";
import {
    loginFailure,
    loginStart,
    loginSuccess,
    registerStart,
    registerSuccess,
    registerFailure
} from "../../redux/Slice/authSlice";
import { loginUserAPI, registerUserAPI } from "../../api/user";
import { useNavigate } from "react-router-dom"; // Để sử dụng điều hướng

const LoginModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // State quản lý dữ liệu form
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "", // Dùng cho đăng ký và quên mật khẩu
        rePassword: "", // Trường xác nhận mật khẩu
    });

    const [error, setError] = useState(""); // State để lưu thông báo lỗi
    const [success, setSuccess] = useState(""); // State để lưu thông báo thành công
    const [isRegister, setIsRegister] = useState(false); // State cho chế độ đăng ký
    const [isForgotPassword, setIsForgotPassword] = useState(false); // State cho chế độ quên mật khẩu
    const loading = useSelector((state) => state.auth.loading); // Lấy trạng thái loading từ Redux

    // Xử lý thay đổi input
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // API quên mật khẩu
    const forgotPasswordAPI = async (data) => {
        const response = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error("Failed to send reset password email.");
        }
        return response.json();
    };

    // Xử lý quên mật khẩu
    const handleSendResetPassword = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");

        if (!formData.email) {
            setError("Vui lòng nhập email.");
            return;
        }

        try {
            const response = await forgotPasswordAPI({ email: formData.email });

            if (response && response.message === "Email khôi phục mật khẩu đã được gửi!") {
                setSuccess("Email khôi phục mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư của bạn.");
            } else {
                throw new Error("Không thể gửi email khôi phục mật khẩu.");
            }
        } catch (error) {
            setError(error.message || "Không thể gửi email khôi phục mật khẩu.");
        }
    };

    // Chuyển đổi giữa các chế độ (Đăng ký, Đăng nhập, Quên mật khẩu)
    const toggleForm = () => {
        setIsRegister(!isRegister);
        setSuccess("");
        setError("");
    };

    const toggleForgotPassword = () => {
        setIsForgotPassword(!isForgotPassword);
        setSuccess("");
        setError("");
    };

    // Xử lý đăng nhập
    const handleLogin = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");

        if (!formData.username || !formData.password) {
            setError("Vui lòng nhập đầy đủ tên tài khoản và mật khẩu.");
            return;
        }

        try {
            dispatch(loginStart());
            const response = await loginUserAPI({
                userName: formData.username,
                password: formData.password,
            });

            if (response.user) {
                setSuccess("Đăng nhập thành công");
                dispatch(loginSuccess(response));
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("user", JSON.stringify(response.user));

                if (response.user.role) {
                    localStorage.setItem("role", "admin");
                    navigate("/admin");
                } else {
                    localStorage.setItem("role", "user");
                    navigate("/");
                }

                onClose(); // Đóng modal
            } else {
                throw new Error("Tên tài khoản hoặc mật khẩu không đúng.");
            }
        } catch (error) {
            dispatch(loginFailure(error.message || "Đăng nhập thất bại."));
            setError(error.message || "Tên tài khoản hoặc mật khẩu không đúng.");
        }
    };

    // Xử lý đăng ký
    const handleRegister = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");

        if (!formData.username || !formData.password || !formData.email || !formData.rePassword) {
            setError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        if (formData.password !== formData.rePassword) {
            setError("Mật khẩu và xác nhận mật khẩu không khớp.");
            return;
        }

        try {
            dispatch(registerStart());
            const response = await registerUserAPI({
                userName: formData.username,
                password: formData.password,
                email: formData.email,
                role: false, // Mặc định vai trò user
            });

            if (response && response.message === "Đăng ký thành công!") {
                setSuccess("Đăng ký thành công");
                dispatch(registerSuccess(response));
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("user", JSON.stringify(response));
                onClose(); // Đóng modal
            } else {
                throw new Error("Đăng ký không thành công.");
            }
        } catch (error) {
            setError(error.message || "Đăng ký không thành công.");
            dispatch(registerFailure(error.message || "Đăng ký không thành công."));
        }
    };

    // Nếu modal không mở thì không hiển thị
    if (!isOpen) return null;

    return (
        <div className="login-modal-overlay">
            <div className="login-modal">
                <button className="close-button" onClick={onClose}>×</button>
                {isForgotPassword ? (
                    <>
                        <h2>Quên mật khẩu</h2>
                        <form onSubmit={handleSendResetPassword}>
                            <div className="input-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {error && <p className="error">{error}</p>}
                            {success && <p className="success">{success}</p>}
                            <button type="submit" disabled={loading}>
                                {loading ? "Đang gửi..." : "Gửi email khôi phục mật khẩu"}
                            </button>
                        </form>
                        <p className="toggle-register">
                            <span onClick={toggleForgotPassword} className="toggle-link">Quay lại đăng nhập</span>
                        </p>
                    </>
                ) : (
                    <>
                        <h2>{isRegister ? "Đăng ký" : "Đăng nhập"}</h2>
                        <form onSubmit={isRegister ? handleRegister : handleLogin}>
                            <div className="input-group">
                                <label htmlFor="username">Tên tài khoản</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {isRegister && (
                                <div className="input-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}
                            <div className="input-group">
                                <label htmlFor="password">Mật khẩu</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {isRegister && (
                                <div className="input-group">
                                    <label htmlFor="re-password">Xác nhận mật khẩu</label>
                                    <input
                                        type="password"
                                        id="re-password"
                                        name="rePassword"
                                        value={formData.rePassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            )}
                            {error && <p className="error">{error}</p>}
                            {success && <p className="success">{success}</p>}
                            <button type="submit" disabled={loading}>
                                {loading ? "Đang xử lý..." : isRegister ? "Đăng ký" : "Đăng nhập"}
                            </button>
                        </form>
                        <p className="forgot-password">
                            <span onClick={toggleForgotPassword} className="forgot-link">Quên mật khẩu?</span>
                        </p>
                        <p className="toggle-register">
                            {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}
                            <span onClick={toggleForm} className="toggle-link">
                                {isRegister ? "Đăng nhập" : "Đăng ký"}
                            </span>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default LoginModal;
