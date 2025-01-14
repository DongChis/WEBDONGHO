import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./style.scss";
import {
  loginFailure,
  loginStart,
  loginSuccess,
  registerStart,
  registerSuccess,
  registerFailure,
} from "../../redux/Slice/authSlice";
import {
  loginUserAPI,
  registerUserAPI,
  forgotPasswordAPI,
  resetPasswordAPI,
} from "../../api/user";
import { useNavigate } from "react-router-dom";
import PasswordStrengthChecker from "../../component/PasswordStrengthChecker";

const LoginModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    rePassword: "",
    token: "", // Token để reset mật khẩu
    newPassword: "", // Mật khẩu mới
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const loading = useSelector((state) => state.auth.loading);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
      if (
        response &&
        response.message === "Email khôi phục mật khẩu đã được gửi."
      ) {
        setSuccess(
          "Email khôi phục mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư của bạn."
        );
        setIsResetPassword(true); // Chuyển sang giao diện nhập token và mật khẩu mới
      } else {
        throw new Error("Không thể gửi email khôi phục mật khẩu.");
      }
    } catch (error) {
      setError(error.message || "Không thể gửi email khôi phục mật khẩu.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!formData.token || !formData.newPassword || !formData.email) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      const response = await resetPasswordAPI({
        email: formData.email,
        token: formData.token,
        newPassword: formData.newPassword,
      });

      if (
        response &&
        response.message === "Mật khẩu đã được đặt lại thành công."
      ) {
        setSuccess(
          "Mật khẩu đã được đặt lại thành công! Bạn có thể đăng nhập."
        );
        setIsResetPassword(false); // Quay lại giao diện đăng nhập
        setIsForgotPassword(false);
      } else {
        throw new Error("Token không hợp lệ hoặc đã hết hạn.");
      }
    } catch (error) {
      setError(error.message || "Không thể đặt lại mật khẩu.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (
      !formData.username ||
      !formData.password ||
      !formData.email ||
      !formData.rePassword
    ) {
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
        role: false, // Mặc định là người dùng
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

        onClose();
      } else {
        throw new Error("Tên tài khoản hoặc mật khẩu không đúng.");
      }
    } catch (error) {
      dispatch(loginFailure(error.message || "Đăng nhập thất bại."));
      setError(error.message || "Tên tài khoản hoặc mật khẩu không đúng.");
    }
  };

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

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        {isForgotPassword ? (
          isResetPassword ? (
            <>
              <h2>Đặt lại mật khẩu</h2>
              <form onSubmit={handleResetPassword}>
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    readOnly
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="token">Token</label>
                  <input
                    type="text"
                    id="token"
                    name="token"
                    value={formData.token}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="newPassword">Mật khẩu mới</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <button type="submit" disabled={loading}>
                  {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
                </button>
              </form>
            </>
          ) : (
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
            </>
          )
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
                {/* Truyền giá trị mật khẩu vào PasswordStrengthChecker */}
                <PasswordStrengthChecker password={formData.password} />
              </div>
              {isRegister && (
                <div className="input-group">
                  <label htmlFor="rePassword">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    id="rePassword"
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
                {loading
                  ? "Đang xử lý..."
                  : isRegister
                  ? "Đăng ký"
                  : "Đăng nhập"}
              </button>
            </form>
            <p className="forgot-password">
              <span onClick={toggleForgotPassword} className="forgot-link">
                Quên mật khẩu?
              </span>
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
