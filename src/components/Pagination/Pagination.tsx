import React from "react";
import { Pagination as PaginationBootstrap } from "react-bootstrap";

interface IProps {
  pagination: IPagination;
  setPagination: React.Dispatch<React.SetStateAction<IPagination>>;
}
const Pagination = (props: IProps) => {
  const { pagination, setPagination } = props;
  return (
    <PaginationBootstrap>
      <PaginationBootstrap.First
        disabled={pagination.page === 1}
        onClick={() => setPagination({ ...pagination, page: 1 })}
      />
      <PaginationBootstrap.Prev
        disabled={pagination.page === 1}
        onClick={() =>
          setPagination({ ...pagination, page: pagination.page - 1 })
        }
      />
      {Array.from({ length: pagination.totalPages as number }, (_, index) => {
        return (
          <PaginationBootstrap.Item
            key={index}
            active={index + 1 === pagination.page}
            onClick={() => setPagination({ ...pagination, page: index + 1 })}>
            {index + 1}
          </PaginationBootstrap.Item>
        );
      })}
      <PaginationBootstrap.Next
        disabled={pagination.page === pagination.totalPages}
        onClick={() =>
          setPagination({ ...pagination, page: pagination.page + 1 })
        }
      />
      <PaginationBootstrap.Last
        disabled={pagination.page === pagination.totalPages}
        onClick={() =>
          setPagination({
            ...pagination,
            page: pagination.totalPages as number,
          })
        }
      />
    </PaginationBootstrap>
  );
};

export default Pagination;
