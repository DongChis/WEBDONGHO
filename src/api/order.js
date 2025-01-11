import axiosClient from "./axoisClient";

const END_POINT = {
  USER: "user",
  LOGIN: "login",
  REGISTER: "register",
  ORDER: "order",
};
export const getOrderApi = () => {
  return axiosClient.get(`${END_POINT.ORDER}`);
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
