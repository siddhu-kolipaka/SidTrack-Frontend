import { configureStore } from "@reduxjs/toolkit";
import scrollDirectionReducer from "./scrollDirection/scrollDirectionSlice";
import authReducer from "./auth/authSlice";
import trackerReducer from "./tracker/trackerSlice";
import stockReducer from "./stock/stockSlice";
import gainsReducer from "./gains/gainsSlice";
import wealthReducer from "./wealth/wealthSlice";
import metricsReducer from "./metrics/metricsSlice";

export const store = configureStore({
  reducer: {
    scrollDirection: scrollDirectionReducer,
    auth: authReducer,
    tracker: trackerReducer,
    stock: stockReducer,
    gains: gainsReducer,
    wealth: wealthReducer,
    metrics: metricsReducer,
  },
});
