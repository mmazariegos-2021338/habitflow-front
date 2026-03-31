"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchHabitos, toggleHabitLocal, createHabit, deleteHabit } from "@/store/slices/habitosSlice";
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

  const getProgressColor = (racha: number) => {
    const percentage = Math.min((racha / 66) * 100, 100);
    if (percentage < 25) return "bg-red-400";
    if (percentage < 50) return "bg-orange-400";
    if (percentage < 75) return "bg-yellow-400";
    return "bg-emerald-500";
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F7F6F3]">
      {/* Header estilo Notion */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Mis Hábitos</h1>
              <p className="text-xs text-gray-500">Hola, {usuario?.nombre}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Cerrar sesión"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Agregar
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Buscador estilo Notion */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white text-gray-900 placeholder-gray-400 pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filtros estilo Notion */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
          {(["all", "pendiente", "completado"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                filter === f
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f === "all" ? "Todos" : f === "pendiente" ? "Pendientes" : "Completados"}
            </button>
          ))}
        </div>

        {/* Stats cards estilo Notion */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{habitos.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Completados</p>
            <p className="text-2xl font-semibold text-emerald-600 mt-1">{habitos.filter(h => h.completado).length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Racha Total</p>
            <p className="text-2xl font-semibold text-orange-500 mt-1">{habitos.reduce((acc, h) => acc + h.racha, 0)} 🔥</p>
          </div>
        </div>

        {loading && <p className="text-gray-400 text-center py-8">Cargando...</p>}

        {/* Lista de hábitos estilo Notion */}
        <div className="space-y-2">
          {filteredHabitos.map((habito) => {
            const progress = Math.min((habito.racha / 66) * 100, 100);
            return (
              <div
                key={habito._id}
                className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => dispatch(toggleHabitLocal(habito._id))}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                      habito.completado
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-gray-300 hover:border-emerald-500"
                    }`}
                  >
                    {habito.completado && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium text-gray-900 ${habito.completado ? "line-through text-gray-400" : ""}`}>
                      {habito.nombre}
                    </h3>
                    <p className="text-sm text-gray-500">{habito.descripcion}</p>
                  </div>

                  <div className="flex items-center gap-2 text-gray-500 flex-shrink-0">
                    <span className="text-sm">🔥 {habito.racha}</span>
                  </div>

                  <button
                    onClick={() => handleDelete(habito._id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Barra de progreso estilo Notion */}
                <div className="mt-3 ml-9">
                  <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                    <span>Progreso</span>
                    <span>{habito.racha}/66 días</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${getProgressColor(habito.racha)}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredHabitos.length === 0 && !loading && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 border-dashed">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-gray-500 mb-2">No hay hábitos aún</p>
            <p className="text-gray-400 text-sm">Toca el botón + para agregar tu primer hábito</p>
          </div>
        )}
      </div>

      {/* Modal estilo Notion */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-5">Nuevo Hábito</h2>
            <form onSubmit={handleAddHabit}>
              <div className="mb-4">
                <label className="block text-gray-600 text-sm mb-1.5">Nombre</label>
                <input
                  type="text"
                  value={newHabit.nombre}
                  onChange={(e) => setNewHabit({ ...newHabit, nombre: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Ej: Hacer ejercicio"
                  autoFocus
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-600 text-sm mb-1.5">Descripción</label>
                <input
                  type="text"
                  value={newHabit.descripcion}
                  onChange={(e) => setNewHabit({ ...newHabit, descripcion: e.target.value })}
                  className="w-full bg-gray-50 text-gray-900 placeholder-gray-400 px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Ej: 30 minutos de cardio"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}