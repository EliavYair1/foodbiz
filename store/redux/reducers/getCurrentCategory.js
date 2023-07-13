import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentCategory: null,
};

const currentCategorySlice = createSlice({
  name: "currentCategory",
  initialState,
  reducers: {
    getCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
  },
});

export const { getCurrentCategory } = currentCategorySlice.actions;

export default currentCategorySlice.reducer;
