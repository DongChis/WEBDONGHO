import React, { useState, useEffect } from "react";
import { useDispatch,useSelector  } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/Slice/cartSlice";

import "./style.scss";

export function Product({ data, onView }) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [views, setViews] = useState(0);


    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        const storedViews = localStorage.getItem(`product-${data.id}-views`);
        if (storedViews) {
            setViews(parseInt(storedViews, 10));
        }
    }, [data.id]);

    const handleAddToCart = (product) => {
        if (!product || !product.id) return;

        if (isAuthenticated) {
            console.log("san pham đã được thêm");
            dispatch(addToCart(product));

            toast.success("Sản phẩm đã được thêm vào giỏ hàng!", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            alert('Bạn cần đăng nhập');
        }
    };

    const handleView = (product) => {
        if (onView) {
            onView(product); // Gọi hàm `onView` nếu có
        }

        // Nếu không có lượt xem trước đó, khởi tạo nó là 1
        const newViews = views + 1;
        setViews(newViews);
        localStorage.setItem(`product-${product.id}-views`, newViews);

        // Chuyển hướng tới trang sản phẩm
        navigate(`/product/${product.id}`);
    };

    return (
        <div className="product-card" key={data.id}>
            <img src={data.productImageUrl} alt={data.name} className="product-image"/>
            <h2 className="product-name">{data.name}</h2>
            <p className="product-description">{data.description}</p>
            <p className="product-price">{(data.price)} VND</p>
            <div className="btn-group">
                <button onClick={() => handleView(data)} className="btn-view">Xem</button>
                <button onClick={() => handleAddToCart(data)} className="btn-add-to-cart">Thêm</button>
            </div>
            <p className="product-views">Lượt xem: {views}</p>
        </div>
    );
}