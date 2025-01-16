interface IPagination {
  limit: number;
  page: number;
  totalPages: number;
  totalItems: number;
}

interface ICustomPagination {
  totalCount: number;
  pageSize: number;
  siblingCount: number;
  currentPage: number;
}
