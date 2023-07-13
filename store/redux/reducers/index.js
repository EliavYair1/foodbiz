import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import ClientSlice from "./clientSlice";
import currentClientSlice from "./currentClientSlice";
import categoriesSlice from "./categoriesSlice";
import reportsTimesSlice from "./reportsTimesSlice";
import getCurrentStation from "./getCurrentStation";
import currentReportSlice from "./getCurrentReport";
import currentCategorySlice from "./getCurrentCategory";

const rootReducer = combineReducers({
  user: userReducer,
  clients: ClientSlice,
  currentClient: currentClientSlice,
  currentReport: currentReportSlice,
  categories: categoriesSlice,
  reportsTimes: reportsTimesSlice,
  currentStation: getCurrentStation,
  currentCategory: currentCategorySlice,
});

export default rootReducer;
