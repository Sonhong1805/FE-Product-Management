import { createSlice } from "@reduxjs/toolkit";
import { createRatings, fetchProductDetail } from "./productDetailThunk";

interface IInitialState {
  isLoading: boolean;
  data: IProduct;
  selectedVariant: string;
}
const initialState: IInitialState = {
  isLoading: true,
  selectedVariant: "",
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
    },
    descriptions: "",
    discount: 0,
    discountedPrice: 0,
    highlights: [],
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
    clearSelectedVariant: (state) => {
      state.selectedVariant = "";
    },
    deleteRatingsItem: (state, action) => {
      const id = action.payload;
      const index = state.data.ratings.findIndex((rating) => rating._id === id);
      if (index !== -1) {
        state.data.ratings.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProductDetail.fulfilled, (state, action) => {
      state.data = action.payload.data || state.data;
    });
    builder.addCase(createRatings.fulfilled, (state, action) => {
      state.data.ratings.unshift(action.payload.data as IRating);
    });
  },
});

export const { changeVariant, clearSelectedVariant, deleteRatingsItem } =
  productDetailSlice.actions;

export default productDetailSlice.reducer;
