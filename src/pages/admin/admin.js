
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
    const [users, setUsers] = useState([]); // State to store user data
    const [showUserManagement, setShowUserManagement] = useState(false);
    const [currentPanel, setCurrentPanel] = useState(null); // `null` là giao diện mặc định
    const [products, setProducts] = useState([]); // State để lưu danh sách sản phẩm
    const [loading, setLoading] = useState(true); // State để quản lý trạng thái loading
    const [editingProduct, setEditingProduct] = useState(null); // Lưu sản phẩm đang chỉnh sửa
    const [newProduct, setNewProduct] = useState({ //tạo form thêm sản pẩm
        title: '',
        name: '',
        description: '',
        url:'#',
        gender: 'male',
        price: '',
        productImageUrl: '',
    });
    const [orders, setOrders] = useState([]); // State để lưu danh sách order
    const [selectedOrder, setSelectedOrder] = useState(null); // Đơn hàng đã chọn để hiển thị chi tiết
    const [orderID, setOrderID] = useState(''); // Để nhập orderID khi tìm kiếm
    const [showOrderList, setShowOrderList] = useState(true);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };
    const handleAddProduct = (e) => {
        e.preventDefault();

        // Kiểm tra tính hợp lệ của form
        if (!newProduct.title || !newProduct.price || !newProduct.productImageUrl || !newProduct.description || !newProduct.name) {
            alert("Vui lòng nhập đầy đủ thông tin sản phẩm!");
            return;
        }

        // Gửi yêu cầu POST để thêm sản phẩm
        axios
            .post("https://localhost:7032/api/v1/product", newProduct)
            .then((response) => {
                setProducts((prevProducts) => [...prevProducts, response.data]); // Thêm sản phẩm mới vào danh sách
                alert("Sản phẩm đã được thêm thành công!");
                setNewProduct({
                    title: '',
                    name: '',
                    gender: 'male',
                    description: '',
                    price: '',
                    productImageUrl: '',
                }); // Reset lại form
            })
            .catch((error) => {
                console.error("Có lỗi khi thêm sản phẩm:", error);
                alert("Không thể thêm sản phẩm. Vui lòng thử lại.");
            });
    };

    // Lấy dữ liệu sản phẩm từ API
    useEffect(() => {
        if (currentPanel === "product") {
            axios
                .get(`https://localhost:7032/api/v1/product`) // Gửi yêu cầu GET đến API lấy sản phẩm
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

    useEffect(() => {
        if (currentPanel === "user") {
            axios
                .get('https://localhost:7032/api/v1/user') // Get users from the API
                .then((response) => {
                    setUsers(response.data); // Set the users to state
                    console.log(response.data)
                    setLoading(false); // Stop loading once data is fetched
                })
                .catch((error) => {
                    console.error("Error fetching users:", error);
                    setLoading(false); // Stop loading on error
                });
        }
    }, [currentPanel]);

    // Hàm cấp quyền
    const handleGrantRole = (userId, role) => {
        const updatedRole = { userId, role };  // { userId: ..., role: true/false }

        axios.post("https://localhost:7032/api/v1/user/grant-role", updatedRole)
            .then(response => {
                alert(`Cấp quyền thành công cho người dùng ${userId}`);
                // Cập nhật lại danh sách người dùng sau khi cấp quyền
                setUsers(prevUsers => prevUsers.map(user =>
                    user.id === userId ? { ...user, role } : user
                ));
            })
            .catch(error => {
                console.error("Có lỗi khi cấp quyền:", error);
                alert("Cấp quyền không thành công. Vui lòng thử lại.");
            });
    };

    // Hàm xóa quyền
    const handleRevokeRole = (userId) => {
        axios.post("https://localhost:7032/api/v1/user/revoke-role", { userId })
            .then(response => {
                alert(`Đã xóa quyền người dùng ${userId}`);
                // Cập nhật lại danh sách người dùng sau khi xóa quyền
                setUsers(prevUsers => prevUsers.map(user =>
                    user.id === userId ? { ...user, role: false } : user
                ));
            })
            .catch(error => {
                console.error("Có lỗi khi xóa quyền:", error);
                alert("Xóa quyền không thành công. Vui lòng thử lại.");
            });
    };
    // Lấy dữ liệu đơn hàng từ API
    useEffect(() => {
        if (currentPanel === "order") {
            setLoading(true);
            axios
                .get("https://localhost:7032/api/v1/order")
                .then((response) => {
                    console.log(response.data); // Kiểm tra dữ liệu nhận được
                    setOrders(response.data); // Lưu vào state
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Có lỗi khi lấy dữ liệu đơn hàng:", error);
                    setLoading(false);
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


    const handleDeleteProduct = (productId) => {
        // Xác nhận trước khi xóa
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
            axios
                .delete(`https://localhost:7032/api/v1/product/${productId}`) // Gửi yêu cầu DELETE
                .then(() => {
                    // Cập nhật danh sách sản phẩm sau khi xóa
                    setProducts((prevProducts) =>
                        prevProducts.filter((product) => product.id !== productId)
                    );
                    alert("Sản phẩm đã được xóa thành công!");
                })
                .catch((error) => {
                    console.error("Có lỗi khi xóa sản phẩm:", error);
                    alert("Không thể xóa sản phẩm. Vui lòng thử lại.");
                });
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product); // Lưu sản phẩm được chọn
    };
    const handleUpdateProduct = (updatedProduct) => {
        axios
            .put(`https://localhost:7032/api/v1/product/${updatedProduct.id}`, updatedProduct)
            .then(() => {
                // Cập nhật danh sách sản phẩm sau khi chỉnh sửa
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product.id === updatedProduct.id ? updatedProduct : product
                    )
                );
                alert("Sản phẩm đã được cập nhật!");
                setEditingProduct(null); // Đóng biểu mẫu chỉnh sửa
            })
            .catch((error) => {
                console.error("Có lỗi khi cập nhật sản phẩm:", error);
                alert("Không thể cập nhật sản phẩm. Vui lòng thử lại.");
            });
    };
    // Hàm xóa đơn hàng
    const handleDeleteOrder = (orderId) => {
        // Gửi yêu cầu DELETE đến API
        axios
            .delete(`https://localhost:7032/api/v1/order/${orderId}`)
            .then(() => {
                // Cập nhật lại state orders sau khi xóa thành công
                setOrders(orders.filter(order => order.OrderID !== orderId));
                alert("Đơn hàng đã được xóa!");
            })
            .catch((error) => {
                console.error("Có lỗi khi xóa đơn hàng:", error);
                alert("Không thể xóa đơn hàng. Vui lòng thử lại.");
            });
    };
    // Lấy tất cả đơn hàng khi component render
    useEffect(() => {

        if (orderID) {
            // Gửi yêu cầu GET để lấy dữ liệu đơn hàng theo orderID
            axios
                .get(`https://localhost:7032/api/v1/order/${orderID}`)
                .then((response) => {
                    setOrders([response.data]); // Chỉ hiển thị đơn hàng với orderID cụ thể
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Lỗi khi lấy đơn hàng:", error);
                    setLoading(false);
                });
        } else {
            setLoading(false); // Nếu không có orderID, không thực hiện yêu cầu
        }
    }, [orderID]);

    // Hàm hiển thị chi tiết sản phẩm trong đơn hàng
    const renderOrderItems = (orderItems) => {
        return (
            <table className="order-items-table">
                <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Image</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total Price</th>

                </tr>
                </thead>
                <tbody>
                {orderItems.map((item) => (
                    <tr key={item.id}>
                        <td>{item.product.title}</td>
                        <td><img src={item.product.productImageUrl}
                                 alt={item.product.name}
                                 style={{ width: "50px", height: "50px", objectFit: "cover" }}/> </td>
                        <td>{item.quantity}</td>
                        <td>{item.unitPrice.toLocaleString()}</td>
                        <td>{(item.quantity * item.unitPrice).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    // Hàm xử lý khi người dùng nhập orderID để tìm kiếm
    const handleSearchOrder = () => {
        setOrderID(orderID.trim()); // Nếu có orderID, thực hiện tìm kiếm
    };
// Hàm xử lý khi bấm vào "Xem đơn hàng"
    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setShowOrderList(false); // Ẩn danh sách đơn hàng khi xem chi tiết
    };

    // Hàm quay lại danh sách đơn hàng
    const handleBackToList = () => {
        setShowOrderList(true);
        setSelectedOrder(null); // Xóa trạng thái chọn đơn hàng
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
                            {editingProduct ? (
                                // Nếu đang chỉnh sửa sản phẩm, hiển thị form chỉnh sửa
                                <div className="edit__product--form">
                                    <h3>Chỉnh sửa sản phẩm</h3>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();

                                            // Kiểm tra dữ liệu trước khi cập nhật
                                            if (!editingProduct.title || !editingProduct.price || !editingProduct.productImageUrl || !editingProduct.description || !editingProduct.gender) {
                                                alert("Vui lòng nhập đầy đủ thông tin sản phẩm!");
                                                return;
                                            }

                                            // Gửi yêu cầu cập nhật
                                            if (window.confirm("Bạn có chắc chắn muốn cập nhật sản phẩm này không?")) {
                                                handleUpdateProduct(editingProduct);
                                            }
                                        }}
                                    >
                                        <label>
                                            <span>Tên sản phẩm:</span>
                                            <input
                                                type="text"
                                                placeholder="Tên sản phẩm"
                                                value={editingProduct.title}
                                                onChange={(e) =>
                                                    setEditingProduct({...editingProduct, title: e.target.value})
                                                }
                                            />
                                        </label>
                                        <label>
                                            <span>Name:</span>
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                value={editingProduct.name}
                                                onChange={(e) =>
                                                    setEditingProduct({...editingProduct, name: e.target.value})
                                                }
                                            />
                                        </label>
                                        <label>
                                            <span>Giới tính:</span>
                                            <select
                                                value={editingProduct.gender}
                                                onChange={(e) =>
                                                    setEditingProduct({...editingProduct, gender: e.target.value})
                                                }
                                            >
                                                <option value="male">Nam</option>
                                                <option value="female">Nữ</option>
                                                <option value="other">Khác</option>
                                            </select>
                                        </label>
                                        <label>
                                            <span>Mô tả sản phẩm:</span>
                                            <textarea
                                                placeholder="Mô tả sản phẩm"
                                                value={editingProduct.description}
                                                onChange={(e) =>
                                                    setEditingProduct({...editingProduct, description: e.target.value})
                                                }
                                            />
                                        </label>
                                        <label>
                                            <span>Giá sản phẩm:</span>
                                            <input
                                                type="number"
                                                placeholder="Giá sản phẩm"
                                                value={editingProduct.price}
                                                onChange={(e) =>
                                                    setEditingProduct({
                                                        ...editingProduct,
                                                        price: parseInt(e.target.value)
                                                    })
                                                }
                                            />
                                        </label>
                                        <label>
                                            <span>URL ảnh:</span>
                                            <input
                                                type="text"
                                                placeholder="URL ảnh"
                                                value={editingProduct.productImageUrl}
                                                onChange={(e) =>
                                                    setEditingProduct({
                                                        ...editingProduct,
                                                        productImageUrl: e.target.value,
                                                    })
                                                }
                                            />
                                        </label>
                                        <div className="edit__product--actions">
                                            <button type="submit">Cập nhật</button>
                                            <button type="button" onClick={() => setEditingProduct(null)}>
                                                Hủy
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                // Nếu không có sản phẩm đang chỉnh sửa, hiển thị danh sách sản phẩm
                                <>
                                    <div className="add__NewProduct">
                                        <button onClick={() => setShowProductManagement(true)}>Thêm Sản Phẩm</button>
                                        {showProductManagement && (
                                            <form onSubmit={handleAddProduct}>
                                                <label>
                                                    Tên sản phẩm:
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        placeholder="Tên sản phẩm"
                                                        value={newProduct.title}
                                                        onChange={handleInputChange}
                                                    />
                                                </label>
                                                <label>
                                                    Name:
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        placeholder="Name"
                                                        value={newProduct.name}
                                                        onChange={handleInputChange}
                                                    />
                                                </label>
                                                <label>
                                                    Giới tính:
                                                    <select
                                                        name="gender"
                                                        value={newProduct.gender}
                                                        onChange={handleInputChange}
                                                    >
                                                        <option value="male">Nam</option>
                                                        <option value="female">Nữ</option>
                                                        <option value="other">Khác</option>
                                                    </select>
                                                </label>
                                                <label>
                                                    Mô tả sản phẩm:
                                                    <textarea
                                                        name="description"
                                                        placeholder="Mô tả sản phẩm"
                                                        value={newProduct.description}
                                                        onChange={handleInputChange}
                                                    />
                                                </label>
                                                <label>
                                                    Giá sản phẩm:
                                                    <input
                                                        type="number"
                                                        name="price"
                                                        placeholder="Giá sản phẩm"
                                                        value={newProduct.price}
                                                        onChange={handleInputChange}
                                                    />
                                                </label>
                                                <label>
                                                    URL ảnh:
                                                    <input
                                                        type="text"
                                                        name="productImageUrl"
                                                        placeholder="URL ảnh"
                                                        value={newProduct.productImageUrl}
                                                        onChange={handleInputChange}
                                                    />
                                                </label>
                                                <div className="edit__product--actions">
                                                    <button type="submit">Thêm sản phẩm</button>
                                                    <button type="button"
                                                            onClick={() => setShowProductManagement(false)}>
                                                        Hủy
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                    {products && products.length > 0 ? (
                                        <table className="product__table">
                                            <thead>
                                            <tr>
                                                <th>Hình ảnh</th>
                                                <th>Tên sản phẩm</th>
                                                <th>Name</th>
                                                <th>Gender</th>
                                                <th>Description</th>
                                                <th>Giá</th>
                                                <th>Hành động</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {products.map((product) => (
                                                <tr key={product.id || product.name}>
                                                    <td>
                                                        <img className="product__img" src={product.productImageUrl}
                                                             alt={product.title}/>
                                                    </td>
                                                    <td>{product.title}</td>
                                                    <td>{product.name}</td>
                                                    <td>{product.gender}</td>
                                                    <td>{product.description}</td>
                                                    <td>{product.price} VND</td>
                                                    <td>
                                                        <button className="edit__btn"
                                                                onClick={() => handleEditProduct(product)}>Edit
                                                        </button>
                                                        <button className="delete__btn"
                                                                onClick={() => handleDeleteProduct(product.id)}>
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p>Không có sản phẩm nào để hiển thị</p>
                                    )}
                                </>
                            )}
                            <div className="add__NewProduct">
                                <button onClick={() => setShowProductManagement(true)}>Thêm Sản Phẩm</button>
                                {showProductManagement && (
                                    <form onSubmit={handleAddProduct}>
                                        <label>
                                            Tên sản phẩm:
                                            <input
                                                type="text"
                                                name="title"
                                                placeholder="Tên sản phẩm"
                                                value={newProduct.title}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                        <label>
                                            Name:
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Name"
                                                value={newProduct.name}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                        <label>
                                            Giới tính:
                                            <select
                                                name="gender"
                                                value={newProduct.gender}
                                                onChange={handleInputChange}
                                            >
                                                <option value="male">Nam</option>
                                                <option value="female">Nữ</option>
                                                <option value="other">Khác</option>
                                            </select>
                                        </label>
                                        <label>
                                            Mô tả sản phẩm:
                                            <textarea
                                                name="description"
                                                placeholder="Mô tả sản phẩm"
                                                value={newProduct.description}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                        <label>
                                            Giá sản phẩm:
                                            <input
                                                type="number"
                                                name="price"
                                                placeholder="Giá sản phẩm"
                                                value={newProduct.price}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                        <label>
                                            URL ảnh:
                                            <input
                                                type="text"
                                                name="productImageUrl"
                                                placeholder="URL ảnh"
                                                value={newProduct.productImageUrl}
                                                onChange={handleInputChange}
                                            />
                                        </label>
                                        <div className="edit__product--actions">
                                            <button type="submit">Thêm sản phẩm</button>
                                            <button type="button" onClick={() => setShowProductManagement(false)}>
                                                Hủy
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}

                    {currentPanel === "user" && (
                        <div className="product__list--admin">
                            <div className="product__list--title">
                                Quản lý người dùng
                            </div>
                            {loading ? (
                                <p>Loading users...</p> // Hiển thị trạng thái đang tải
                            ) : (
                                <table className="user-table">
                                    <thead>
                                    <tr>
                                        <th>Email</th>
                                        <th>Tên người dùng</th>
                                        <th>Vai trò</th>
                                        <th>Cập nhật quyền</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id || user.name}>
                                            <td>{user.email}</td>
                                            <td>{user.userName}</td>
                                            <td>{user.role ? "Admin" : "User"}</td>
                                            <td>
                                                <button onClick={() => handleGrantRole(user.id, true)}>Cấp quyền</button>
                                                <button onClick={() => handleRevokeRole(user.id)}>Xoá Quyền</button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                    {currentPanel === "order" && (
                        <div className="order__list--admin">
                            <div className="order__list--title">
                                Quản lý đơn hàng
                            </div>
                            {/* Hiển thị danh sách đơn hàng nếu showOrderList là true */}
                            {showOrderList && !loading && (
                                <table className="order-table">
                                    <thead>
                                    <tr>
                                        <th>Mã đơn hàng</th>
                                        <th>Mã khách hàng</th>
                                        <th>Code đơn hàng</th>
                                        <th>Thời gian</th>
                                        <th>Tổng tiền</th>
                                        <th>Trạng thái</th>
                                        <th>Hành động</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.orderID || order.orderCode}>
                                            <td>{order.orderID}</td>
                                            <td>{order.customerID}</td>
                                            <td>{order.orderCode}</td>
                                            <td>{order.orderDate}</td>
                                            <td>{order.totalAmount}</td>
                                            <td>{order.status}</td>
                                            <td>
                                                <button onClick={() => handleViewOrder(order)}>Xem đơn hàng</button>
                                                <button onClick={() => handleDeleteOrder(order.orderID)}>Xoá</button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}

                            {/* Hiển thị chi tiết đơn hàng nếu selectedOrder có giá trị */}
                            {selectedOrder && (
                                <div className="order-details">
                                    <button onClick={handleBackToList}>Trở lại danh sách</button>
                                    <h3>Chi tiết đơn hàng {selectedOrder.orderCode}</h3>
                                    <p><strong>Mã khách hàng:</strong> {selectedOrder.customerID}</p>
                                    <p><strong>Thời gian:</strong> {selectedOrder.orderDate}</p>
                                    <p><strong>Tổng tiền:</strong> {selectedOrder.totalAmount.toLocaleString()}</p>
                                    <p><strong>Trạng thái:</strong> {selectedOrder.status}</p>

                                    {/* Hiển thị sản phẩm trong đơn hàng */}
                                    {renderOrderItems(selectedOrder.orderItems)}
                                </div>
                            )}

                            {/* Hiển thị trạng thái đang tải */}
                            {loading && <p>Loading orders...</p>}
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}

export default memo(Admin);
