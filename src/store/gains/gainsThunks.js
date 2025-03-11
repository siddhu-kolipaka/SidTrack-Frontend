import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getNewAccessToken } from "../auth/authThunks";

export const deleteGains = createAsyncThunk(
  "gains/deleteGains",
  async ({ _id }, { rejectWithValue, dispatch }) => {
    const result = await dispatch(getNewAccessToken());
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/gains/?_id=${_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${result.payload.accessToken}`,
          },
          withCredentials: true,
        }
      );
      dispatch(getGains());
      return { message: response.data.message };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Deleting gain failed"
      );
    }
  }
);

export const getGains = createAsyncThunk(
  "gains/getGains",
  async ({ from, to }, { rejectWithValue, dispatch }) => {
    const result = await dispatch(getNewAccessToken());

    try {
      const response = await axios.get(
        `http://localhost:3000/api/gains?from=${from}&to=${to}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${result.payload.accessToken}`,
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Fetching gains failed"
      );
    }
  }
);
