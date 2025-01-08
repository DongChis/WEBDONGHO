import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BreadCrumb from "../../pages/theme/breadCrum";
import "./style.scss"
import {addToCart} from "../../redux/Slice/cartSlice";
import {useDispatch,useSelector } from "react-redux";
import { loadProductsSelector} from "../../redux/Slice/productSlice";
import {fetchProducts} from "../../api/loadProduct";





const ProductDetail = () => {
    const { id } = useParams(); // Assuming your route parameter is named 'id'
    const products = useSelector((state) => state.products.products);
    const dispatch = useDispatch();
    const [product, setProduct] = useState(null);

    const handleAddToCart = (product) => {
        console.log("Adding to cart:", product);
        if (!product || !product.id) return;
        dispatch(addToCart(product));
        alert('sản phẩm đã được thêm vào giõ hàng');
    };
    useEffect(() => {
        const fetchData = async () => {
            if (products.length === 0) {
                await dispatch(fetchProducts()).unwrap();
            }
        };

        fetchData();
    }, [dispatch, products.length]);
    useEffect(() => {
        // Tìm sản phẩm theo ID
        const selectedProduct = products.find((item) => item.id === parseInt(id, 10));
        setProduct(selectedProduct);
    }, [id, products]);




    if (!product) {

        return <div>Không tìm thấy sản phẩm!</div>;
    }


    return (
            <><BreadCrumb name="Chi tiết sản phẩm"></BreadCrumb>
                <div className="container-detail">
                    <div className="product-detail-container">
                        <div className="product-detail-image">
                            <img height="400px" width="400px" src={product.productImageUrl} alt="Product Image"/>
                        </div>
                        <div className="product-detail-info">
                            <div>
                                <h1 className="product-detail-name">{product.title}</h1>
                                <p className="product-detail-description">{product.description}</p>
                                <p className="product-detail-price">{product.price.toLocaleString("vi-VN")} VND</p>
                            </div>
                            <div className="button-group">
                                <button onClick={() => handleAddToCart(product)} className="btn-add-to-cart">Thêm vào
                                    giỏ hàng
                                </button>

                            </div>
                        </div>
                    </div>
                </div>

            </>
    );
};

export default ProductDetail;