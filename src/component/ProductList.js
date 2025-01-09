import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Product } from "./Product/Product";
import Pagination from './pagination/pagination';
import './Product/style.scss';
import { searchProducts } from '../redux/Slice/productSlice';

const ProductList = () => {
    const dispatch = useDispatch();
    const products = useSelector(state => state.products.products || []);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 9;
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('asc');
    const [priceRange, setPriceRange] = useState([0, Infinity]);
    const [brand, setBrand] = useState('all');
    const [searchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {

        if (!Array.isArray(products)) return;
        let filtered = products;

        // Lọc sản phẩm theo giới tính
        if (filter !== 'all') {
            filtered = products.filter(product => product.gender === filter);
        }
        if (filter === 'male') {
            filtered = products.filter(product => product.gender === "Nam");
        }
        if (filter === 'female') {
            filtered = products.filter(product => product.gender === "Nữ");
        }

        // Lọc theo khoang giá
        filtered = filtered.filter(product => {
            const price =product.price;
            return price >= priceRange[0] && price <= priceRange[1];
        });

        // lọc theo thương hiệu
        if (brand !== 'all') {
            filtered = filtered.filter(product => product.title === brand);
        }
        if (brand === 'Seiko') {
            filtered = filtered.filter(product => product.title === 'Seiko');
        }
        if (brand === 'KOI') {
            filtered = filtered.filter(product => product.title === 'KOI');
        }
        if (brand === 'Candino') {
            filtered = filtered.filter(product => product.title === 'Candino');
        }
        if (brand === 'Orient') {
            filtered = filtered.filter(product => product.title === 'Orient');
        }
        if (brand === 'Tissot') {
            filtered = filtered.filter(product => product.title === 'Tissot');
        }
        if (brand === 'Citizen') {
            filtered = filtered.filter(product => product.title === 'Citizen');
        }
        if (brand === 'Saga') {
            filtered = filtered.filter(product => product.title === 'Saga');
        }
        if (brand === 'Fossil') {
            filtered = filtered.filter(product => product.title === 'Fossil');
        }
        if (brand === 'Rado') {
            filtered = filtered.filter(product => product.title === 'Rado');
        }
        if (brand === 'Baby-G') {
            filtered = filtered.filter(product => product.title === 'Baby-G');
        }
        if (brand === 'SRWatch') {
            filtered = filtered.filter(product => product.title === 'SRWatch');
        }

        // Tạo bản sao của mảng đã lọc trước khi sắp xếp
        filtered = [...filtered].sort((a, b) => {
            const priceA =a.price;
            const priceB = b.price;
            return sort === 'asc' ? priceA - priceB : priceB - priceA;
        });

        setFilteredProducts(filtered);
        setCurrentPage(1);

    }, [filter, sort, priceRange, brand, products]);

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(searchProducts(searchTerm));
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className="container">
            <div className="filter">
                
                <select value={filter} onChange={e => setFilter(e.target.value)}>
                    <option value="all">Tất cả</option>
                    <option value="male">Đồng hồ nam</option>
                    <option value="female">Đồng hồ nữ</option>
                </select>
                <select value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="asc">Giá: Thấp đến cao</option>
                    <option value="desc">Giá: Cao đến thấp</option>
                </select>
                <select value={brand} onChange={e => setBrand(e.target.value)}>
                    <option value="all">Thương hiệu</option>
                    <option value="Seiko">Seiko</option>
                    <option value="KOI">KOI</option>
                    <option value="Candino">Candino</option>
                    <option value="Orient">Orient</option>
                    <option value="Tissot">Tissot</option>
                    <option value="Citizen">Citizen</option>
                    <option value="Saga">Saga</option>
                    <option value="Fossil">Fossil</option>
                    <option value="Rado">Rado</option>
                    <option value="Baby-G">Baby-G</option>
                    <option value="SRWatch">SRWatch</option>
                </select>
                <select value={priceRange.join('-')} onChange={e => {
                    const [min, max] = e.target.value.split('-').map(Number);
                    setPriceRange([min, max]);
                }}>
                    <option value="0-Infinity">Khoảng giá</option>
                    <option value="1000000-3000000">1,000,000 - 3,000,000</option>
                    <option value="3000000-5000000">3,000,000 - 5,000,000</option>
                    <option value="5000000-10000000">5,000,000 - 10,000,000</option>
                    <option value="10000000-Infinity">Trên 10,000,000</option>
                </select>
            </div>
            <div className="product-list">
                {currentProducts.map(product => (
                    <Product key={product.id} data={product} className="product"/>
                ))}
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredProducts.length / productsPerPage)}
                onPageChange={paginate}
                className="pagination"
            />
        </div>
    );
};

export default ProductList;