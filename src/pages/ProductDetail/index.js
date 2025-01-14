import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BreadCrumb from "../../pages/theme/breadCrum";
import "./style.scss";
import { addToCart } from "../../redux/Slice/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { loadProductsSelector } from "../../redux/Slice/productSlice";
import { fetchProducts } from "../../api/loadProduct";

const ProductDetail = () => {
  const { id } = useParams(); // Assuming your route parameter is named 'id'
  const products = useSelector((state) => state.products.products);
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);

  const handleAddToCart = (product) => {
    console.log("Adding to cart:", product);
    if (!product || !product.id) return;
    dispatch(addToCart(product));
    alert("sản phẩm đã được thêm vào giõ hàng");
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
    const selectedProduct = products.find(
      (item) => item.id === parseInt(id, 10)
    );
    setProduct(selectedProduct);
  }, [id, products]);

  if (!product) {
    return <div>Không tìm thấy sản phẩm!</div>;
  }

  return (
    <>
      <BreadCrumb name="Chi tiết sản phẩm" />
      <div className="container-detail">
        <div className="product-detail-container">
          <div className="product-detail-image">
            <img
              height="400px"
              width="400px"
              src={product.productImageUrl || "https://via.placeholder.com/400"}
              alt="Product Image"
            />
          </div>
          <div className="product-detail-info">
            <h1 className="product-detail-name">{product.title}</h1>
            <p className="product-detail-description">{product.description}</p>
            <p className="product-detail-price">
              {product.price.toLocaleString("vi-VN")} VND
            </p>
            <div className="product-detail-meta">
              <p>
                <strong>Thương hiệu:</strong> {product.title}
              </p>
              <p>
                <strong>Loại:</strong> {product.title}
              </p>
              <p>
                <strong>Tình trạng:</strong> {"Còn hàng"}
              </p>
            </div>
            <div className="button-group">
              <button
                onClick={() => handleAddToCart(product)}
                className="btn-add-to-cart"
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
        <div className="product-detail-specifications">
          <h2>Thông số kỹ thuật</h2>
          <ul>
            <li>
              <strong>Chất liệu:</strong> {product.material}
            </li>
            <li>
              <strong>Kích thước:</strong> {product.size}
            </li>
            <li>
              <strong>Trọng lượng:</strong> {product.weight}
            </li>
            <li>
              <strong>Màu sắc:</strong> {product.color}
            </li>
          </ul>
        </div>
        <div className="product-detail-reviews">
          <h2>Đánh giá của khách hàng</h2>
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review, index) => (
              <div key={index} className="review">
                <p>
                  <strong>{review.user}</strong>
                </p>
                <p>{review.comment}</p>
                <p>Rating: {review.rating}/5</p>
              </div>
            ))
          ) : (
            <p>Chưa có đánh giá nào.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
