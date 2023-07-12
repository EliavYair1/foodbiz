import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentStation: null,
};

const currentStationSlice = createSlice({
  name: "currentStation",
  initialState,
  reducers: {
    getCurrentStation: (state, action) => {
      return action.payload;
    },
  },
});

export const { getCurrentStation } = currentStationSlice.actions;

export default currentStationSlice.reducer;
