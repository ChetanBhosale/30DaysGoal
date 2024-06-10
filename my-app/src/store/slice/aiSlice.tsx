import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  goals: null,
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    goals: (state, action) => {
      state.goals = action.payload;
    },
  },
});

export const { goals } = aiSlice.actions;

export default aiSlice.reducer;
