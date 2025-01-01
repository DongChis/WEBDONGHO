import React from 'react';
import './style.scss';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <ul className="pagination">
            <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                <button className="page-link" onClick={() => onPageChange(1)}>
                    &laquo;
                </button>
            </li>
            <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
                    &lsaquo;
                </button>
            </li>
            {pageNumbers.map(number => (
                <li key={number} className={`page-item ${number === currentPage && 'active'}`}>
                    <button className="page-link" onClick={() => onPageChange(number)}>
                        {number}
                    </button>
                </li>
            ))}
            <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
                    &rsaquo;
                </button>
            </li>
            <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                <button className="page-link" onClick={() => onPageChange(totalPages)}>
                    &raquo;
                </button>
            </li>
        </ul>
    );
};

export default Pagination;
