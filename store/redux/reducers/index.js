import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import ClientSlice from "./clientSlice";

const rootReducer = combineReducers({
  user: userReducer,
  clients: ClientSlice,
});

export default rootReducer;
