import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "./axoisClient";

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
    const response = await axios.get("https://localhost:7032/api/v1/product"); // Endpoint API
    console.log("Dữ liệu từ API (object):", response); // Log dữ liệu trả về

    return response;// Trả về dữ liệu sản phẩm
});