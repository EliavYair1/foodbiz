import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentCategories: null,
};

const currentCategoriesSlice = createSlice({
  name: "currentCategories",
  initialState,
  reducers: {
    getCurrentCategories: (state, action) => {
      state.currentCategories = action.payload;
    },
  },
});

export const { getCurrentCategories } = currentCategoriesSlice.actions;

export default currentCategoriesSlice.reducer;
