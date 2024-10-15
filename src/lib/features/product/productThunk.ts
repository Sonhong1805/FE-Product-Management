import ProductsService from "@/services/products";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (params: Record<string, any>): Promise<IResponse<IProduct[]>> => {
    const response = await ProductsService.index(params);
    return response;
  }
);
