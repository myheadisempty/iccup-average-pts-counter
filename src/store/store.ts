import { configureStore } from "@reduxjs/toolkit";
import totalPointsSlice from "./slices/totalPointsSlice";

export const store = configureStore({
  reducer: {
    totalPoints: totalPointsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
