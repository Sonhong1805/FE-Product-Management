import { createSlice } from "@reduxjs/toolkit";
import { fetchSettings, updateSettings } from "./settingThunk";

interface IInitialState {
  isLoading: boolean;
  data: ISetting;
}
const initialState: IInitialState = {
  isLoading: true,
  data: {
    _id: "",
    logo: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    copyright: "",
  },
};

export const settingSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSettings.fulfilled, (state, action) => {
      state.data = action.payload.data || state.data;
    });
    builder.addCase(updateSettings.fulfilled, (state, action) => {
      state.data = action.payload.data || state.data;
    });
  },
});

export const {} = settingSlice.actions;

export default settingSlice.reducer;
