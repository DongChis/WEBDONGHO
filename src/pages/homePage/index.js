import React, { memo, useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "./style.scss";
import "./tag.scss";
import "pages/Profile/style.scss";
import { fetchProducts, fetchNewProducts } from "../../api/loadProduct";
import {
  loadProductsSelector,
  loadNewProductsSelector,
} from "../../redux/Slice/productSlice";
import { Product } from "../../component/Product/Product";

const HomePage = () => {
  const dispatch = useDispatch();
  const products = useSelector(loadProductsSelector);
  const newProducts = useSelector(loadNewProductsSelector);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await dispatch(fetchProducts()).unwrap();
        await dispatch(fetchNewProducts()).unwrap();
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu sản phẩm:", err);
        setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
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
    setRecentlyViewed((prev) => {
      const existingProduct = prev.find((item) => item.id === product.id);
      let newViewed;
      if (existingProduct) {
        newViewed = [
          existingProduct,
          ...prev.filter((item) => item.id !== product.id),
        ];
      } else {
        newViewed = [product, ...prev];
      }
      const viewed = newViewed.slice(0, 3);
      localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
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
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          arrows: true,
        },
      },
    ],
  };

  const groupProductsByTitle = (data) => {
    if (!Array.isArray(data)) {
      return {};
    }

    return data.reduce((acc, product) => {
      if (!product || !product.title) return acc;
      const { title } = product;
      if (!acc[title]) {
        acc[title] = [];
      }
      acc[title].push(product);
      return acc;
    }, {});
  };

  const renderProducts = (data, sectionTitle) => {
    if (!data || !Object.keys(data).length) {
      return <p className="no-products">Không có sản phẩm để hiển thị.</p>;
    }

    const tabList = [];
    const tabPanels = [];

    Object.keys(data).forEach((title) => {
      tabList.push(<Tab key={title}>{title}</Tab>);
      const products = data[title].map((product, idx) => (
        <Product
          key={product.id || `${title}-${idx}`}
          data={product}
          onView={handleProductView}
        />
      ));
      tabPanels.push(
        <TabPanel key={title}>
          {data[title].length > 3 ? (
            <Slider {...sliderSettings}>{products}</Slider>
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
            <TabList>{tabList}</TabList>
            {tabPanels}
          </Tabs>
        </div>
      </div>
    );
  };

  const renderRecentlyViewed = () => {
    if (recentlyViewed.length === 0) {
      return null;
    }

    const products = recentlyViewed.map((product, idx) => (
      <Product key={product.id || `recent-${idx}`} data={product} />
    ));

    return (
      <div className="container">
        <div className="section-title">
          <h2>SẢN PHẨM GẦN ĐÂY ĐÃ XEM</h2>
          <div className="row">{products}</div>
        </div>
      </div>
    );
  };
  const renderRecentlyAdded = () => {
    if (newProducts.length === 0) {
      return null;
    }

    const products = newProducts.map((product, idx) => (
      <Product key={product.id || `new-${idx}`} data={product} />
    ));

    return (
      <div className="container">
        <div className="section-title">
          <h2>SẢN PHẨM MỚI NHẤT</h2>
          <div className="row">{products}</div>
        </div>
      </div>
    );
  };

  const productsArray = Array.isArray(products)
    ? products
    : Object.values(products);
  const groupedProducts = groupProductsByTitle(productsArray);

  return (
    <>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          {groupedProducts &&
            renderProducts(groupedProducts, "THƯƠNG HIỆU ĐỒNG HỒ")}
          {renderRecentlyAdded()}
          {renderRecentlyViewed()}
        </>
      )}
    </>
  );
};

export default memo(HomePage);
