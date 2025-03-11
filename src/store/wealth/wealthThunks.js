import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getNewAccessToken } from "../auth/authThunks";

export const deleteWealth = createAsyncThunk(
  "wealth/deleteWealth",
  async ({ date }, { rejectWithValue, dispatch }) => {
    const result = await dispatch(getNewAccessToken());
    try {
      const response = await axios.delete(
        `https://sidtrack-backend.onrender.com/api/wealth/?date=${date}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${result.payload.accessToken}`,
          },
          withCredentials: true,
        }
      );
      dispatch(getWealth());
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Deleting wealth failed"
      );
    }
  }
);

export const updateWealth = createAsyncThunk(
  "wealth/updateWealth",
  async ({ date, wealth }, { rejectWithValue, dispatch }) => {
    const result = await dispatch(getNewAccessToken());
    try {
      const response = await axios.post(
        "https://sidtrack-backend.onrender.com/api/wealth",
        { date, wealth },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${result.payload.accessToken}`,
          },
          withCredentials: true,
        }
      );
      dispatch(getWealth());
      return response.data.message;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Adding wealth failed"
      );
    }
  }
);

export const getWealth = createAsyncThunk(
  "wealth/getWealth",
  async (_, { rejectWithValue, dispatch }) => {
    const result = await dispatch(getNewAccessToken());

    try {
      const response = await axios.get(
        `https://sidtrack-backend.onrender.com/api/wealth`,
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
        err.response?.data?.message || "Fetching wealth failed"
      );
    }
  }
);
