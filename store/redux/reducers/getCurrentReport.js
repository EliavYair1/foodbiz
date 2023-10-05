import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentReport: null,
};

const currentReportSlice = createSlice({
  name: "currentReport",
  initialState,
  reducers: {
    getCurrentReport: (state, action) => {
      return { ...state, currentReport: action.payload };
    },
    setCurrentReport: (state, action) => {
      return { ...state, currentReport: action.payload };
    },
  },
});

export const { getCurrentReport, setCurrentReport } =
  currentReportSlice.actions;

export default currentReportSlice.reducer;
