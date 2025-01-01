import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import productAll from "../../data/dataAll";
import BreadCrumb from "../../pages/theme/breadCrum";
import "./style.scss"
import {addCartProducts} from "../../redux/Slice/productSlice";
import {useDispatch} from "react-redux";
import {toast} from "react-toastify";


async function getProduct(id) {
    return productAll.find((product) => product.id == id);
}

export async function loadProduct({ params }) {
    const product = await getProduct(params.id);
    console.log("Sản phẩm : " + product);
    return product;
}

const ProductDetail = () => {
    const { id } = useParams(); // Assuming your route parameter is named 'id'
    const [product, setProduct] = useState( null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

    const handleAddToCart = (product) => {
        console.log("Adding to cart:", product);
        if (!product || !product.id) return;
        //dispatch(addCartProducts(product));
        toast.success("Sản phẩm đã được thêm vào giỏ hàng!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    useEffect(() => {
            window.scrollTo(0,0);
        async function fetchProduct() {
            try {
                const productData = await getProduct(id);
                setProduct(productData);
                setLoading(false);

            } catch (error) {
                console.error("Error fetching product:", error);
                setError(error.message);
                setLoading(false);
            }
        }
        fetchProduct();
        return () => {
        };
    }
    , [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!product) {
        return <div>Sản phẩm không tồn tại!</div>;
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
                                <p className="product-detail-price">{product.price.toLocaleString()} VND</p>
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