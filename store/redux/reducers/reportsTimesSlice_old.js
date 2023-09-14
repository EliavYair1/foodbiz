import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import "@env";
// Define the async thunk to fetch reportsTimes from the API
export const fetchReportsTimes = createAsyncThunk(
  "reportsTimes/fetchReportTimes",
  async () => {
    const response = await axios.get(
      process.env.API_BASE_URL + "api/categories.php"
    );
    return response.data;
  }
);

const reportsTimesSlice = createSlice({
  name: "reportsTimes",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchReportsTimes.fulfilled, (state, action) => {
      return action.payload.reports_times;
    });
  },
});

export default reportsTimesSlice.reducer;
