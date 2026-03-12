import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Habito {
  _id: string;
  nombre: string;
  descripcion: string;
  completado: boolean;
  racha: number;
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

export const toggleHabit = createAsyncThunk(
  "habitos/toggleHabit",
  async (habitoId: string) => {
    const response = await axios.patch(`http://localhost:3000/api/habitos/${habitoId}/toggle`);
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
      })
      .addCase(toggleHabit.fulfilled, (state, action) => {
        const index = state.habitos.findIndex((h) => h._id === action.payload._id);
        if (index !== -1) {
          state.habitos[index] = action.payload;
        }
      });
  },
});

export default habitosSlice.reducer;
