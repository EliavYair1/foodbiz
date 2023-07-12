import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentReport: null,
};

const currentReportSlice = createSlice({
  name: "currentReport",
  initialState,
  reducers: {
    getCurrentReport: (state, action) => {
      state.currentReport = action.payload;
    },
  },
});

export const { getCurrentReport } = currentReportSlice.actions;

export default currentReportSlice.reducer;
