import React from 'react';

const AdminLayout = ({ children }) => {
    return (
        <div>
            <div className="admin-content">
                {children}  {/* Đây là nơi hiển thị nội dung trang admin */}
            </div>
        </div>
    );
};

export default AdminLayout;