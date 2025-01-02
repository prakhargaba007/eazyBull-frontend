import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import tradeReducer from "./slices/tradeSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    trade: tradeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["trade/placeTrade/fulfilled"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["meta.arg"],
        // Ignore these paths in the state
        ignoredPaths: ["trade.trades"],
      },
    }),
});

export default store;
