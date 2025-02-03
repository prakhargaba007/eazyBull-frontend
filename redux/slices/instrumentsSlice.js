import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  instruments: [],
  loading: true,
  error: null,
  priceColors: {},
  selectedInstrument: null,
};

export const fetchInstruments = createAsyncThunk(
  "instruments/fetchInstruments",
  async (serverUrl) => {
    const response = await fetch(`${serverUrl}/instrument`);
    const data = await response.json();
    return data;
  }
);

const instrumentsSlice = createSlice({
  name: "instruments",
  initialState,
  reducers: {
    updatePrices: (state, action) => {
      const { updates } = action.payload;
      updates.forEach((update) => {
        const instrument = state.instruments.find(
          (inst) => inst._id === update.id
        );
        if (instrument) {
          instrument.price = update.price;
          instrument.lastUpdate = update.timestamp;
        }
      });
    },
    setPriceColor: (state, action) => {
      const { instrumentId, color } = action.payload;
      state.priceColors[instrumentId] = color;
    },
    setSelectedInstrument: (state, action) => {
      const symbol = action.payload;
      state.selectedInstrument = state.instruments.find(
        (inst) => inst.symbol === symbol
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstruments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInstruments.fulfilled, (state, action) => {
        state.instruments = action.payload;
        state.loading = false;
      })
      .addCase(fetchInstruments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updatePrices, setPriceColor, setSelectedInstrument } =
  instrumentsSlice.actions;
export default instrumentsSlice.reducer;
