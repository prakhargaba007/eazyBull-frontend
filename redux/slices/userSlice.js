// redux/slices/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Thunk to fetch user details from the API using GET request with authorization
export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (_, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      // console.log("tokensss", token);

      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER}/users/getUser`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }

      const userData = await response.json();
      // console.log("userData", userData);

      return userData;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Reducer to set user details directly after login
    setUserDetails: (state, action) => {
      state.userInfo = action.payload;
      state.status = "succeeded"; // Mark as succeeded since data is available
    },
    // Optional: If you want to reset the user state
    clearUserDetails: (state) => {
      state.userInfo = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userInfo = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setUserDetails, clearUserDetails } = userSlice.actions;

export default userSlice.reducer;
