import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: null,
};

const globalCategoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setGlobalCategories: (state, action) => {
      state.categories = action.payload;
    },
  },
});

export const { setGlobalCategories } = globalCategoriesSlice.actions;

export default globalCategoriesSlice.reducer;
