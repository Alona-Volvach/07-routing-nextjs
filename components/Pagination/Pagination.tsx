"use client";

import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (!totalPages || totalPages <= 1) return null;

  const safePage =
    Number.isFinite(page) && page > 0 ? Math.min(page, totalPages) : 1;

  const handlePageClick = (event: { selected: number }) => {
    const newPage = event.selected + 1;
    onPageChange(newPage);
  };

  return (
    <ReactPaginate
      breakLabel="..."
      previousLabel="←"
      nextLabel="→"
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      pageCount={totalPages}
      onPageChange={handlePageClick}
      forcePage={safePage - 1} 
      containerClassName={css.pagination}
      activeClassName={css.active}
      previousClassName={css.previous}
      nextClassName={css.next}
      disabledClassName={css.disabled}
    />
  );
}