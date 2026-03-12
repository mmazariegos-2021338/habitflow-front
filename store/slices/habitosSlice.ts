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
  habitos: [
    { _id: "1", nombre: "Hacer ejercicio", descripcion: "30 minutos de cardio", completado: false, racha: 5 },
    { _id: "2", nombre: "Leer", descripcion: "20 páginas diarias", completado: true, racha: 12 },
    { _id: "3", nombre: "Meditar", descripcion: "10 minutos cada mañana", completado: false, racha: 3 },
    { _id: "4", nombre: "Beber agua", descripcion: "2 litros al día", completado: true, racha: 8 },
  ],
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
  reducers: {
    toggleHabitLocal: (state, action) => {
      const habito = state.habitos.find((h) => h._id === action.payload);
      if (habito) {
        habito.completado = !habito.completado;
      }
    },
  },
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

export const { toggleHabitLocal } = habitosSlice.actions;

export default habitosSlice.reducer;
