import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getNewAccessToken } from "../auth/authThunks";

export const getPortfolio = createAsyncThunk(
  "stock/getPortfolio",
  async (_, { rejectWithValue, dispatch }) => {
    const result = await dispatch(getNewAccessToken());
    try {
      const response = await axios.get(
        "https://sidtrack-backend.onrender.com/api/stock/portfolio",
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
        err.response?.data?.message || "Fetching portfolio failed"
      );
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "stock/deleteTransaction",
  async ({ _id }, { rejectWithValue, dispatch }) => {
    const result = await dispatch(getNewAccessToken());
    try {
      const response = await axios.delete(
        `https://sidtrack-backend.onrender.com/api/stock/delete-transaction?_id=${_id}`,
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
        err.response?.data?.message || "Deleting transaction failed"
      );
    }
  }
);

export const addTransaction = createAsyncThunk(
  "stock/addTransaction",
  async (
    { stockSymbol, quantity, price, action, date },
    { dispatch, rejectWithValue }
  ) => {
    const result = await dispatch(getNewAccessToken());
    try {
      const response = await axios.post(
        `https://sidtrack-backend.onrender.com/api/stock/add-transaction`,
        { stockSymbol, quantity, price, action, date },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${result.payload.accessToken}`,
          },
          withCredentials: true,
        }
      );
      await dispatch(getPortfolio());
      return {
        message: response.data.message,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Adding transaction failed"
      );
    }
  }
);

export const getTransactions = createAsyncThunk(
  "stock/getTransactions",
  async ({ from, to }, { rejectWithValue, dispatch }) => {
    const result = await dispatch(getNewAccessToken());
    try {
      const response = await axios.get(
        `https://sidtrack-backend.onrender.com/api/stock/transactions?from=${from}&to=${to}`,
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
        err.response?.data?.message || "Fetching transactions failed"
      );
    }
  }
);
