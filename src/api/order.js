import axiosClient from "./axoisClient";

const END_POINT = {
  USER: "user",
  LOGIN: "login",
  REGISTER: "register",
  ORDER: "order",
  PRODUCT: "product",
};
export const fetchProductById = async (productId) => {
  try {
    const response = await axiosClient.get(`${END_POINT.PRODUCT}/${productId}`);
    return response;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};
export const getOrderApi = () => {
  return axiosClient.get(`${END_POINT.ORDER}`);
};
export const fetchOrderByUser = (id) => {
  return axiosClient
    .get(`${END_POINT.ORDER}/user/${id}`)
    .then((response) => {
      console.log("API Response:", response);
      return response;
    })
    .catch((error) => {
      console.error("API Error:", error);
      throw error;
    });
};
export const updateOrder = async (orderId, orderDetails) => {
  try {
    const response = await axiosClient.patch(
      `${END_POINT.ORDER}/${orderId}`,
      orderDetails
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};
export const deleteOrder = async (orderId) => {
  try {
    const response = await axiosClient.delete(`${END_POINT.ORDER}/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};
export const createOrderAPI = (order) => {
  return axiosClient
    .post(`${END_POINT.ORDER}`, order)
    .then((response) => {
      console.log("API Response:", response);
      return response;
    })
    .catch((error) => {
      console.error("API Error:", error);
      throw error;
    });
};
