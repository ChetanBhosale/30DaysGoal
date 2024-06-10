import { IinitialState } from "@/@types/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IinitialState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegister: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    userLoggedIn: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    userLoggedOut: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { userRegister, userLoggedIn, userLoggedOut } = authSlice.actions;

export default authSlice.reducer;
