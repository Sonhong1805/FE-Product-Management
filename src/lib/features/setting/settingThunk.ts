import SettingsService from "@/services/settings";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (): Promise<IResponse<ISetting>> => {
    const response = await SettingsService.index();
    return response;
  }
);

export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async ({
    id,
    data,
  }: {
    id: string;
    data: FormData;
  }): Promise<IResponse<ISetting>> => {
    const response = await SettingsService.update(id, data);
    return response;
  }
);
