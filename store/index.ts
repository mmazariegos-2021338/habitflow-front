import { configureStore } from "@reduxjs/toolkit";
import habitosReducer from "./slices/habitosSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    habitos: habitosReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
