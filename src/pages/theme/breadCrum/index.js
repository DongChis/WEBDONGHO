import React, {memo} from 'react'
import "./style.scss";
import {Link} from "react-router-dom";
import {ROUTERS} from "../../../utils/Router/router";

const BreadCrumb = (props) => {
    return (
        <div className="breadCrumb">
            <div className="breadCrumb-text">
                <h2>WatchStore</h2>
                <div className="breadCrumb-option">
                    <ul>
                        <li className="link">
                            <Link to={ROUTERS.pages.home}>Trang chủ</Link>
                        </li>
                        <li>{props.name}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
export default memo(BreadCrumb);