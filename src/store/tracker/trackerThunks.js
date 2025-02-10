import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getNewAccessToken } from "../auth/authThunks";

export const deleteTransaction = createAsyncThunk(
  "tracker/deleteTransaction",
  async ({ _id, from, to }, { rejectWithValue, dispatch }) => {
    const result = await dispatch(getNewAccessToken());
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/tracker/delete-transaction?_id=${_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${result.payload.accessToken}`,
          },
          withCredentials: true,
        }
      );
      dispatch(getTransactions({ from, to }));
      return { message: response.data.message };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Deleting transaction failed"
      );
    }
  }
);

export const addTransaction = createAsyncThunk(
  "tracker/addTransaction",
  async ({ formData, date }, { rejectWithValue, dispatch }) => {
    const result = await dispatch(getNewAccessToken());
    try {
      const response = await axios.post(
        "http://localhost:3000/api/tracker/add-transaction",
        { ...formData, date },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${result.payload.accessToken}`,
          },
          withCredentials: true,
        }
      );
      return { message: response.data.message };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Adding transaction failed"
      );
    }
  }
);

export const getTransactions = createAsyncThunk(
  "tracker/getTransactions",
  async ({ from, to }, { rejectWithValue, dispatch }) => {
    const result = await dispatch(getNewAccessToken());

    try {
      const response = await axios.get(
        `http://localhost:3000/api/tracker/get-transactions?from=${from}&to=${to}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${result.payload.accessToken}`,
          },
          withCredentials: true,
        }
      );
      return response.data.transactions;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Fetching transactions failed"
      );
    }
  }
);
