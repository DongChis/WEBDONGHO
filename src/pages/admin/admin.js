import React, {memo, useEffect, useState} from "react";
import Chart from "chart.js/auto";
import {Bar} from "react-chartjs-2";
import "./style.scss";
import axios from "axios";

const data = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"], // Trục X
    datasets: [
        {
            label: "Doanh thu (VNĐ)", // Chú thích
            data: [12000000, 15000000, 20000000, 22000000, 25000000, 30000000], // Dữ liệu trục Y
            backgroundColor: [
                "rgba(75, 192, 192, 0.2)", // Màu nền
            ],
            borderColor: [
                "rgba(75, 192, 192, 1)", // Màu viền
            ],
            borderWidth: 1, // Độ dày viền
        },
    ],
};

// Cấu hình biểu đồ
const options = {
    responsive: true, // Tự động co dãn theo màn hình
    plugins: {
        legend: {
            position: "top", // Vị trí chú thích
        },
        title: {
            display: true,
            text: "Biểu đồ doanh thu tháng", // Tiêu đề biểu đồ
        },
    },
    scales: {
        y: {
            beginAtZero: true, // Bắt đầu từ 0 trên trục Y
        },
    },
};

const Admin = () => {
    const [showProductManagement, setShowProductManagement] = useState(false);
    const [showUserManagement, setShowUserManagement] = useState(false);
    const [currentPanel, setCurrentPanel] = useState(null); // `null` là giao diện mặc định
    const [products, setProducts] = useState([]); // State để lưu danh sách sản phẩm
    const [loading, setLoading] = useState(true); // State để quản lý trạng thái loading

    // Lấy dữ liệu sản phẩm từ API
    useEffect(() => {
        if (currentPanel === "product") {
            axios
                .get(`http://localhost:5048/api/v1/product`) // Gửi yêu cầu GET đến API lấy sản phẩm
                .then((response) => {
                    setProducts(response.data); // Lưu dữ liệu sản phẩm vào state
                    console.log(response.data);
                    setLoading(false); // Đặt loading thành false sau khi lấy xong dữ liệu
                })
                .catch((error) => {
                    console.error("Có lỗi khi lấy dữ liệu sản phẩm:", error);
                    setLoading(false); // Đặt loading thành false khi có lỗi
                });
        }
    }, [currentPanel]);

    // Toggle the "Quản lý sản phẩm" section
    const handleProductManagementClick = () => {
        console.log("Product Management Clicked"); // Debugging line
        // setShowProductManagement(!showProductManagement && !showUserManagement);
        setCurrentPanel("product");
    };
    const handlUserManagementClick = () => {
        console.log("Product Management Clicked"); // Debugging line
        // setShowUserManagement(!showUserManagement && !showProductManagement);
        setCurrentPanel("user");
    };
    const handlOrderManagementClick = () => {
        console.log("Product Management Clicked"); // Debugging line
        // setShowUserManagement(!showUserManagement && !showProductManagement);
        setCurrentPanel("order");
    };

    return(
        <>
            <div className="container__admin">
                <div className="container__left">
                    <div className="container__left--title">
                        Admin Panel
                    </div>
                    <ul className="list__panel">
                        <li className="panel__product--item panel__item" onClick={handleProductManagementClick}>
                            Quản lý sản phẩm
                        </li>
                        <li className="panel__user--item panel__item" onClick={handlUserManagementClick}>Quản lý người dùng</li>
                        <li className="panel__order--item panel__item" onClick={handlOrderManagementClick}>Quản đơn hàng</li>
                        <li className="panel__report--item panel__item" onClick={handleProductManagementClick}>Báo cáo</li>
                    </ul>
                </div>
                <div className="container__right">
                    {currentPanel === null &&(
                        <>
                            <div className="container__right--title">
                                Chào mừng đến bảng điều khiển quản trị
                            </div>
                            <div className="container__content">
                                <div className="overview">
                                    <div className="box">
                                        <h3>Tổng số sản phẩm</h3>
                                        <p>300</p>
                                    </div>
                                    <div className="box">
                                        <h3>Tổng số người dùng</h3>
                                        <p>3000</p>
                                    </div>
                                    <div className="box">
                                        <h3>Tổng số doanh thu</h3>
                                        <p>30000000 VND</p>
                                    </div>
                                    <div className="box">
                                        <h3>Tổng số đơn hàng</h3>
                                        <p>1000</p>
                                    </div>
                                </div>
                                <div className="charts">
                                    <h2>Biểu đồ doanh thu tháng</h2>
                                    <Bar data={data} options={options} />
                                </div>
                            </div>
                        </>
                    )}
                    {currentPanel === "product" && (
                        <div className="product__list--admin">
                            <div className="product__list--title">
                                Quản lý sản phẩm
                            </div>
                            {products && products.length > 0 ? (
                                <ul>
                                    {products.map((product) => {
                                        return (
                                            <li key={product.id || product.name}>
                                                <p className="product__title">{product.title}</p>
                                                <p>{product.price} VND</p>
                                                <img src={product.productImageUrl}/>
                                            </li>
                                            
                                        );
                                    })}
                                </ul>
                            ) : (
                                <p>Không có sản phẩm nào để hiển thị</p>
                            )}
                        </div>
                    )}
                    {currentPanel === "user" && (
                        <div className="product__list--admin">
                            <div className="product__list--title">
                                Quản lý người dùng
                            </div>
                            <p>Danh sách sản phẩm sẽ hiển thị ở đây!</p>
                        </div>
                    )}
                    {currentPanel === "order" && (
                        <div className="product__list--admin">
                            <div className="product__list--title">
                                Quản lý đơn hàng
                            </div>
                            <p>Danh sách sản phẩm sẽ hiển thị ở đây!</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default memo(Admin);
