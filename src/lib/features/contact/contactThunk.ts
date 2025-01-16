import ContactsService from "@/services/contacts";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchContacts = createAsyncThunk(
  "contact/fetchContacts",
  async (
    params: Record<string, string | number | boolean>
  ): Promise<IResponse<IContact[]>> => {
    const response = await ContactsService.index(params);
    return response;
  }
);
