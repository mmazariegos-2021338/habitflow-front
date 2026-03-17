"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchHabitos, toggleHabit, createHabit, deleteHabit } from "@/store/slices/habitosSlice";
import { logout } from "@/store/slices/authSlice";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { habitos, loading } = useAppSelector((state) => state.habitos);
  const { isAuthenticated, usuario } = useAppSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "pendiente" | "completado">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabit, setNewHabit] = useState({ nombre: "", descripcion: "" });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchHabitos());
    }
  }, [dispatch, isAuthenticated]);

  const filteredHabitos = habitos.filter((habito) => {
    const matchesSearch = habito.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "pendiente" && !habito.completado) ||
      (filter === "completado" && habito.completado);
    return matchesSearch && matchesFilter;
  });

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.nombre.trim()) {
      dispatch(createHabit(newHabit));
      setNewHabit({ nombre: "", descripcion: "" });
      setShowAddModal(false);
    }
  };

  const handleDelete = (id: string) => {
    dispatch(deleteHabit(id));
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth");
  };

  // Función para obtener el color de la barra de progreso según la racha
  const getProgressColor = (racha: number) => {
    const percentage = Math.min((racha / 66) * 100, 100);
    if (percentage < 25) return "bg-red-500";
    if (percentage < 50) return "bg-orange-500";
    if (percentage < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1e1e1e] px-4 py-6">
      <div className="max-w-md mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Mis Hábitos</h1>
            <p className="text-sm text-gray-400">Hola, {usuario?.nombre}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleLogout}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded-lg transition-colors"
              title="Cerrar sesión"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              + Agregar
            </button>
          </div>
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
          {filteredHabitos.map((habito) => {
            const progress = Math.min((habito.racha / 66) * 100, 100);
            return (
              <div
                key={habito._id}
                className="bg-[#262626] rounded-xl p-4"
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => dispatch(toggleHabit(habito._id))}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
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

                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium truncate ${habito.completado ? "text-gray-400 line-through" : "text-white"}`}>
                      {habito.nombre}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">{habito.descripcion}</p>
                  </div>

                  <div className="flex items-center gap-1 text-orange-400 flex-shrink-0">
                    <span className="text-lg">🔥</span>
                    <span className="font-medium">{habito.racha}</span>
                  </div>

                  <button
                    onClick={() => handleDelete(habito._id)}
                    className="text-gray-500 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Barra de progreso */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progreso (días)</span>
                    <span>{habito.racha}/66 días</span>
                  </div>
                  <div className="w-full bg-[#3d3d3d] rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(habito.racha)}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredHabitos.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-2">No hay hábitos</p>
            <p className="text-gray-500 text-sm">Toca el botón + para agregar uno</p>
          </div>
        )}

        {/* Modal para agregar hábito */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#262626] rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-white mb-4">Nuevo Hábito</h2>
              <form onSubmit={handleAddHabit}>
                <div className="mb-4">
                  <label className="block text-gray-400 text-sm mb-1">Nombre</label>
                  <input
                    type="text"
                    value={newHabit.nombre}
                    onChange={(e) => setNewHabit({ ...newHabit, nombre: e.target.value })}
                    className="w-full bg-[#1e1e1e] text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-[#3d3d3d] focus:outline-none focus:border-blue-500"
                    placeholder="Ej: Hacer ejercicio"
                    autoFocus
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-400 text-sm mb-1">Descripción</label>
                  <input
                    type="text"
                    value={newHabit.descripcion}
                    onChange={(e) => setNewHabit({ ...newHabit, descripcion: e.target.value })}
                    className="w-full bg-[#1e1e1e] text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-[#3d3d3d] focus:outline-none focus:border-blue-500"
                    placeholder="Ej: 30 minutos de cardio"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 rounded-lg bg-[#3d3d3d] text-gray-300 hover:bg-[#4d4d4d] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  >
                    Crear
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
