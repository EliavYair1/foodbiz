import { createSlice } from "@reduxjs/toolkit";

const clientSlice = createSlice({
  name: "clients",
  initialState: {
    clients: [],
  },
  reducers: {
    setClients: (state, action) => {
      state.clients = action.payload;
      return state;
    },
    getClients: (state) => state,
  },
});

export const { setClients, getClients } = clientSlice.actions;

export default clientSlice.reducer;
