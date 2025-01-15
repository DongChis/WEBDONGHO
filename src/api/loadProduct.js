import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "./axoisClient";

const END_POINT = {
  USER: "user",
  LOGIN: "login",
  REGISTER: "register",
  ORDER: "order",
  PRODUCT: "product",
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await axios.get(`${END_POINT.PRODUCT}`); // Endpoint API
    console.log("Dữ liệu từ API (object):", response); // Log dữ liệu trả về

    return response; // Trả về dữ liệu sản phẩm
  }
);
export const fetchNewProducts = createAsyncThunk(
  "products/fetchNewProducts",
  async () => {
    const response = await axios.get(`${END_POINT.PRODUCT}/new`); // Endpoint API
    console.log("Dữ liệu từ API (object):", response); // Log dữ liệu trả về

    return response; // Trả về dữ liệu sản phẩm
  }
);



