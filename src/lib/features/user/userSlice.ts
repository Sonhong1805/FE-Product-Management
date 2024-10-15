import { createSlice } from "@reduxjs/toolkit";
import { createCart, updateCart } from "./userThunk";
import { setCookie } from "@/helpers/cookie";

interface IInitialState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userInfo: IUser;
  selectedIds: string[];
}

const initialState: IInitialState = {
  isAuthenticated: false,
  isLoading: true,
  selectedIds: [],
  userInfo: {
    _id: "",
    email: "",
    fullname: "",
    phone: "",
    address: "",
    avatar: "",
    gender: "",
    password: "",
    status: true,
    role: {
      _id: "",
      permissions: [],
      description: "",
      title: "",
      status: true,
    },
    cart: {
      _id: "",
      products: [],
    },
    wishlist: [],
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUserInfo: (state, action) => {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.userInfo = action.payload;
      const cart = action.payload.cart as ICart;
      state.selectedIds = cart?.products
        .filter((product) => product.selected)
        .map((product) => product._id);
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
    deleteProductInCart: (state, action) => {
      const id = action.payload;
      const productsInCart = state.userInfo.cart?.products;
      const index = productsInCart.findIndex((product) => product._id === id);
      if (index !== -1) {
        productsInCart.splice(index, 1);
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
      const productsInCart = state.userInfo.cart?.products;
      if (state.selectedIds.length === productsInCart.length) {
        state.selectedIds = [];
      } else {
        state.selectedIds = productsInCart.map((product) => product._id);
      }
    },
    selectedIdsDeleted: (state, action) => {
      const selectedIds = action.payload;
      state.selectedIds = state.selectedIds.filter(
        (id) => !selectedIds.includes(id)
      );
      state.userInfo.cart.products = state.userInfo.cart.products.filter(
        (product) => !selectedIds.includes(product._id)
      );
    },
    addToWishlist: (state, action) => {
      const newItem = action.payload;
      state.userInfo.wishlist.unshift(newItem);
    },
    deleteWishlistItem: (state, action) => {
      const id = action.payload;
      const index = state.userInfo.wishlist.findIndex(
        (product) => product._id === id
      );
      if (index !== -1) {
        state.userInfo.wishlist.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createCart.fulfilled, (state, action) => {
      state.userInfo.cart = (action.payload?.data as ICart) || {};
      const cartId = action.payload?.data?._id as string;
      setCookie("cartId", cartId);
    });
    builder.addCase(updateCart.fulfilled, (state, action) => {
      const data = action.payload.data;
      if (data) {
        const { _id, quantity } = data;
        const productsInCart = state.userInfo.cart.products;
        const currentProduct = productsInCart.find(
          (product) => product._id === _id
        );
        if (currentProduct) {
          currentProduct.quantity = quantity;
        }
      }
    });
  },
});

export const {
  saveUserInfo,
  logout,
  deleteProductInCart,
  selectedIdsChanged,
  seletedIdsChangedAll,
  selectedIdsDeleted,
  addToWishlist,
  deleteWishlistItem,
} = userSlice.actions;

export default userSlice.reducer;
