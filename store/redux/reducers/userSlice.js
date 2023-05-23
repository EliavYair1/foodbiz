// userReducer.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {},
  reducers: {
    setUser: (state, action) => action.payload,
    getUser: (state) => state,
    clearUser: () => ({}),
  },
});

export const { setUser, clearUser, getUser } = userSlice.actions;
export default userSlice.reducer;
