import { createSlice } from "@reduxjs/toolkit";
import { fetchContacts } from "./contactThunk";

interface IInitialState {
  isLoading: boolean;
  data: IContact[];
  selectedIds: string[];
}
const initialState: IInitialState = {
  isLoading: true,
  data: [],
  selectedIds: [],
};

export const contactSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    saveSelectedIds: (state, action) => {
      state.selectedIds = action.payload;
    },
    selectedIdsChanged: (state, action) => {
      const index = state.selectedIds.findIndex((id) => id === action.payload);
      if (index !== -1) {
        state.selectedIds.splice(index, 1);
      } else {
        state.selectedIds.push(action.payload);
      }
    },
    seletedIdsChangedAll: (state) => {
      const contacts = state.data;
      if (state.selectedIds.length === contacts.length) {
        state.selectedIds = [];
      } else {
        state.selectedIds = contacts.map((contact) => contact._id);
      }
    },
    updateFeature: (state, action) => {
      const { ids, feature } = action.payload;
      const field = feature.split("-")[0];
      const value = feature.split("-")[1];

      if (field === "deleted") {
        state.data = state.data.filter((contact) => !ids.includes(contact._id));
      } else {
        state.data = state.data.map((contact) => {
          if (ids.includes(contact._id)) {
            return {
              ...contact,
              [field]: field === "status" ? JSON.parse(value) : value,
            };
          } else {
            return contact;
          }
        });
      }
    },
    deletedContact: (state, action) => {
      const contacts = state.data;
      const id = action.payload;
      const index = contacts.findIndex((contact) => contact._id === id);
      if (index !== -1) {
        contacts.splice(index, 1);
        state.selectedIds = state.selectedIds.filter((item) => item !== id);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchContacts.fulfilled, (state, action) => {
      state.data = action.payload.data || state.data;
    });
  },
});

export const {
  selectedIdsChanged,
  seletedIdsChangedAll,
  updateFeature,
  deletedContact,
  saveSelectedIds,
} = contactSlice.actions;

export default contactSlice.reducer;
