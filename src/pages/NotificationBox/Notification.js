import React from 'react';
import "./style.scss";

const Notification = ({ message }) => {
    return (
        <div className="notification">
            <div className="notification-content">
                <p>{message}</p>
                <div className="checkmark">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" overflow="visible">
                        <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                        <path className="checkmark-check" fill="none" d="M14 27l7 7 16-16"/>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Notification;
