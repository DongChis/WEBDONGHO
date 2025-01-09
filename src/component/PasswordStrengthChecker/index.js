import React from "react";
import "./PasswordStrengthChecker.scss";

const PasswordStrengthChecker = ({ password }) => {
    const evaluatePasswordStrength = (password) => {
        let score = 0;

        // Tiêu chí đánh giá
        if (password.length >= 8) score++; // Độ dài tối thiểu
        if (/[A-Z]/.test(password)) score++; // Chữ cái viết hoa
        if (/[a-z]/.test(password)) score++; // Chữ cái thường
        if (/\d/.test(password)) score++; // Số
        if (/[@$!%*?&#]/.test(password)) score++; // Ký tự đặc biệt

        return score;
    };

    const strength = evaluatePasswordStrength(password);

    // Xác định nhãn và màu sắc độ mạnh
    const getStrengthLabel = (score) => {
        switch (score) {
            case 0:
            case 1:
                return { label: "Yếu", className: "strength-weak" };
            case 2:
            case 3:
                return { label: "Trung bình", className: "strength-medium" };
            case 4:
                return { label: "Mạnh", className: "strength-strong" };
            case 5:
                return { label: "Rất mạnh", className: "strength-very-strong" };
            default:
                return { label: "", className: "" };
        }
    };

    const { label, className } = getStrengthLabel(strength);

    return (
        <div className="password-strength">
            <div className={`strength-bar ${className}`} />

            <p className={`strength-label ${className}`}><span className="strength-text">Độ mạnh mật khẩu:</span>
                {label}</p>
        </div>
    );
};

export default PasswordStrengthChecker;
