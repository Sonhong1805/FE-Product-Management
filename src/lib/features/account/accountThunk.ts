import AccountsService from "@/services/accounts";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAccounts = createAsyncThunk(
  "account/fetchAccounts",
  async (params: Record<string, any>): Promise<IResponse<IUser[]>> => {
    const response = await AccountsService.index(params);
    return response;
  }
);
