import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts } from "./productThunk";
import {
  adminProductsFilteredOptions,
  clientProductsFilteredOptions,
} from "@/options/filter";

const getPage =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("page")
    : "";
const getName =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("name")
    : "";
const getPriceFrom =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("priceFrom")
    : "";
const getPriceTo =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("priceTo")
    : "";
const getColors =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("colors")
    : "";
const getTags =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("tags")
    : "";
const getCategories =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("categories")
    : "";
const getFilter =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("filter")
    : "";
const getSort =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("sort")
    : "";

const findFilter = adminProductsFilteredOptions.find((option) => {
  const optionValue = option.value.split(",")[1];
  return optionValue === getFilter + "";
});

const findSort = clientProductsFilteredOptions.find((option) => {
  const optionValue = option.value.split(",")[1];
  return optionValue === getSort + "";
});

interface IInitialState {
  isLoading: boolean;
  data: IProduct[];
  pagination: IPagination;
  queries: IProductQueries;
  priceMax: number;
  selectedIds: string[];
  view: "GRID" | "LIST";
}
const initialState: IInitialState = {
  isLoading: true,
  data: [],
  priceMax: 0,
  selectedIds: [],
  view: "GRID",
  pagination: {
    limit: 6,
    page: getPage ? +getPage : 1,
    totalItems: 0,
    totalPages: 0,
  },
  queries: {
    keywords: getName ? getName : "",
    priceFrom: getPriceFrom ? +getPriceFrom : 0,
    priceTo: getPriceTo ? +getPriceTo : 0,
    categorySlug: getCategories ? getCategories.split(",") : [],
    filter: {
      label: getFilter && findFilter ? findFilter.label : "",
      value: getFilter && findFilter ? findFilter?.value : "",
    },
    colors: getColors ? getColors.split(",") : [],
    tags: getTags ? getTags.split(",") : [],
    sort: {
      label: getSort && findSort ? findSort.label : "",
      value: getSort && findSort ? findSort?.value : "",
    },
  },
};

const toggleArrayItem = (array: string[] | undefined, item: string) => {
  const isExist = array?.includes(item);
  if (isExist) {
    const index = array?.indexOf(item) as number;
    array?.splice(index, 1);
  } else {
    array?.push(item);
  }
};

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    updatedCategorySlug: (state, action) => {
      const { categorySlug, slug } = action.payload;
      const categorySlugArr = state.queries.categorySlug || [];
      const indexSlug = categorySlugArr.indexOf(slug);
      const indexCategorySlug = categorySlugArr.indexOf(categorySlug);

      if (indexSlug !== -1) {
        categorySlugArr.splice(indexSlug, 1);
        if (categorySlugArr.length === 0) {
          categorySlugArr.push(categorySlug);
        }
      } else {
        if (indexCategorySlug !== -1) {
          categorySlugArr.splice(indexCategorySlug, 1);
        }
        categorySlugArr.push(slug);
      }
    },
    handleCategoriesSlug: (state, action) => {
      state.queries.categorySlug = action.payload;
    },
    handlePagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    handleQueries: (state, action) => {
      state.queries = { ...state.queries, ...action.payload };
    },
    handleCategorySlug: (state, action) => {
      toggleArrayItem(state.queries.categorySlug, action.payload);
    },
    handleColors: (state, action) => {
      toggleArrayItem(state.queries.colors, action.payload);
    },
    handleTags: (state, action) => {
      toggleArrayItem(state.queries.tags, action.payload);
    },
    resetQueries: (state) => {
      state.queries = {
        keywords: "",
        priceFrom: 0,
        priceTo: initialState.priceMax,
        categorySlug: [],
        filter: {
          label: "",
          value: "",
        },
        sort: {
          label: "",
          value: "",
        },
        colors: [],
        tags: [],
      };
    },
    saveSelectedIds: (state, action) => {
      state.selectedIds = action.payload;
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
    deletedProduct: (state, action) => {
      const products = state.data;
      const id = action.payload;
      const index = products.findIndex((product) => product._id === id);
      if (index !== -1) {
        products.splice(index, 1);
        state.selectedIds = state.selectedIds.filter((item) => item !== id);
        state.pagination.totalItems = state.pagination.totalItems - 1;
        if (products.length === 0) {
          state.pagination.page = 1;
        }
      }
    },
    changeView: (state, action) => {
      state.view = action.payload as "GRID" | "LIST";
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

export const {
  handleQueries,
  handlePagination,
  handleCategorySlug,
  updatedCategorySlug,
  selectedIdsChanged,
  seletedIdsChangedAll,
  updateFeature,
  deletedProduct,
  handleColors,
  handleTags,
  resetQueries,
  handleCategoriesSlug,
  changeView,
  saveSelectedIds,
} = productSlice.actions;

export default productSlice.reducer;
