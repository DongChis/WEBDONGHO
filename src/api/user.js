import axiosClient from "./axoisClient";

const END_POINT = {
    USER : "user",
}

export const getUserAPI = () =>{
    return axiosClient.get(`${END_POINT.USER}`);
}



export const loginUserAPI = (userLogin) => {
    return axiosClient
        .post(`${END_POINT.USER}/login`, userLogin)
        .then(response => {
            console.log("API Response:", response.user); // In ra phản hồi từ API để kiểm tra
            return response;  // Trả về response nếu không có lỗi
        })

};

export const registerUserAPI = (userData) => {
    return axiosClient
        .post(`${END_POINT.USER}/register`, userData)
        .then(response => {
            console.log("API Response:", response);
            return response;  // Trả về response khi thành công
        })
        .catch(error => {
            console.error("API Error:", error);
            throw error;  // Ném lỗi để tiếp tục xử lý ở phần khác
        });
};
export const forgotPasswordAPI = (data) => {
    return axiosClient
        .post(`${END_POINT.USER}/forgot-password`, data)
        .then(response => {
            console.log("Forgot Password API Response:", response);
            return response;
        })
        .catch(error => {
            console.error("Forgot Password API Error:", error);
            throw error;  // Ném lỗi để xử lý tiếp
        });
};




