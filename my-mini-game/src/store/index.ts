import { configureStore } from "@reduxjs/toolkit";
import ballReducer from "./slices/ballSlice";

const store = configureStore({
  reducer: {
    ball: ballReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
