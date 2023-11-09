import { createSlice } from "@reduxjs/toolkit";

type TotalPoints = {
  points: number;
};

const initialState: TotalPoints = {
  points: 0,
};

export const totalPointsSlice = createSlice({
  name: "totalPoints",
  initialState,
  reducers: {
    addPoints: (state, action) => {
      state.points += action.payload;
    },
    resetPoints: (state) => {
      state.points = 0;
    },
  },
});

export const { addPoints, resetPoints } = totalPointsSlice.actions;

export default totalPointsSlice.reducer;
