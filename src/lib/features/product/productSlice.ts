import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts } from "./productThunk";

interface IInitialState {
  isLoading: boolean;
  data: IProduct[];
  pagination: IPagination;
  queries: IProductQueries;
  priceMax: number;
}
const initialState: IInitialState = {
  isLoading: true,
  data: [],
  priceMax: 0,
  pagination: {
    limit: 4,
    page: 1,
    totalItems: 0,
    totalPages: 0,
  },
  queries: {
    keywords: "",
    priceFrom: 0,
    priceTo: 0,
    categorySlug: [],
    sort: {
      label: "",
      value: "",
    },
  },
};

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    handlePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    handleQueries: (state, action) => {
      state.queries = { ...state.queries, ...action.payload };
    },
    handleCategorySlug: (state, action) => {
      const isExist = state.queries.categorySlug?.includes(action.payload);
      if (isExist) {
        const index = state.queries.categorySlug?.indexOf(
          action.payload
        ) as number;
        state.queries.categorySlug?.splice(index, 1);
      } else {
        state.queries.categorySlug?.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.data = action.payload.data || state.data;
      state.pagination = action.payload.pagination || state.pagination;
      state.priceMax = action.payload.priceMax as number;
    });
  },
});

export const { handleQueries, handlePagination, handleCategorySlug } =
  productSlice.actions;

export default productSlice.reducer;
