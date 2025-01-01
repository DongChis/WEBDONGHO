import { configureStore } from '@reduxjs/toolkit';
import { productReducer } from './Slice/productSlice';
import { authReducer } from './Slice/authSlice';
import { cartReducer } from './Slice/cartSlice'; // Import cart reducer

const store = configureStore({
    reducer: {
        products: productReducer,
        auth: authReducer,
        cart: cartReducer,  // Thêm cart reducer vào store
    }
});

export default store;
