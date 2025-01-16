import React, { useState } from "react";
import RatingItems from "./RatingItems";
import ReactPaginate from "react-paginate";
import { Pagination } from "react-bootstrap";

interface IProps {
  itemsPerPage: number;
  items: IRating[];
}
const RatingPagination = ({ itemsPerPage, items }: IProps) => {
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };
  return (
    <>
      <RatingItems currentItems={currentItems} />
      <ReactPaginate
        breakLabel={<Pagination.Ellipsis />}
        nextLabel={">"}
        onPageChange={handlePageClick}
        pageClassName="page-item"
        className="pagination justify-content-end"
        pageLinkClassName="page-link"
        activeClassName="active"
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel={"<"}
        renderOnZeroPageCount={null}
        previousLinkClassName={"page-link rounded-start"}
        nextLinkClassName={"page-link rounded-end"}
      />
    </>
  );
};

export default RatingPagination;
