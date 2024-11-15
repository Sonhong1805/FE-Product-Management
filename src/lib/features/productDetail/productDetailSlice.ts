import { createSlice } from "@reduxjs/toolkit";
import { createRatings, fetchProductDetail } from "./productDetailThunk";

interface IInitialState {
  isLoading: boolean;
  data: IProduct;
  selectedVariant: string;
  previewVariant: {
    index: number;
    thumbnail: string;
    price: number;
    discount: number;
    discountedPrice: number;
  };
}
const initialState: IInitialState = {
  isLoading: true,
  selectedVariant: "",
  previewVariant: {
    index: 0,
    thumbnail: "",
    price: 0,
    discount: 0,
    discountedPrice: 0,
  },
  data: {
    _id: "",
    category: {
      _id: "",
      createdAt: "",
      deleted: false,
      parent_slug: "",
      slug: "",
      status: false,
      title: "",
      children: [],
      updatedAt: "",
      productIds: [],
    },
    descriptions: "",
    discount: 0,
    discountedPrice: 0,
    tags: [],
    colors: [],
    description: "",
    label: { label: "", value: "" },
    images: [],
    price: 0,
    quantity: 0,
    slug: "",
    sold: 0,
    status: false,
    thumbnail: "",
    title: "",
    variants: [],
    ratings: [],
  },
};

export const productDetailSlice = createSlice({
  name: "productDetail",
  initialState,
  reducers: {
    changeVariant: (state, action) => {
      const { name, thumbnail, price, discount, discountedPrice } =
        action.payload;
      state.selectedVariant = name;
      state.data.thumbnail = thumbnail;
      state.data.price = price;
      state.data.discount = discount;
      state.data.discountedPrice = discountedPrice;
    },
    previewVariants: (state, action) => {
      const { index, name, thumbnail, price, discount, discountedPrice } =
        action.payload;
      state.previewVariant.index = index;
      state.selectedVariant = name;
      state.previewVariant.thumbnail = thumbnail;
      state.previewVariant.price = price;
      state.previewVariant.discount = discount;
      state.previewVariant.discountedPrice = discountedPrice;
    },
    clearSelectedVariant: (state) => {
      state.previewVariant.index = 0;
      state.selectedVariant = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProductDetail.fulfilled, (state, action) => {
      state.data = action.payload.data || state.data;
      const { thumbnail, price, discount, discountedPrice } =
        action.payload.data || state.data;
      state.previewVariant.thumbnail = thumbnail + "";
      state.previewVariant.price = price;
      state.previewVariant.discount = discount;
      state.previewVariant.discountedPrice = discountedPrice;
    });
    builder.addCase(createRatings.fulfilled, (state, action) => {
      state.data.ratings.unshift(action.payload.data as IRating);
    });
  },
});

export const { changeVariant, clearSelectedVariant, previewVariants } =
  productDetailSlice.actions;

export default productDetailSlice.reducer;
