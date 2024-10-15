import ProductsService from "@/services/products";
import RatingsService from "@/services/ratings";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchProductDetail = createAsyncThunk(
  "product/fetchProductDetail",
  async (slug: string): Promise<IResponse<IProduct>> => {
    const response = await ProductsService.detail(slug);
    return response;
  }
);

export const createRatings = createAsyncThunk(
  "product/createRatings",
  async ({
    pid,
    star,
    content,
  }: {
    pid: string;
    star: number;
    content: string;
  }): Promise<IResponse<IRating>> => {
    const response = await RatingsService.create({
      pid,
      star,
      content,
    });
    return response;
  }
);
