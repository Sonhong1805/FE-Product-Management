import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../lib/features/user/userSlice";
import settingReducer from "../lib/features/setting/settingSlice";
import categoryReducer from "../lib/features/category/categorySlice";
import productReducer from "../lib/features/product/productSlice";
import productDetailReducer from "../lib/features/productDetail/productDetailSlice";
import orderReducer from "../lib/features/order/orderSlice";
import blogReducer from "../lib/features/blog/blogSlice";
import accountReducer from "../lib/features/account/accountSlice";
import contactReducer from "../lib/features/contact/contactSlice";

const rootReducer = combineReducers({
  user: userReducer,
  setting: settingReducer,
  categories: categoryReducer,
  products: productReducer,
  productDetail: productDetailReducer,
  orders: orderReducer,
  blogs: blogReducer,
  accounts: accountReducer,
  contacts: contactReducer,
});

export const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production",
  });
  return store;
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
