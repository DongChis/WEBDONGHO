import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axoisClient";

// **Trạng thái ban đầu**
const initialState = {
    products: [],
    productHot: [],
    cart: checkCart(),
    status: "idle", // Trạng thái API: idle, loading, succeeded, failed
    error: null,
};

// **Async Thunk: Gọi API để lấy danh sách sản phẩm**
export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
    const response = await axios.get("https://localhost:7032/api/v1/product"); // Endpoint API
    console.log("Dữ liệu từ API (object):", response); // Log dữ liệu trả về

    return response;// Trả về dữ liệu sản phẩm
});

// **Slice**
const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        // Load dữ liệu sản phẩm từ API hoặc tĩnh
        loadProducts: (state, action) => {
            const products = action.payload || []; // Nếu payload trống, dùng dữ liệu tĩnh
            const cart = checkCart();
            state.products = updateProductCartStatus(products, cart); // Cập nhật sản phẩm đã thay đổi trạng thái giỏ hàng
            state.filteredProducts = state.products;
        },
        // Load sản phẩm nổi bật
        loadProductHot: (state, action) => {
            const productHot = action.payload;
            const cart = checkCart();
            state.productHot = updateProductCartStatus(productHot, cart);
        },
        // Tìm kiếm sản phẩm
        searchProducts: (state, action) => {
            const searchTerm = action.payload.toLowerCase().trim();
            if (searchTerm) {
                state.filteredProducts = state.products.filter((product) =>
                    product.description.toLowerCase().includes(searchTerm)
                );
            } else {
                state.filteredProducts = state.products;
            }
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = "loading"; // Trạng thái khi API đang gọi
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                const products = action.payload || []; // Kiểm tra nếu payload trống
                const cart = checkCart();
                state.products = updateProductCartStatus(products, cart); // Cập nhật sản phẩm
                state.filteredProducts = state.products; // Cập nhật danh sách sản phẩm đã lọc
                state.status = "succeeded"; // Trạng thái khi API thành công
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = "failed"; // Trạng thái khi API thất bại
                state.error = action.error.message; // Lưu lỗi
            });
    },
});

// **Hàm phụ trợ**
const updateProductCartStatus = (products, cart) => {
    if (!Array.isArray(products)) {
        return []; // Nếu không phải mảng, trả về mảng rỗng
    }
    return products.map((product) => {
        const isProductInCart = cart.some((cartItem) => cartItem.id === product.id);
        return {
            ...product,
            isBuying: isProductInCart,
            color: isProductInCart ? "red" : "blue", // Cập nhật trạng thái giỏ hàng
        };
    });
};

function checkCart() {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// **Export actions và reducer**
export const {
    loadProducts,
    loadProductHot,
    searchProducts,
} = productSlice.actions;

export const productReducer = productSlice.reducer;

export const loadProductsSelector = (state) => state.products.filteredProducts || [];
export const loadProductHotSelector = (state) => state.products.productHot;
