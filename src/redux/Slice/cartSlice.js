import { createSlice } from '@reduxjs/toolkit';

// Hàm để kiểm tra và khôi phục dữ liệu giỏ hàng từ localStorage
const checkCart = () => {
    try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            const parsedCart = JSON.parse(storedCart);
            // Kiểm tra nếu dữ liệu trong localStorage là mảng
            if (Array.isArray(parsedCart)) {
                // Kiểm tra tính hợp lệ của từng phần tử trong giỏ hàng
                return parsedCart.filter(item => item && item.id && item.quantity);
            } else {
                console.error('Giỏ hàng không phải là mảng!');
            }
        }
    } catch (error) {
        console.error("Lỗi khi lấy giỏ hàng từ localStorage:", error);
    }
    return []; // Trả về mảng trống nếu dữ liệu không hợp lệ
};

const initialState = {
    cart: checkCart() // Kiểm tra giỏ hàng từ localStorage khi ứng dụng khởi động
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // Thêm sản phẩm vào giỏ hàng
        addToCart: (state, action) => {
            const newItem = action.payload;

            // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
            const existingItem = state.cart.find(item => item.id === newItem.id);

            if (existingItem) {
                // Nếu có rồi, tăng số lượng và tạo mới đối tượng (giữ nguyên tính bất biến của Redux state)
                state.cart = state.cart.map(item =>
                    item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                // Nếu chưa có, thêm mới sản phẩm vào giỏ hàng
                state.cart.push({ ...newItem, quantity: 1 });
            }

            // Lưu giỏ hàng vào localStorage
            localStorage.setItem('cart', JSON.stringify(state.cart));
        },

        // Xóa sản phẩm khỏi giỏ hàng
        removeFromCart: (state, action) => {
            // Cập nhật giỏ hàng sau khi xóa sản phẩm
            state.cart = state.cart.filter(item => item.id !== action.payload.id);
            // Lưu lại giỏ hàng vào localStorage
            localStorage.setItem('cart', JSON.stringify(state.cart));
        },

        // Xóa tất cả sản phẩm trong giỏ hàng
        clearCart: (state) => {
            // Xóa toàn bộ giỏ hàng
            state.cart = [];
            // Cập nhật lại localStorage
            localStorage.setItem('cart', JSON.stringify(state.cart));
        }
    }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
