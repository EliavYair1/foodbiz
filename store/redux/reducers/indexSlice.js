// indexSlice.js
import { createSlice } from "@reduxjs/toolkit";

const indexSlice = createSlice({
  name: "categoryIndex",
  initialState: 0,
  reducers: {
    setIndex: (state, action) => {
      return action.payload;
    },
  },
});

export const { setIndex } = indexSlice.actions;
export default indexSlice.reducer;
