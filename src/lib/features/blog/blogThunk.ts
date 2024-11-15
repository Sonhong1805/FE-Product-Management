import BlogsService from "@/services/blogs";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchBlogs = createAsyncThunk(
  "blog/fetchProducts",
  async (params: Record<string, any>): Promise<IResponse<IBlog[]>> => {
    const response = await BlogsService.index(params);
    return response;
  }
);
