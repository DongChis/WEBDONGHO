import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import BreadCrumb from "../theme/breadCrum";

import bankLogo from "../../assets/image/bidv-logo.png";
import momoLogo from "../../assets/image/momo-logo.png";
import Notification from "../NotificationBox/Notification";
import { clearCart } from "../../redux/Slice/cartSlice";
import { checkoutStart, checkoutFailure } from "../../redux/Slice/authSlice";
import { createOrderAPI } from "../../api/order";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState(""); // State để lưu thông báo lỗi
  const [success, setSuccess] = useState("");
  const loading = useSelector((state) => state.auth.loading); // Lấy trạng thái loading từ Redux

  // Lấy giỏ hàng từ Redux store
  const cartItems = useSelector((state) => state.cart.cart) || []; // Assuming the cart data is in `state.cart.items`

  // Các state cho phương thức thanh toán và giao hàng
  const [deliveryMethod, setDeliveryMethod] = useState("home");
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [onlinePaymentMethod, setOnlinePaymentMethod] = useState("bank");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // function parsePrice(priceString) {
  //   if (typeof priceString !== "string") {
  //     console.error("Invalid priceString:", priceString);
  //     return 0;
  //   }
  //   return parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
  // }

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const [customerID, setCustomerID] = useState(0);
  useEffect(() => {
    // Lấy thông tin khách hàng từ API hoặc local storage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      setCustomerID(user.id);
      console.log("Customer ID: ", user.id);
    }
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault(); // Ngừng hành động gửi form mặc định
    setSuccess("");
    setError("");
    if (deliveryMethod === "home" && (!address || !phone || !email)) {
      alert("Vui lòng điền đầy đủ thông tin nhận hàng.");
      return;
    }
    if (deliveryMethod === "store" && (!phone || !email)) {
      alert("Vui lòng điền số điện thoại và email.");
      return;
    }

    if (!isValidPhone(phone)) {
      alert("Số điện thoại không hợp lệ. Vui lòng nhập lại.");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Email không hợp lệ. Vui lòng nhập lại.");
      return;
    }
    const orderItems = cartItems.map((item) => ({
      productID: item.id,
      quantity: item.quantity,
      unitPrice: item.price,
      product: item.product,
    }));
    const totalAmount = orderItems.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0
    );
    const orderDetails = {
      customerID: customerID, // Ensure this is set correctly
      totalAmount: totalAmount, // Ensure this is set correctly
      deliveryMethod: deliveryMethod,
      paymentMethod: paymentMethod === "online" ? onlinePaymentMethod : "cod",
      address: address,
      status: "Pending",
      orderItems: orderItems,
    };
    try {
      dispatch(checkoutStart());
      console.log(orderDetails);

      const response = await createOrderAPI(orderDetails);
      if (response) {
        console.log("Order created successfully:", response);

        let message = "Đặt hàng thành công!";
        if (paymentMethod === "online") {
          message += "<br/>Hóa đơn sẽ gửi về mail sau khi đã thanh toán!";
        }
        setNotificationMessage(message);

        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
          // Xóa giỏ hàng sau khi thanh toán thành công
          dispatch(clearCart()); // Dispatch the action to clear the cart
          navigate("/", { state: { cartItems: [] } });
          window.scrollTo(0, 0);
        }, 2000);
      }
    } catch (error) {
      dispatch(
        checkoutFailure(error.response ? error.response : error.message)
      );
      setError(
        error.response
          ? error.response
          : "Đặt hàng thất bại. Vui lòng thử lại sau."
      );
    }
  };

  return (
    <>
      <BreadCrumb name="Thanh Toán" />
      <div className="checkout-page">
        <h2>Các Sản Phẩm</h2>
        <div className="checkout-items">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div className="checkout-item" key={item.id}>
                <img src={item.productImageUrl} alt={item.title} />
                <div className="item-details">
                  <p>{item.name}</p>
                  <p>Giá: {item.price.toLocaleString("de-DE")} VND</p>
                  <p>Số lượng: {item.quantity}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Giỏ hàng của bạn đang trống.</p>
          )}
        </div>

        <div className="checkout-total">
          <h3>
            Tổng Cộng: {calculateTotalPrice().toLocaleString("de-DE")} VND
          </h3>
        </div>

        <div className="delivery-method">
          <h3>Phương Thức Nhận Hàng</h3>
          <div className="option-group">
            <label>
              <input
                type="radio"
                value="home"
                checked={deliveryMethod === "home"}
                onChange={() => setDeliveryMethod("home")}
              />
              Giao hàng tận nhà
            </label>
            <label>
              <input
                type="radio"
                value="store"
                checked={deliveryMethod === "store"}
                onChange={() => setDeliveryMethod("store")}
              />
              Đến lấy tại cửa hàng
            </label>
          </div>
        </div>

        {deliveryMethod === "home" && (
          <div className="delivery-info">
            <h3>Thông Tin Nhận Hàng</h3>
            <div className="input-group">
              <label htmlFor="address">Địa chỉ</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Nhập địa chỉ nhận hàng"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email"
                required
              />
            </div>
          </div>
        )}

        {deliveryMethod === "store" && (
          <div className="delivery-info">
            <h3>Thông Tin Khách Hàng</h3>
            <div className="input-group">
              <label htmlFor="cus-phone">Số điện thoại</label>
              <input
                type="text"
                id="cus-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="cus-email">Email</label>
              <input
                type="email"
                id="cus-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email"
                required
              />
            </div>
            <h3>Thông Tin Cửa Hàng</h3>
            <div className="store-details">
              <p>Địa chỉ cửa hàng: 169 Lê Văn Chí</p>
              <p>Số điện thoại cửa hàng: 0123-456-789</p>
            </div>
          </div>
        )}

        <div className="payment-method">
          <h3>Phương Thức Thanh Toán</h3>
          <div className="option-group">
            <label>
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Thanh toán khi nhận hàng
            </label>
            <label>
              <input
                type="radio"
                value="online"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
              />
              Thanh toán online
            </label>
          </div>
        </div>

        {paymentMethod === "online" && (
          <div className="online-payment-options">
            <h3>Chọn phương thức thanh toán online:</h3>
            <div className="option-group">
              <label>
                <input
                  type="radio"
                  value="bank"
                  checked={onlinePaymentMethod === "bank"}
                  onChange={() => setOnlinePaymentMethod("bank")}
                />
                Chuyển khoản ngân hàng
              </label>
              <label>
                <input
                  type="radio"
                  value="momo"
                  checked={onlinePaymentMethod === "momo"}
                  onChange={() => setOnlinePaymentMethod("momo")}
                />
                Ví MoMo
              </label>
            </div>
          </div>
        )}

        {paymentMethod === "online" && onlinePaymentMethod === "bank" && (
          <div className="bank-details">
            <h3>Thông Tin Ngân Hàng</h3>
            <img src={bankLogo} alt="Bank Logo" />
            <p>Ngân hàng BIDV - Chi nhánh Thủ Đức</p>
            <p>Số tài khoản: 123456789</p>
            <p>Chủ tài khoản: Nguyễn Khang</p>
          </div>
        )}

        {paymentMethod === "online" && onlinePaymentMethod === "momo" && (
          <div className="momo-details">
            <h3>Thông Tin Ví MoMo</h3>
            <img src={momoLogo} alt="MoMo Logo" />
            <p>Số điện thoại: 0987654321</p>
            <p>Chủ tài khoản: Nguyễn Khang</p>
          </div>
        )}

        <button className="checkout-button" onClick={handlePayment}>
          Đặt Hàng
        </button>

        {showNotification && (
          <Notification
            message={
              <span
                dangerouslySetInnerHTML={{ __html: notificationMessage }}
              ></span>
            }
          />
        )}
      </div>
    </>
  );
};

export default Checkout;
