import OrdersService from "@/services/orders";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (
    params: Record<string, string | number | boolean>
  ): Promise<IResponse<IOrder[]>> => {
    const response = await OrdersService.index(params);
    return response;
  }
);
