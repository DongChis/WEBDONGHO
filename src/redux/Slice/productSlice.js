import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from 'reselect';
import { fetchProducts } from '../../api/loadProduct';

// **Trạng thái ban đầu**
const initialState = {
    products: [],
    productHot: [],
    cart: checkCart(),
    status: "idle", // Trạng thái API: idle, loading, succeeded, failed
    error: null,
};

// **Slice**
const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        loadProducts: (state, action) => {
            const products = action.payload || [];
            const cart = checkCart();
            state.products = updateProductCartStatus(products, cart);
            state.filteredProducts = state.products;
        },
        loadProductHot: (state, action) => {
            const productHot = action.payload;
            const cart = checkCart();
            state.productHot = updateProductCartStatus(productHot, cart);
        },
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
                state.status = "loading";
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                const products = action.payload || [];
                const cart = checkCart();
                state.products = updateProductCartStatus(products, cart);
                state.filteredProducts = state.products;
                state.status = "succeeded";
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

// **Hàm phụ trợ**
const updateProductCartStatus = (products, cart) => {
    if (!Array.isArray(products)) {
        return [];
    }
    return products.map((product) => {
        const isProductInCart = cart.some((cartItem) => cartItem.id === product.id);
        return {
            ...product,
            isBuying: isProductInCart,
            color: isProductInCart ? "red" : "blue",
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

// **Memoized Selectors**
export const loadProductsSelector = createSelector(
    (state) => state.products.filteredProducts,
    (filteredProducts) => filteredProducts || []
);

export const loadProductHotSelector = (state) => state.products.productHot;
