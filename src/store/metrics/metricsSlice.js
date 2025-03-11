import { createSlice } from "@reduxjs/toolkit";
import { getMetrics, updateMetrics } from "./metricsThunks";

const metricsSlice = createSlice({
  name: "metrics",
  initialState: {
    data: {
      pageViews: 0,
      pageVisits: 0,
      uniqueVisits: 0,
      users: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMetrics.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default metricsSlice.reducer;
