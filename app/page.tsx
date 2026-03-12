"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchHabitos, toggleHabit } from "@/store/slices/habitosSlice";

export default function Home() {
  const dispatch = useAppDispatch();
  const { habitos, loading } = useAppSelector((state) => state.habitos);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "pendiente" | "completado">("all");

  useEffect(() => {
    dispatch(fetchHabitos());
  }, [dispatch]);

  const filteredHabitos = habitos.filter((habito) => {
    const matchesSearch = habito.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "pendiente" && !habito.completado) ||
      (filter === "completado" && habito.completado);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#1e1e1e] px-4 py-6">
      <div className="max-w-md mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Mis Hábitos</h1>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            + Agregar
          </button>
        </header>

        <div className="mb-4">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar hábitos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#2c2c2c] text-white placeholder-gray-400 pl-10 pr-4 py-3 rounded-lg border border-[#3d3d3d] focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {(["all", "pendiente", "completado"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                filter === f
                  ? "bg-blue-500 text-white"
                  : "bg-[#262626] text-gray-300 hover:bg-[#2c2c2c]"
              }`}
            >
              {f === "all" ? "Todos" : f === "pendiente" ? "Pendientes" : "Completados"}
            </button>
          ))}
        </div>

        {loading && <p className="text-gray-400 text-center">Cargando...</p>}

        <div className="space-y-3">
          {filteredHabitos.map((habito) => (
            <div
              key={habito._id}
              className="bg-[#262626] rounded-xl p-4 flex items-center gap-4"
            >
              <button
                onClick={() => dispatch(toggleHabit(habito._id))}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  habito.completado
                    ? "bg-green-500 border-green-500"
                    : "border-gray-500 hover:border-green-500"
                }`}
              >
                {habito.completado && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              <div className="flex-1">
                <h3 className={`font-medium ${habito.completado ? "text-gray-400 line-through" : "text-white"}`}>
                  {habito.nombre}
                </h3>
                <p className="text-sm text-gray-400">{habito.descripcion}</p>
              </div>

              <div className="flex items-center gap-1 text-orange-400">
                <span className="text-lg">🔥</span>
                <span className="font-medium">{habito.racha}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredHabitos.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-2">No hay hábitos</p>
            <p className="text-gray-500 text-sm">Toca el botón + para agregar uno</p>
          </div>
        )}
      </div>
    </div>
  );
}
