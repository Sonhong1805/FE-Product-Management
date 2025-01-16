import { createSlice } from "@reduxjs/toolkit";
import { fetchOrders } from "./orderThunk";
import { adminOrdersFilteredOptions } from "@/options/filter";

const getPage =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("page")
    : "";
const getId =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("orderId")
    : "";
const getPriceFrom =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("priceFrom")
    : "";
const getPriceTo =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("priceTo")
    : "";

const getFilter =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("filter")
    : "";

const findFilter = adminOrdersFilteredOptions.find((option) => {
  return option.value.includes(getFilter + "");
});

interface IInitialState {
  isLoading: boolean;
  data: IOrder[];
  pagination: IPagination;
  selectedIds: string[];
  queries: IOrderQueries;
  orderInfo: IOrder;
  ordersByUser: IOrder[];
}

const initialState: IInitialState = {
  isLoading: true,
  data: [],
  ordersByUser: [],
  selectedIds: [],
  pagination: {
    limit: 4,
    page: getPage ? +getPage : 1,
    totalItems: 0,
    totalPages: 0,
  },
  queries: {
    _id: getId ? getId : "",
    priceFrom: getPriceFrom ? Number(+getPriceFrom) : 0,
    priceTo: getPriceTo ? Number(+getPriceTo) : 0,
    filter: {
      label: getFilter && findFilter ? findFilter.label : "",
      value: getFilter && findFilter ? findFilter?.value : "",
    },
  },
  orderInfo: {
    _id: "",
    status: "PENDING",
    fullname: "",
    email: "",
    phone: "",
    address: "",
    method: "CASH",
    products: [],
    totalPrice: 0,
  },
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    saveOrdersByUser: (state, action) => {
      state.ordersByUser = action.payload;
    },
    saveOrderInfo: (state, action) => {
      state.orderInfo = action.payload;
    },
    resetOrderInfo: (state) => {
      state.orderInfo = {
        _id: "",
        status: "PENDING",
        fullname: "",
        email: "",
        phone: "",
        address: "",
        method: "CASH",
        products: [],
        totalPrice: 0,
      };
      state.selectedIds = [];
    },
    handlePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    handleQueries: (state, action) => {
      state.queries = { ...state.queries, ...action.payload };
    },
    updateStatus: (state, action) => {
      const { id, status } = action.payload;
      const findOrder = state.data.find((order) => order._id === id);
      if (findOrder) {
        findOrder.status = status;
        state.data = state.data.filter((order) => order._id !== id);
        state.data.unshift(findOrder);
      }
    },
    updateStatusOrdersByUser: (state, action) => {
      const { id, status } = action.payload;
      const currentOrder = state.ordersByUser.find((order) => order._id === id);
      if (currentOrder) {
        currentOrder.status = status;
      }
    },
    deleteOrder: (state, action) => {
      const id = action.payload;
      const index = state.data.findIndex((order) => order._id === id);
      if (index !== -1) {
        state.data.splice(index, 1);
        state.selectedIds = state.selectedIds.filter((item) => item !== id);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.data = action.payload.data || state.data;
      state.pagination = action.payload.pagination || state.pagination;
    });
  },
});

export const {
  saveOrderInfo,
  resetOrderInfo,
  handlePagination,
  handleQueries,
  updateStatus,
  deleteOrder,
  saveOrdersByUser,
  updateStatusOrdersByUser,
} = orderSlice.actions;

export default orderSlice.reducer;
