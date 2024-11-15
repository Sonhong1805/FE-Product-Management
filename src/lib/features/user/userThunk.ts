import AuthService from "@/services/auth";
import CartsService from "@/services/carts";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async ({ email, password }: ILogin) => {
    const response = await AuthService.login({ email, password });
    return response;
  }
);

export const createCart = createAsyncThunk(
  "user/createCart",
  async (data: TProductInCart): Promise<IResponse<ICart>> => {
    const response = await CartsService.create(data);
    return response;
  }
);

export const updateCart = createAsyncThunk(
  "cart/updateCart",
  async ({
    cartId,
    _id,
    type,
    quantity,
  }: {
    cartId: string;
    _id: string;
    type: "plus" | "minus" | "input";
    quantity: number;
  }) => {
    const response = await CartsService.update({ cartId, _id, type, quantity });
    return response;
  }
);
