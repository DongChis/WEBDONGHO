import React, { memo, useState, useEffect } from 'react';
import "./style.scss";
import BreadCrumb from "../theme/breadCrum";
import ProductList from "../../component/ProductList";

const ProductPage = () => {
    return(
        <>
           <BreadCrumb name="Danh sách sản phẩm" />
            <div className="container-product">
                <ProductList />
            </div>
        </>
    )
};

export default memo(ProductPage);
