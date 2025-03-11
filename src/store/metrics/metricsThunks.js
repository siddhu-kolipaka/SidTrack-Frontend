import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const updateMetrics = createAsyncThunk(
  "metrics/updateMetrics",
  async ({ type }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/metrics`,
        { type },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return { message: response.data.message };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Updating metrics failed"
      );
    }
  }
);

export const getMetrics = createAsyncThunk(
  "metrics/getMetrics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/metrics`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Fetching metrics failed"
      );
    }
  }
);
