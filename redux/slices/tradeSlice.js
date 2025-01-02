import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Thunk to fetch trade history
export const fetchTradeHistory = createAsyncThunk(
  "trade/fetchHistory",
  async (tradeId, thunkAPI) => {
    console.log("tradeIdD", tradeId);

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER}/trades/history/${tradeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch trade history");
      }

      const tradeData = await response.json();
      console.log("tradeDataaa", tradeData);

      return tradeData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk to place a new trade
export const placeTrade = createAsyncThunk(
  "trade/placeTrade",
  async (tradeData, thunkAPI) => {
    // console.log("tradeData", tradeData);

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER}/trades`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tradeData),
      });

      // console.log("response.status", response.status);

      if (response.status !== 201) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to place trade");
      }

      const result = await response.json();
      // console.log("result", result);

      return { result, status: response.status };
    } catch (error) {
      console.log("error", error);

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const tradeSlice = createSlice({
  name: "trade",
  initialState: {
    tradeHistory: null,
    currentContest: null,
    totalBalance: 0,
    profitLoss: 0,
    trades: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    tradeStatus: "idle", // for tracking new trade placement status
    start: null,
    end: null,
  },
  reducers: {
    setTradeDetails: (state, action) => {
      const tradeData = action.payload[0]; // Assuming array with one object
      if (tradeData) {
        state.tradeHistory = tradeData;
        state.currentContest = tradeData.contest;
        state.totalBalance = tradeData.totalBalance;
        state.profitLoss = tradeData.profitLoss;
        state.trades = tradeData.trade;
      }
      state.status = "succeeded";
    },
    clearTradeDetails: (state) => {
      state.tradeHistory = null;
      state.currentContest = null;
      state.totalBalance = 0;
      state.profitLoss = 0;
      state.trades = [];
      state.status = "idle";
      state.error = null;
      state.tradeStatus = "idle";
      state.end = null;
      state.start = null;
    },
    updateBalance: (state, action) => {
      state.totalBalance = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle fetch trade history
    builder
      .addCase(fetchTradeHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTradeHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const tradeData = action.payload; // Assuming array with one object
        console.log("tradeData", tradeData);

        if (tradeData) {
          state.tradeHistory = tradeData;
          state.currentContest = tradeData.contest._id;
          state.totalBalance = tradeData.totalBalance;
          state.profitLoss = tradeData.profitLoss;
          state.trades = tradeData.trade;
          state.start = tradeData.contest.startTime;
          state.end = tradeData.contest.endTime;
        }
      })
      .addCase(fetchTradeHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handle place trade
      .addCase(placeTrade.pending, (state) => {
        state.tradeStatus = "loading";
      })
      .addCase(placeTrade.fulfilled, (state, action) => {
        console.log("action", action);

        state.tradeStatus = "succeeded";
        // Add new trade to trades array
        const newTrade = {
          tradeType: action.meta.arg.tradeType,
          quantity: action.meta.arg.quantity,
          price: action.meta.arg.price,
          remainingBalance: action.payload.result.totalBalance,
          tradeDate: new Date().toISOString(),
        };
        state.trades.unshift(newTrade);
        state.totalBalance = action.payload.result.totalBalance;
      })
      .addCase(placeTrade.rejected, (state, action) => {
        state.tradeStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { setTradeDetails, clearTradeDetails, updateBalance } =
  tradeSlice.actions;

export default tradeSlice.reducer;
