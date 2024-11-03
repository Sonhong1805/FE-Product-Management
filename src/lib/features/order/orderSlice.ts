import { createSlice } from "@reduxjs/toolkit";
import { fetchOrders } from "./orderThunk";

interface IInitialState {
  isLoading: boolean;
  data: IOrder[];
  pagination: IPagination;
  selectedIds: string[];
  queries: IOrderQueries;
  orderInfo: IOrder;
}

const getId =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("id")
    : "";
const getPriceFrom =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("priceFrom")
    : "";
const getPriceTo =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("priceTo")
    : "";

const getOrderFilterLabel =
  typeof window !== "undefined"
    ? localStorage.getItem("orderFilterLabel") || ""
    : "";

const getOrderFilterValue =
  typeof window !== "undefined"
    ? localStorage.getItem("orderFilterValue") || ""
    : "";

const storageParamsKey = getOrderFilterValue
  ? getOrderFilterValue.split(",")[0]
  : "";

const getFilter =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get(storageParamsKey)
    : "";

const initialState: IInitialState = {
  isLoading: true,
  data: [],
  selectedIds: [],
  pagination: {
    limit: 4,
    page: 1,
    totalItems: 0,
    totalPages: 0,
  },
  queries: {
    _id: getId ? getId : "",
    priceFrom: getPriceFrom ? Number(+getPriceFrom) : 0,
    priceTo: getPriceTo ? Number(+getPriceTo) : 0,
    filter: {
      label: getFilter ? getOrderFilterLabel : "",
      value: getFilter ? getOrderFilterValue : "",
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
    saveOrderInfo: (state, action) => {
      state.orderInfo = action.payload;
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
      }
    },
    updateFeature: (state, action) => {
      const { ids, feature } = action.payload;
      const field = feature.split("-")[0];
      const value = feature.split("-")[1];

      if (field === "deleted") {
        state.data = state.data.filter((order) => !ids.includes(order._id));
      } else {
        state.data = state.data.map((order) => {
          if (ids.includes(order._id)) {
            return {
              ...order,
              [field]: field === "status" ? JSON.parse(value) : value,
            };
          } else {
            return order;
          }
        });
      }
    },
    deleteOrder: (state, action) => {
      const id = action.payload;
      const index = state.data.findIndex((order) => order._id === id);
      if (index !== -1) {
        state.data.splice(index, 1);
      }
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
      const orders = state.data;
      if (state.selectedIds.length === orders.length) {
        state.selectedIds = [];
      } else {
        state.selectedIds = orders.map((order) => order._id);
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
  handlePagination,
  handleQueries,
  updateStatus,
  updateFeature,
  deleteOrder,
  seletedIdsChangedAll,
  selectedIdsChanged,
} = orderSlice.actions;

export default orderSlice.reducer;
