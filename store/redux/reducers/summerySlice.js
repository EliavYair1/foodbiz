import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const summerySlice = createSlice({
  name: "summary",
  initialState,
  reducers: {
    setSummary: (state, action) => {
      return action.payload;
    },
  },
});

export const { setSummary } = summerySlice.actions;

export default summerySlice.reducer;
