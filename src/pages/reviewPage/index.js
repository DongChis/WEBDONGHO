import "./style.scss"
import BreadCrumb from "../theme/breadCrum";
import React, {memo} from "react";

const ReviewPage = () => {
    return(
        <>
            <BreadCrumb name="Bài viết đánh giá" />
            <div className="container">
                <section id="about" className="section">
                    <div className="container">
                        <h2>Giới Thiệu Về Đồng Hồ</h2>
                        <p>
                            Đồng hồ không chỉ là một công cụ đo thời gian mà còn là một món phụ kiện thời trang quan
                            trọng. Những chiếc đồng hồ cao cấp thể hiện đẳng cấp và phong cách của người đeo.
                            Chúng tôi tự hào giới thiệu đến bạn bộ sưu tập đồng hồ cao cấp từ các thương hiệu nổi tiếng
                            như Rolex, Omega, Seiko và nhiều hơn nữa.
                        </p>
                        <img src="watch.jpg" alt="Đồng hồ cao cấp" className="responsive-img"/>
                        <p>
                            Bộ sưu tập đồng hồ của chúng tôi bao gồm các mẫu đồng hồ cơ khí, đồng hồ điện tử và đồng hồ
                            thông minh, phục vụ cho mọi nhu cầu và sở thích của bạn.
                            Mỗi chiếc đồng hồ đều được chế tác tỉ mỉ, từ vật liệu cao cấp và công nghệ tiên tiến, đảm
                            bảo chất lượng và độ bền vượt trội.
                        </p>
                    </div>
                </section>

                <section id="features" className="section">
                    <div className="container">
                        <h2>Tính Năng Nổi Bật</h2>
                        <div className="features-grid">
                            <div className="feature-item">
                                <h3>Chất Liệu Cao Cấp</h3>
                                <p>Chúng tôi sử dụng các chất liệu cao cấp như thép không gỉ, vàng, và da thật để tạo
                                    nên những chiếc đồng hồ bền bỉ và sang trọng.</p>
                            </div>
                            <div className="feature-item">
                                <h3>Độ Chính Xác Cao</h3>
                                <p>Đồng hồ của chúng tôi được trang bị bộ máy chính xác, đảm bảo độ sai số thấp nhất,
                                    giúp bạn luôn đúng giờ trong mọi hoàn cảnh.</p>
                            </div>
                            <div className="feature-item">
                                <h3>Khả Năng Chống Nước</h3>
                                <p>Hầu hết các mẫu đồng hồ của chúng tôi đều có khả năng chống nước từ 50m đến 300m, phù
                                    hợp cho các hoạt động bơi lội và lặn biển.</p>
                            </div>
                            <div className="feature-item">
                                <h3>Thiết Kế Đa Dạng</h3>
                                <p>Chúng tôi cung cấp nhiều kiểu dáng và màu sắc khác nhau, từ cổ điển đến hiện đại, phù
                                    hợp với mọi phong cách thời trang.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="reviews" className="section">
                    <div className="container">
                        <h2>Đánh Giá Từ Khách Hàng</h2>
                        <div className="review-item">
                            <h3>Nguyễn Văn A</h3>
                            <p>"Tôi rất hài lòng với chiếc đồng hồ tôi mua từ cửa hàng này. Thiết kế đẹp, chất lượng
                                tuyệt vời và dịch vụ chăm sóc khách hàng chu đáo."</p>
                        </div>
                        <div className="review-item">
                            <h3>Trần Thị B</h3>
                            <p>"Đồng hồ rất bền và chính xác. Tôi đã sử dụng trong nhiều năm mà không gặp bất kỳ vấn đề
                                gì. Sẽ tiếp tục ủng hộ cửa hàng."</p>
                        </div>
                        <div className="review-item">
                            <h3>Lê Văn C</h3>
                            <p>"Giá cả hợp lý, chất lượng sản phẩm vượt trội. Tôi rất khuyến khích mọi người nên mua
                                đồng hồ từ cửa hàng này."</p>
                        </div>
                    </div>
                </section>

                <section id="contact" className="section">
                    <div className="container">
                        <h2>Liên Hệ</h2>
                        <p>Nếu bạn có bất kỳ câu hỏi nào hoặc muốn biết thêm thông tin, vui lòng liên hệ với chúng
                            tôi:</p>
                        <ul>
                            <li>Email: support@watchstore.com</li>
                            <li>Điện thoại: 0123 456 789</li>
                            <li>Địa chỉ: 123 Đường ABC, Quận 1, TP. Hồ Chí Minh</li>
                        </ul>
                    </div>
                </section>
            </div>
        </>
    )
};

export default memo(ReviewPage);