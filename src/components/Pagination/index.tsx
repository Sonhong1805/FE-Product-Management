import withBase from "@/hocs/withBase";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import React from "react";
import { Pagination as PaginationBootstrap } from "react-bootstrap";

interface IProps extends IWithBaseProps {
  pagination: IPagination;
  onHandlePagination: ActionCreatorWithPayload<any, any>;
}

const Pagination = (props: IProps) => {
  const { pagination, dispatch, onHandlePagination } = props;
  return (
    <PaginationBootstrap>
      <PaginationBootstrap.First
        disabled={pagination.page === 1}
        onClick={() => dispatch(onHandlePagination({ ...pagination, page: 1 }))}
      />
      <PaginationBootstrap.Prev
        disabled={pagination.page === 1}
        onClick={() =>
          dispatch(
            onHandlePagination({ ...pagination, page: pagination.page - 1 })
          )
        }
      />
      {Array.from({ length: pagination.totalPages as number }, (_, index) => {
        return (
          <PaginationBootstrap.Item
            key={index}
            active={index + 1 === pagination.page}
            onClick={() =>
              dispatch(onHandlePagination({ ...pagination, page: index + 1 }))
            }>
            {index + 1}
          </PaginationBootstrap.Item>
        );
      })}
      <PaginationBootstrap.Next
        disabled={pagination.page === pagination.totalPages}
        onClick={() =>
          dispatch(
            onHandlePagination({ ...pagination, page: pagination.page + 1 })
          )
        }
      />
      <PaginationBootstrap.Last
        disabled={pagination.page === pagination.totalPages}
        onClick={() =>
          dispatch(
            onHandlePagination({
              ...pagination,
              page: pagination.totalPages as number,
            })
          )
        }
      />
    </PaginationBootstrap>
  );
};

export default withBase(Pagination);
