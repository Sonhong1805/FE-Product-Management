import withBase from "@/hocs/withBase";
import { usePagination } from "@/hooks/usePagination";
import { useAppDispatch } from "@/lib/hooks";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { Pagination as PaginationBootstrap } from "react-bootstrap";

interface IProps extends IWithBaseProps {
  pagination: IPagination;
  siblingCount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onHandlePagination: ActionCreatorWithPayload<any, string>;
}

const Pagination = (props: IProps) => {
  const { pagination, siblingCount = 1, onHandlePagination } = props;

  const dispatch = useAppDispatch();
  const paginationRange: (number | string)[] | undefined = usePagination({
    siblingCount,
    currentPage: pagination.page,
    totalCount: pagination.totalItems,
    pageSize: pagination.limit,
  });

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
      {paginationRange?.map((pageNumber: number | string, index: number) => {
        if (pageNumber === "...") {
          return <PaginationBootstrap.Ellipsis key={index} />;
        }
        return (
          <PaginationBootstrap.Item
            active={pageNumber === pagination.page}
            onClick={() =>
              dispatch(onHandlePagination({ ...pagination, page: pageNumber }))
            }
            key={index}>
            {pageNumber}
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
              page: pagination.totalPages,
            })
          )
        }
      />
    </PaginationBootstrap>
  );
};

export default withBase(Pagination);
