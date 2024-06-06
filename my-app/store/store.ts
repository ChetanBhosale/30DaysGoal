import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./storage/authSlice";
import { authApi } from "./query/authApi";
import { aiApi } from "./query/aiApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [aiApi.reducerPath]: aiApi.reducer,
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware).concat(aiApi.middleware),
});
