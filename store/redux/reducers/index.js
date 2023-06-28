import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import ClientSlice from "./clientSlice";
import currentClientSlice from "./currentClientSlice";
import categoriesSlice from "./categoriesSlice";
import reportsTimesSlice from "./reportsTimesSlice";
const rootReducer = combineReducers({
  user: userReducer,
  clients: ClientSlice,
  currentClient: currentClientSlice,
  categories: categoriesSlice,
  reportsTimes: reportsTimesSlice,
});

export default rootReducer;
