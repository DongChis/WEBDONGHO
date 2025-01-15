import React, { memo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.scss";
import BreadCrumb from "../theme/breadCrum";
import {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
} from "../../redux/Slice/cartSlice";
import {
  fetchOrderByUser,
  updateOrder,
  deleteOrder,
  fetchProductById,
} from "../../api/order";

Modal.setAppElement("#root"); // Set the app element for react-modal

const ShoppingCart = () => {
  const cartItems = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editingOrder, setEditingOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [orderDetails, setOrderDetails] = useState({
    status: "",
    address: "",
    deliveryMethod: "",
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const fetchData = async () => {
      try {
        const ordersData = await fetchOrderByUser(user.id);
        const ordersWithProductNames = await Promise.all(
          ordersData.map(async (order) => {
            const orderItemsWithNames = await Promise.all(
              order.orderItems.map(async (item) => {
                if (!products[item.productID]) {
                  const product = await fetchProductById(item.productID);
                  setProducts((prevProducts) => ({
                    ...prevProducts,
                    [item.productID]: product
                      ? product.name
                      : "Unknown Product",
                  }));
                }
                return {
                  ...item,
                  name: products[item.productID] || "Unknown Product",
                };
              })
            );
            return { ...order, orderItems: orderItemsWithNames };
          })
        );
        setOrders(ordersWithProductNames);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchData();
  }, [products]);

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * (item.quantity || 1),
      0
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống.");
    } else {
      navigate("/thanh-toan", { state: { cartItems } });
      window.scrollTo(0, 0);
    }
  };

  const handleRemoveItem = (item) => {
    dispatch(removeFromCart(item));
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      dispatch(
        updateCartItemQuantity({ ...item, quantity: item.quantity - 1 })
      );
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setOrderDetails({
      status: order.status,
      address: order.address,
      deliveryMethod: order.deliveryMethod,
    });
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const confirmUpdateOrder = async () => {
    try {
      await updateOrder(editingOrder.orderID, orderDetails);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderID === editingOrder.orderID
            ? { ...order, ...orderDetails }
            : order
        )
      );
      setEditingOrder(null);
      setShowConfirm(false);
      toast.success("Order updated successfully!");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order.");
    }
  };

  const handleDeleteOrder = (orderID) => {
    const confirmDelete = async (closeToast) => {
      try {
        await deleteOrder(orderID);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.orderID !== orderID)
        );
        toast.success("Order deleted successfully!");
      } catch (error) {
        console.error("Error deleting order:", error);
        toast.error("Failed to delete order.");
      }
      closeToast();
    };

    toast(
      ({ closeToast }) => (
        <div>
          <p>Bạn có chắc chắn muốn xóa đơn hàng này?</p>
          <button onClick={() => confirmDelete(closeToast)}>Yes</button>
          <button onClick={closeToast}>No</button>
        </div>
      ),
      {
        autoClose: false,
      }
    );
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
  };

  return (
    <>
      <ToastContainer />
      <BreadCrumb name="Giỏ hàng"></BreadCrumb>
      <div className="shopping-cart">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.productImageUrl} alt={item.title} />
              <div className="item-details">
                <p>{item.name}</p>
                <p>Giá: {item.price} VND</p>
                <div className="quantity-controls">
                  <button onClick={() => handleDecreaseQuantity(item)}>
                    -
                  </button>
                  <span>{item.quantity || 1}</span>
                  <button
                    onClick={() =>
                      dispatch(
                        addToCart({ ...item, quantity: item.quantity + 1 })
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="remove-item"
                onClick={() => handleRemoveItem(item)}
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
        {cartItems.length === 0 && (
          <p className="empty-cart-message">Giỏ hàng của bạn đang trống.</p>
        )}
        <div className="cart-total">
          <h3>
            Tổng Cộng: {calculateTotalPrice().toLocaleString("de-DE")} VND
          </h3>
        </div>
        <button className="checkout-button" onClick={handleCheckout}>
          Thanh Toán
        </button>
      </div>

      <div className="order-list">
        <h2>Đơn Hàng Của Bạn</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Address</th>
              <th>Delivery Method</th>
              <th>Items</th>
              <th>Total Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderID}>
                <td>{order.orderID}</td>
                <td>{order.status}</td>
                <td>{order.address}</td>
                <td>{order.deliveryMethod}</td>
                <td>
                  {order.orderItems && order.orderItems.length > 0
                    ? order.orderItems.map((item) => item.name).join(", ")
                    : "No items"}
                </td>
                <td>{order.totalAmount.toLocaleString("de-DE")} VND</td>
                <td>
                  <button onClick={() => handleViewOrder(order)}>View</button>
                  <button onClick={() => handleDeleteOrder(order.orderID)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onRequestClose={() => setSelectedOrder(null)}
          contentLabel="Order Details"
          className="order-details-modal"
          overlayClassName="edit-order-overlay"
          shouldFocusAfterRender={false}
        >
          <div className="edit-order-form">
            <h2>Chi Tiết Đơn Hàng</h2>
            <p>
              <strong>Order ID:</strong> {selectedOrder.orderID}
            </p>
            <p>
              <strong>Order Code:</strong> {selectedOrder.orderCode}
            </p>
            <p>
              <strong>Customer ID:</strong> {selectedOrder.customerID}
            </p>
            <p>
              <strong>Total Amount:</strong>{" "}
              {selectedOrder.totalAmount.toLocaleString("de-DE")} VND
            </p>
            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(selectedOrder.orderDate).toLocaleString()}
            </p>
            <p>
              <strong>Delivery Method:</strong> {selectedOrder.deliveryMethod}
            </p>
            <p>
              <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder.address}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <h3>Order Items</h3>
            <ul>
              {selectedOrder.orderItems.map((item) => (
                <li key={item.id}>
                  <p>
                    <strong>Product Name:</strong> {item.product.name}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                  <p>
                    <strong>Unit Price:</strong>{" "}
                    {item.unitPrice.toLocaleString("de-DE")} VND
                  </p>
                  <img
                    src={item.product.productImageUrl}
                    alt={item.product.name}
                    style={{ width: "100px" }}
                  />
                </li>
              ))}
            </ul>
            <button onClick={() => handleEditOrder(selectedOrder)}>
              Edit Order
            </button>
            <button
              className="close-button"
              onClick={() => setSelectedOrder(null)}
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {editingOrder && (
        <Modal
          isOpen={!!editingOrder}
          onRequestClose={() => setEditingOrder(null)}
          contentLabel="Edit Order"
          className="edit-order-modal"
          overlayClassName="edit-order-overlay"
          shouldFocusAfterRender={false}
        >
          <div className="edit-order-form">
            <h2>Chỉnh Sửa Đơn Hàng</h2>
            <form onSubmit={handleUpdateOrder}>
              <label>
                Status:
                <input
                  type="text"
                  value={orderDetails.status}
                  disabled={true}
                  onChange={(e) =>
                    setOrderDetails({ ...orderDetails, status: e.target.value })
                  }
                />
              </label>
              <label>
                Address:
                <input
                  type="text"
                  value={orderDetails.address}
                  onChange={(e) =>
                    setOrderDetails({
                      ...orderDetails,
                      address: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Delivery Method:
                <input
                  type="text"
                  value={orderDetails.deliveryMethod}
                  onChange={(e) =>
                    setOrderDetails({
                      ...orderDetails,
                      deliveryMethod: e.target.value,
                    })
                  }
                />
              </label>
              {showConfirm ? (
                <div>
                  <p>Bạn có chắc chắn muốn cập nhật đơn hàng này?</p>
                  <button type="button" onClick={confirmUpdateOrder}>
                    Yes
                  </button>
                  <button type="button" onClick={() => setShowConfirm(false)}>
                    No
                  </button>
                </div>
              ) : (
                <>
                  <button type="submit">Cập Nhật</button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setEditingOrder(null)}
                  >
                    Hủy
                  </button>
                </>
              )}
            </form>
          </div>
        </Modal>
      )}
    </>
  );
};

export default memo(ShoppingCart);
