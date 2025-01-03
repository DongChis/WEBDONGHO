import React, { memo, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import "./style.scss";
import "./tag.scss";
import "pages/Profile/style.scss";
import { loadProductHot, loadProducts,fetchProducts } from '../../redux/Slice/productSlice';
import { loadProductHotSelector, loadProductsSelector } from '../../redux/Slice/productSlice';
import { Product } from "../../component/Product/Product";

const HomePage = () => {
    const dispatch = useDispatch();
    const hotProduct = useSelector(loadProductHotSelector);
    const products = useSelector(loadProductsSelector);
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    useEffect(() => {
        // Gọi API để tải danh sách sản phẩm và sản phẩm nổi bật
        const fetchData = async () => {
            try {
                // Gọi API cho sản phẩm nổi bật
                const allProductsData = await dispatch(fetchProducts()).unwrap(); // Nhận dữ liệu sản phẩm từ API


            } catch (error) {
                console.error("Lỗi khi tải dữ liệu sản phẩm:", error);
            }
        };

        fetchData();

        // Lấy danh sách sản phẩm đã xem từ localStorage
        const storedRecentlyViewed = localStorage.getItem("recentlyViewed");
        if (storedRecentlyViewed) {
            setRecentlyViewed(JSON.parse(storedRecentlyViewed));
        }
    }, [dispatch]);

    const handleProductView = useCallback((product) => {

        setRecentlyViewed(prev => {
            const existingProduct = prev.find(item => item.id === product.id);
            let newViewed;
            if (existingProduct) {
                newViewed = [existingProduct, ...prev.filter(item => item.id !== product.id)];
            } else {
                newViewed = [product, ...prev];
            }
            const viewed = newViewed.slice(0, 3);

            localStorage.setItem('recentlyViewed', JSON.stringify(viewed));
            return viewed;
        });
    }, []);




    const sliderSettings = {
        dots: true,
        infinite: true,
        slidesToScroll: 2,
        slidesToShow: 3,
        speed: 500,
        arrows: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true,
                    arrows: true,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1,
                    arrows: true,
                }
            }
        ]
    };

    const groupProductsByTitle = (data) => {
        // Ensure 'data' is a valid array before calling 'reduce'
        if (!Array.isArray(data)) {
            return {};  // Return an empty object if 'data' is not an array
        }

        return data.reduce((acc, product) => {
            if (!product || !product.title) return acc; // Ensure each product has a title
            const { title } = product;
            if (!acc[title]) {
                acc[title] = [];
            }
            acc[title].push(product);
            return acc;
        }, {});
    };


    const renderProducts = (data, sectionTitle) => {
        if (!data || !Object.keys(data).length) return null;

        const tabList = [];
        const tabPanels = [];

        Object.keys(data).forEach((title, index) => {
            tabList.push(<Tab key={index}>{title}</Tab>);
            const products = data[title].map((product, idx) => (
                <Product
                    key={product.id}
                    data={product}
                    onView={handleProductView}
                />
            ));
            tabPanels.push(
                <TabPanel key={index}>

                    {data[title].length > 3 ? (

                        <Slider {...sliderSettings}>
                            {products}
                        </Slider>
                    ) : (
                        <div className="row">{products}</div>
                    )}
                </TabPanel>
            );
        });

        return (
            <div className="container">
                <div className="section-title">
                    <h2>{sectionTitle}</h2>
                    <Tabs>
                        <TabList>
                            {tabList}
                        </TabList>
                        {tabPanels}
                    </Tabs>
                </div>
            </div>
        );
    };
    const renderRecentlyViewed = () => {
        if (recentlyViewed.length === 0) return null;
        const products = recentlyViewed.map((product, idx) => (
            <Product key={product.id} data={product} />
        ));

        return (
            <div className="container">
                <div className="section-title">
                    <h2>SẢN PHẨM GẦN ĐÂY ĐÃ XEM</h2>
                    <div className="row">
                        {products}
                    </div>
                </div>
            </div>
        );
    };

    const groupedProducts = groupProductsByTitle(products);
    // const groupedProductHot = groupProductsByTitle(hotProduct);
    console.log("product: "+products.length);
    return (
        <>
            {products.length >= 0 && renderProducts(groupedProducts, "THƯƠNG HIỆU ĐỒNG HỒ")}
            {/*{hotProduct.length >= 0 && renderProducts(groupedProductHot, "SẢN PHẨM MỚI RA MẮT")}*/}
            {renderRecentlyViewed()}
        </>
    );
};

export default memo(HomePage);




