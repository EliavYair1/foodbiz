import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import { getDefaultMiddleware } from "@reduxjs/toolkit";
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
