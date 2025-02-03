import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import tradeReducer from "./slices/tradeSlice";
import instrumentsReducer from "./slices/instrumentsSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    trade: tradeReducer,
    instruments: instrumentsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["trade/placeTrade/fulfilled"],
        ignoredActionPaths: ["meta.arg"],
        ignoredPaths: ["trade.trades"],
      },
    }),
});

export default store;
