import { createSlice } from "@reduxjs/toolkit";
import { fetchBlogs } from "./blogThunk";
import { statusOptions } from "@/options/status";
import { topicsOptions } from "@/options/topics";

const getPage =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("page")
    : "";
const getName =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("name")
    : "";
const getStatus =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("status")
    : "";

const getTopic =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("topic")
    : "";

const findStatus = statusOptions.find((option) =>
  option.value.includes(getStatus + "")
);
const findTopic = topicsOptions.find((option) =>
  option.value.includes(getTopic + "")
);

interface IInitialState {
  isLoading: boolean;
  data: IBlog[];
  pagination: IPagination;
  queries: IBlogsQueries;
  selectedIds: string[];
}
const initialState: IInitialState = {
  isLoading: true,
  data: [],
  selectedIds: [],
  pagination: {
    limit: 5,
    page: getPage ? +getPage : 1,
    totalItems: 0,
    totalPages: 0,
  },
  queries: {
    keywords: getName ? getName : "",
    topic: {
      label: getTopic && findTopic ? findTopic.label : "",
      value: getTopic && findTopic ? findTopic.value : "",
    },
    status: {
      label: getStatus && findStatus ? findStatus.label : "",
      value: getStatus && findStatus ? findStatus.value : "",
    },
  },
};

export const blogSlice = createSlice({
  name: "blogs",
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
        topic: {
          label: "",
          value: "",
        },
        status: {
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
    deletedBlog: (state, action) => {
      const blogs = state.data;
      const id = action.payload;
      const index = blogs.findIndex((blog) => blog._id === id);
      if (index !== -1) {
        blogs.splice(index, 1);
        state.selectedIds = state.selectedIds.filter((item) => item !== id);
        state.pagination.totalItems = state.pagination.totalItems - 1;
        if (blogs.length === 0) {
          state.pagination.page = 1;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBlogs.fulfilled, (state, action) => {
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
  deletedBlog,
} = blogSlice.actions;

export default blogSlice.reducer;
