import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IintialState {
  token: string | null;
  user: string | null;
  loading: boolean;
}

const initialState: IintialState = {
  token: null,
  user: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    userLoggedIn: (
      state,
      action: PayloadAction<{ accessToken: string | null; user: string | null }>
    ) => {
      (state.token = action.payload.accessToken),
        (state.user = action.payload.user);
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    loading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { userRegistration, userLoggedIn, loading, setToken } =
  authSlice.actions;

export default authSlice.reducer;
