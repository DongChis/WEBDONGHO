import { createSlice } from '@reduxjs/toolkit';

// Kiểm tra trạng thái đăng nhập từ localStorage
const storedUser = localStorage.getItem('user');
const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

const initialState = {
    isAuthenticated: isAuthenticated,
    user: storedUser ? storedUser : null, // Lưu trữ thông tin người dùng
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            if (action.payload) {
                state.isAuthenticated = true;

                state.user = action.payload.username;  // Lưu thông tin người dùng
                state.loading = false;

                // Lưu vào localStorage
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('user', action.payload.username);
            } else {
                console.error("Error: action.payload không hợp lệ hoặc thiếu username");
            }
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;

            // Xóa dữ liệu trong localStorage
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
        },
        registerStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        registerSuccess: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload.username;
            state.loading = false;

            // Lưu vào localStorage
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('user', action.payload.username);
        },
        registerFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    registerStart,
    registerSuccess,
    registerFailure,
} = authSlice.actions;

export const authReducer = authSlice.reducer;

export const isAuthenticatedSelector = (state) => state.auth.isAuthenticated;
export const currentUserSelector = (state) => state.auth.user;
