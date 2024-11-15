import { createSlice } from "@reduxjs/toolkit";
import { fetchAccounts } from "./accountThunk";

const getPage =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("page")
    : "";
const getFullname =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("fullname")
    : "";
const getRole =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("role")
    : "";

interface IInitialState {
  isLoading: boolean;
  data: IUser[];
  pagination: IPagination;
  queries: IAccountsQueries;
  selectedIds: string[];
}
const initialState: IInitialState = {
  isLoading: true,
  data: [],
  selectedIds: [],
  pagination: {
    limit: 12,
    page: getPage ? +getPage : 1,
    totalItems: 0,
    totalPages: 0,
  },
  queries: {
    keywords: getFullname ? getFullname : "",
    filter: {
      label: "",
      value: "",
    },
    role: {
      label: "",
      value: "",
    },
  },
};

export const accountSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    handlePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    handleQueries: (state, action) => {
      state.queries = { ...state.queries, ...action.payload };
    },
    resetQueries: (state) => {
      state.queries = {
        keywords: "",
        filter: {
          label: "",
          value: "",
        },
        role: {
          label: "",
          value: "",
        },
      };
    },
    selectedIdsChanged: (state, action) => {
      const index = state.selectedIds.findIndex((id) => id === action.payload);
      if (index !== -1) {
        state.selectedIds.splice(index, 1);
      } else {
        state.selectedIds.push(action.payload);
      }
    },
    seletedIdsChangedAll: (state) => {
      const products = state.data;
      if (state.selectedIds.length === products.length) {
        state.selectedIds = [];
      } else {
        state.selectedIds = products.map((product) => product._id);
      }
    },
    updateFeature: (state, action) => {
      const { ids, feature } = action.payload;
      const field = feature.split("-")[0];
      const value = feature.split("-")[1];

      if (field === "deleted") {
        state.data = state.data.filter((product) => !ids.includes(product._id));
        state.pagination.totalItems = state.pagination.totalItems - ids.length;
      } else {
        state.data = state.data.map((product) => {
          if (ids.includes(product._id)) {
            return {
              ...product,
              [field]: field === "status" ? JSON.parse(value) : value,
            };
          } else {
            return product;
          }
        });
      }
    },
    deletedAccount: (state, action) => {
      const accounts = state.data;
      const id = action.payload;
      const index = accounts.findIndex((blog) => blog._id === id);
      if (index !== -1) {
        accounts.splice(index, 1);
        state.selectedIds = state.selectedIds.filter((item) => item !== id);
        state.pagination.totalItems = state.pagination.totalItems - 1;
        if (accounts.length === 0) {
          state.pagination.page = 1;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAccounts.fulfilled, (state, action) => {
      state.data = action.payload.data || state.data;
      state.pagination = action.payload.pagination || state.pagination;
    });
  },
});

export const {
  handleQueries,
  handlePagination,
  selectedIdsChanged,
  seletedIdsChangedAll,
  resetQueries,
  updateFeature,
  deletedAccount,
} = accountSlice.actions;

export default accountSlice.reducer;
