import { createSlice } from "@reduxjs/toolkit";
import { getGains, deleteGains } from "./gainsThunks";

const gainsSlice = createSlice({
  name: "gains",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteGains.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGains.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteGains.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getGains.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getGains.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getGains.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default gainsSlice.reducer;
