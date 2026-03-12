import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Habito {
  _id: string;
  nombre: string;
}

interface HabitosState {
  habitos: Habito[];
  loading: boolean;
}

const initialState: HabitosState = {
  habitos: [],
  loading: false,
};

export const fetchHabitos = createAsyncThunk(
  "habitos/fetchHabitos",
  async () => {
    const response = await axios.get("http://localhost:3000/api/habitos");
    return response.data;
  }
);

const habitosSlice = createSlice({
  name: "habitos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabitos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHabitos.fulfilled, (state, action) => {
        state.loading = false;
        state.habitos = action.payload;
      })
      .addCase(fetchHabitos.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default habitosSlice.reducer;
