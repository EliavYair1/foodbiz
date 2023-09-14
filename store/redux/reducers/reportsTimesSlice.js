import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reportsTimes: null,
};

const currentReportTimesSlice = createSlice({
  name: "reportsTimes",
  initialState,
  reducers: {
    setReportsTimes: (state, action) => {
      state.reportsTimes = action.payload;
    },
  },
});

export const { setReportsTimes } = currentReportTimesSlice.actions;

export default currentReportTimesSlice.reducer;
