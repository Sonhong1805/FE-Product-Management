import CategoriesService from "@/services/categories";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (): Promise<IResponse<ICategory[]>> => {
    const response = await CategoriesService.index();
    return response;
  }
);
