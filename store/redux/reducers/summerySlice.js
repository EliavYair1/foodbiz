import { createSlice } from "@reduxjs/toolkit";

// const initialState = null;
const initialState = {
  majorCategoryHeaders: [],
  categoryNamesSubHeaders: [],
};
const summerySlice = createSlice({
  name: "summary",
  initialState,
  reducers: {
    setSummary: (state, action) => {
      return action.payload;
    },
    setMajorCategoryHeaders: (state, action) => {
      return { ...state, majorCategoryHeaders: action.payload };
    },
    setCategoryNamesSubHeaders: (state, action) => {
      return { ...state, categoryNamesSubHeaders: action.payload };
    },
  },
});

export const {
  setMajorCategoryHeaders,
  setCategoryNamesSubHeaders,
  setSummary,
} = summerySlice.actions;

export default summerySlice.reducer;
