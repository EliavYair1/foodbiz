import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: null,
};

const currentCategoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    getCurrentCategories: (state, action) => {
      state.categories = action.payload;
    },
    setCurrentCategories: (state, action) => {
      state.categories = action.payload;
    },
  },
});

export const { getCurrentCategories, setCurrentCategories } =
  currentCategoriesSlice.actions;

export default currentCategoriesSlice.reducer;
