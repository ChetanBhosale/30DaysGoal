import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./storage/authSlice";
import { authApi } from "./query/authApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});
