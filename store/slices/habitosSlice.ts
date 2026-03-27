import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

interface Habito {
  _id: string;
  nombre: string;
  descripcion: string;
  completado: boolean;
  racha: number;
  fechaUltimoCompletado?: string;
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
    const response = await api.get("/habitos");
    return response.data;
  }
);

export const toggleHabit = createAsyncThunk(
  "habitos/toggleHabit",
  async (habitoId: string) => {
    const response = await api.patch(`/habitos/${habitoId}/toggle`);
    return response.data;
  }
);

export const createHabit = createAsyncThunk(
  "habitos/createHabit",
  async (habito: { nombre: string; descripcion: string }) => {
    const response = await api.post("/habitos", habito);
    return response.data;
  }
);

export const deleteHabit = createAsyncThunk(
  "habitos/deleteHabit",
  async (habitoId: string) => {
    await api.delete(`/habitos/${habitoId}`);
    return habitoId;
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
      })
      .addCase(createHabit.fulfilled, (state, action) => {
        state.habitos.push(action.payload);
      })
      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.habitos = state.habitos.filter((h) => h._id !== action.payload);
      });
  },
});

export default habitosSlice.reducer;
