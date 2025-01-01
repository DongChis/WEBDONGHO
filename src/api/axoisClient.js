import axios  from "axios";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const instance = axios.create({
    baseURL: process.env.REACT_APP_URL_API,
    timeout: 300000,

});

instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error('Lỗi từ server:', error); // Log chi tiết lỗi
        if (error.response) {
            // Log đầy đủ thông tin lỗi
            console.error('API Error Response:', error.response);
            throw new Error(error.response.data ? error.response.data.message : 'Lỗi không xác định từ server');
        }
        console.error('Error (No Response):', error);
        throw new Error('Không thể kết nối đến máy chủ');
    }
);


export default instance;