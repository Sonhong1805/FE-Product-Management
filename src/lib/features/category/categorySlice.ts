import { createSlice } from "@reduxjs/toolkit";
import { fetchCategories } from "./categoryThunk";
import { nested } from "@/helpers/createNested";

interface IInitialState {
  data: ICategory[];
}

const initialState: IInitialState = {
  data: [],
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.data = nested(action.payload.data as ICategory[]);
    });
  },
});

export const {} = categorySlice.actions;

export default categorySlice.reducer;
