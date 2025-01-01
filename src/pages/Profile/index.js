import React, {memo, useState, useEffect} from 'react';
import "./style.scss";
import BreadCrumb from "../theme/breadCrum";


const Profile = () => {

    return (
        <>
            <BreadCrumb name="Giới thiệu"></BreadCrumb>
            <div className="container">
            <section className="about-section">
                <h2>Giới Thiệu Về WatchStore</h2>
                <p>WatchStore là địa chỉ mua sắm đồng hồ lớn nhất Việt Nam với hơn 10 năm kinh nghiệm trong lĩnh vực
                    này. Chúng tôi tự hào là đối tác của nhiều thương hiệu đồng hồ nổi tiếng trên thế giới như Rolex,
                    Omega, Casio và nhiều thương hiệu khác.</p>
                <p>WatchStore cam kết mang đến cho khách hàng những sản phẩm chất lượng, đa dạng về kiểu dáng và giá cả
                    phải chăng. Với dịch vụ chăm sóc khách hàng tận tình và uy tín, chúng tôi luôn đặt lợi ích của khách
                    hàng lên hàng đầu.</p>
            </section>

            <section className="history-section">
                <h2>Lịch Sử Hình Thành</h2>
                <p>WatchStore được thành lập vào năm 2010 bởi một nhóm các đam mê đồng hồ với mong muốn mang đến cho
                    người tiêu dùng Việt Nam những sản phẩm đồng hồ chất lượng hàng đầu từ các thương hiệu nổi tiếng
                    trên thế giới.</p>
                <p>Từ lúc khởi đầu với một cửa hàng nhỏ, WatchStore đã phát triển thành một trong những địa chỉ mua sắm
                    đồng hồ uy tín và được người tiêu dùng tin dùng.</p>
            </section>

            <section className="core-values-section">
                <h2>Giá Trị Cốt Lõi</h2>
                <p>WatchStore luôn cam kết tuân thủ các giá trị cốt lõi sau:</p>
                <ul>
                    <li>Chất Lượng: Chúng tôi chỉ phân phối các sản phẩm đồng hồ chính hãng, đảm bảo chất lượng và uy
                        tín.
                    </li>
                    <li>Đa Dạng: WatchStore cung cấp một loạt các sản phẩm đồng hồ đa dạng về kiểu dáng và thương
                        hiệu.
                    </li>
                    <li>
                        <li>Uy Tín: Chúng tôi luôn đặt uy tín và sự hài lòng của khách hàng lên hàng đầu.</li>
                        <li>Chăm Sóc Khách Hàng: WatchStore cam kết cung cấp dịch vụ chăm sóc khách hàng tận tình và chu
                            đáo, giúp khách hàng có trải nghiệm mua sắm thoải mái và hài lòng.
                        </li>
                    </li>
                </ul>
            </section>
            <section className="distributor-section">
                <h2>Đại Lý Phân Phối Hàng Chính Hãng</h2>
                <p>WatchStore tự hào là đại lý phân phối hàng chính hãng của nhiều thương hiệu đồng hồ nổi tiếng trên
                    thế giới. Chúng tôi cam kết cung cấp sản phẩm chính hãng, đảm bảo nguồn gốc và chất lượng sản
                    phẩm.</p>
            </section>
            <section className="events-section">
                <h2>Các Sự Kiện Cùng Đối Tác Lớn</h2>
                <p>WatchStore thường tổ chức các sự kiện đặc biệt cùng với các đối tác lớn nhằm giới thiệu sản phẩm mới,
                    chương trình khuyến mãi và tạo điều kiện cho khách hàng trải nghiệm và mua sắm với các ưu đãi đặc
                    biệt.</p>
                <p>Đừng bỏ lỡ các sự kiện đặc biệt của chúng tôi! Theo dõi trang web và các kênh truyền thông xã hội của
                    chúng tôi để cập nhật thông tin mới nhất về các sự kiện sắp tới.</p>
            </section>
            </div>
        </>
);
};

export default memo(Profile);
