
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "./style.scss";
import {loginFailure, loginStart,loginSuccess,registerStart,registerSuccess,registerFailure} from "../../redux/Slice/authSlice";
import { loginUserAPI,registerUserAPI } from "../../api/user";

const LoginModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();

    // State quản lý dữ liệu form
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "", // Chỉ dùng khi đăng ký
        rePassword: "", // Trường xác nhận mật khẩu
    });

    const [error, setError] = useState(""); // State để lưu thông báo lỗi
    const [success, setSuccess] = useState("");
    const [isRegister, setIsRegister] = useState(false); // State cho chế độ đăng ký
    const loading = useSelector((state) => state.auth.loading); // Lấy trạng thái loading từ Redux

    // Xử lý thay đổi input
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const toggleForm = () => {
        setIsRegister(!isRegister); // Toggle the state
        setSuccess("");
        setError("");
    };


    // Xử lý đăng nhập
    const handleLogin = async (e) => {


        e.preventDefault(); // Ngừng hành động gửi form mặc định
        setSuccess("");
        setError("");
        if (!formData.username || !formData.password) {
            setError("Vui lòng nhập đầy đủ tên tài khoản và mật khẩu.");
            return;
        }

        try {
            dispatch(loginStart()); // Đặt trạng thái đang tải

            // Gửi yêu cầu login đến API
            const response = await loginUserAPI({
                userName: formData.username,
                password: formData.password
            });

            if (response.user && response) {
                setSuccess("Đăng ký thành công");
                setError(null);
                dispatch(loginSuccess(response)); // Đăng nhập thành công

                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("user", JSON.stringify(response.user));

                onClose(); // Đóng modal
            } else {
                throw new Error("Tên tài khoản hoặc mật khẩu không đúng.");
            }
        } catch (error) {
            dispatch(loginFailure(error.response ? error.response : error.message));
            setError(error.response ? error.response : "Tài khoản hoặc mật khẩu không đúng.");
        }
    };

    // Xử lý đăng ký
    const handleRegister = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");


        // Kiểm tra dữ liệu đầu vào trước khi gửi yêu cầu đăng ký
        if (!formData.username || !formData.password || !formData.email || !formData.rePassword) {
            setError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }
        if(formData.password !== formData.rePassword) {
            setError("Mật khẩu và xác nhận mật khẩu không khớp.");
            return;
        }

            dispatch(registerStart()); // Đặt trạng thái đăng ký đang tải
        try {
            // Gửi yêu cầu đăng ký đến API
            const response = await registerUserAPI({
                userName: formData.username,
                password: formData.password,
                email: formData.email,
                role: true
            });

            if (response && response.message === "Đăng ký thành công!") {
                setSuccess("Đăng ký thành công");
                alert("Đăng ký thành công!");
                dispatch(registerSuccess(response)); // Đăng ký thành công

                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("user", JSON.stringify(response));

                onClose(); // Đóng modal
            } else {
                //throw new Error("Đăng ký không thành công.");
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Xử lý lỗi từ API với status 400 (BadRequest)
                setError("Đăng ký không thành công");
            }

            setError(error.response ? error.response : "Đăng ký không thành công");
            dispatch(registerFailure(error.message || "Đăng ký không thành công"));
        }
    };

    // Nếu modal không mở thì không hiển thị
    if (!isOpen) return null;
    return (
        <div className="login-modal-overlay">
            <div className="login-modal">
                <button className="close-button" onClick={onClose}>×</button>
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
                    {isRegister && (<div className = "input-group">
                        <label htmlFor="re-password">Xác Nhận mật khẩu</label>
                        <input type="password"
                        id="re-password"
                        name="re-password"
                        value = {formData.password}
                        onChange={handleChange}
                        required/>
                    </div>)}
                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}
                    <button type="submit" disabled={loading}>
                        {loading ? "Đang xử lý..." : isRegister ? "Đăng ký" : "Đăng nhập"}
                    </button>
                </form>

                <p className="toggle-register">
                    {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}
                    <span onClick={() => toggleForm()}  className="toggle-link">
                       {isRegister ? <a href="#">Đăng nhập</a> : <a href="#">Đăng ký</a>}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default LoginModal;