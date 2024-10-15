import { handlePagination } from "@/lib/features/product/productSlice";
import React from "react";
import { Pagination as PaginationBootstrap } from "react-bootstrap";
const PaginationClient = (props: any) => {
  const { pagination, dispatch } = props;
  return (
    <PaginationBootstrap>
      <PaginationBootstrap.First
        disabled={pagination.page === 1}
        onClick={() => dispatch(handlePagination({ ...pagination, page: 1 }))}
      />
      <PaginationBootstrap.Prev
        disabled={pagination.page === 1}
        onClick={() =>
          dispatch(
            handlePagination({ ...pagination, page: pagination.page - 1 })
          )
        }
      />
      {Array.from({ length: pagination.totalPages as number }, (_, index) => {
        return (
          <PaginationBootstrap.Item
            key={index}
            active={index + 1 === pagination.page}
            onClick={() =>
              dispatch(handlePagination({ ...pagination, page: index + 1 }))
            }>
            {index + 1}
          </PaginationBootstrap.Item>
        );
      })}
      <PaginationBootstrap.Next
        disabled={pagination.page === pagination.totalPages}
        onClick={() =>
          dispatch(
            handlePagination({ ...pagination, page: pagination.page + 1 })
          )
        }
      />
      <PaginationBootstrap.Last
        disabled={pagination.page === pagination.totalPages}
        onClick={() =>
          dispatch(
            handlePagination({
              ...pagination,
              page: pagination.totalPages as number,
            })
          )
        }
      />
    </PaginationBootstrap>
  );
};

export default PaginationClient;
