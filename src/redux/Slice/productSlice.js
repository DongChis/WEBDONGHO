import { createSlice } from "@reduxjs/toolkit";
import productAll from '../../data/dataAll';

const initialState = {
    products: productAll,
    filteredProducts: productAll,
    productHot: [],
    cart: checkCart(),
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        loadProducts: (state, action) => {
            const products = action.payload.products;
            const cart = checkCart();
            state.products = updateProductCartStatus(products, cart);
        },
        loadProductHot: (state, action) => {
            const productHot = action.payload.productHot;
            const cart = checkCart();
            state.productHot = updateProductCartStatus(productHot, cart);
        },



        searchProducts: (state, action) => {
            const searchTerm = action.payload.toLowerCase().trim();
            if (searchTerm) {
                state.filteredProducts = state.products.filter(product =>
                    product.description.toLowerCase().includes(searchTerm)
                );
            } else {
                state.filteredProducts = state.products;
            }
        }
    }
});

const updateProductCartStatus = (products, cart) => {
    if (!Array.isArray(products)) {

        return []; // Return an empty array if products is not an array
    }
    return products.map(product => {
        const isProductInCart = cart.some(cartItem => cartItem.id === product.id);
        return {
            ...product,
            isBuying: isProductInCart,
            color: isProductInCart ? 'red' : 'blue',
        };
    });
};

function checkCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export const {
    loadProducts,
    loadProductHot,
    addCartProduct,
    removeFromCart,
    clearCart,
    searchProducts
} = productSlice.actions;

export const productReducer = productSlice.reducer;

export const loadProductsSelector = (state) => state.products.filteredProducts || [];
export const loadProductHotSelector = (state) => state.products.productHot || [];
