import AccountsService from "@/services/accounts";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAccounts = createAsyncThunk(
  "account/fetchAccounts",
  async (
    params: Record<string, string | number | boolean>
  ): Promise<IResponse<IUser[]>> => {
    const response = await AccountsService.index(params);
    return response;
  }
);
