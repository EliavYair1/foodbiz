import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentClient: null,
};

const currentClientSlice = createSlice({
  name: "currentClient",
  initialState,
  reducers: {
    getCurrentClient: (state, action) => {
      state.currentClient = action.payload;
    },
  },
});

export const { getCurrentClient } = currentClientSlice.actions;

export default currentClientSlice.reducer;
