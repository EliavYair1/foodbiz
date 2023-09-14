import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import ClientSlice from "./clientSlice";
import currentClientSlice from "./currentClientSlice";
import categoriesSlice from "./categoriesSlice";
import getCurrentStation from "./getCurrentStation";
import currentReportSlice from "./getCurrentReport";
import currentCategorySlice from "./getCurrentCategory";
import currentCategoriesSlice from "./getCurrentCategories";
import summerySlice from "./summerySlice";
// import reportsTimesSlice from "./reportsTimesSlice";
import reportsTimesSlice from "./reportsTimesSlice";
const rootReducer = combineReducers({
  user: userReducer,
  clients: ClientSlice,
  currentClient: currentClientSlice,
  currentReport: currentReportSlice,
  categories: categoriesSlice,
  currentStation: getCurrentStation,
  currentCategory: currentCategorySlice,
  currentCategories: currentCategoriesSlice,
  summary: summerySlice,
  reportsTimes: reportsTimesSlice,
  // reportsTimes: reportsTimesSlice,
});

export default rootReducer;
