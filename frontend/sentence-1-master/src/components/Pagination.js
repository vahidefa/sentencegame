import React, { useState } from "react";
import Pagination from "react-bootstrap/pagination";
const CustomPagination = ({ totalPages, currentPage, onPageChange }) => {
  const showTotalPage = Math.ceil(totalPages / 5);
  const getPaginationItems = () => {
    const items = [];

    // Add "Previous" button
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />
    );

    // Add page numbers
    for (let i = 1; i <= showTotalPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    // Add "Next" button
    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage === showTotalPage}
        onClick={() => onPageChange(currentPage + 1)}
      />
    );

    return items;
  };
  return (
    <div className="container-fluid">
      <nav aria-label="Page navigation example">
        <ul className="pagination pagination-sm justify-content-center">
          {getPaginationItems()}
        </ul>
      </nav>
    </div>
  );
};

export default CustomPagination;
