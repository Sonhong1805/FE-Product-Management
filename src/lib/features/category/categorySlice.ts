import { createSlice } from "@reduxjs/toolkit";
import { fetchCategories } from "./categoryThunk";
import { nested } from "@/helpers/createNested";

interface IInitialState {
  data: ICategory[];
  parentCategories: ICategory[];
}

const initialState: IInitialState = {
  data: [],
  parentCategories: [],
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    saveParentCategories: (state, action) => {
      state.parentCategories = nested(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.data = nested(action.payload.data as ICategory[]);
    });
  },
});

export const { saveParentCategories } = categorySlice.actions;

export default categorySlice.reducer;
