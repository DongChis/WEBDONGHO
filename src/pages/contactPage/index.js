import "./style.scss"
import BreadCrumb from "../theme/breadCrum";
import React, {memo} from "react";

const ContactPage = () => {
    return(
        <>
            <BreadCrumb name="Liên hệ với chúng tôi" />
            <div className="container">
                <div className="contact-container">
                    <div className="contact-form">
                        <h2>Liên hệ với chúng tôi</h2>
                        <form action="#" method="post">
                            <div className="form-group">
                                <label htmlFor="name">Tên của bạn:</label>
                                <input className="contact-input" type="text" id="name" name="name" required/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email của bạn:</label>
                                <input className="contact-input" type="email" id="email" name="email" required/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Tin nhắn:</label>
                                <textarea id="message" name="message" rows="5" required></textarea>
                            </div>
                            <button type="submit">Gửi</button>
                        </form>
                    </div>
                    <div className="contact-info">
                        <h2>Thông tin liên hệ</h2>
                        <p><strong>Địa chỉ:</strong> Số 123, Đường ABC, Thành phố XYZ</p>
                        <p><strong>Điện thoại:</strong> 0123 456 789</p>
                        <p><strong>Email:</strong> info@example.com</p>
                    </div>
                    <div className="map">
                        <h2>Bản đồ</h2>
                        //  Insert Google Maps embed code here
                    </div>
                </div>
            </div>
        </>
    )
};

export default memo(ContactPage);