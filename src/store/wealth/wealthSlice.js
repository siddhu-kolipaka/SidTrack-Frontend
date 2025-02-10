import { createSlice } from "@reduxjs/toolkit";
import { deleteWealth, updateWealth, getWealth } from "./wealthThunks";

const wealthSlice = createSlice({
  name: "wealth",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(deleteWealth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWealth.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteWealth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateWealth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWealth.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateWealth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getWealth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWealth.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.wealth;
      })
      .addCase(getWealth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default wealthSlice.reducer;
