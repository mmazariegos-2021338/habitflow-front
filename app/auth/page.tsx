"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login, register, clearError } from "@/store/slices/authSlice";

export default function AuthPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, isLogin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(login({ email: formData.email, password: formData.password }));
    } else {
      dispatch(register(formData));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ nombre: "", email: "", password: "" });
    dispatch(clearError());
  };

  return (
    <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">HabitFlow</h1>
          <p className="text-gray-400">
            {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta"}
          </p>
        </div>

        <div className="bg-[#262626] rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-gray-400 text-sm mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required={!isLogin}
                  className="w-full bg-[#1e1e1e] text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-[#3d3d3d] focus:outline-none focus:border-blue-500"
                  placeholder="Tu nombre"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-400 text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#1e1e1e] text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-[#3d3d3d] focus:outline-none focus:border-blue-500"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-[#1e1e1e] text-white placeholder-gray-500 px-4 py-3 rounded-lg border border-[#3d3d3d] focus:outline-none focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Cargando..." : isLogin ? "Iniciar Sesión" : "Registrarse"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isLogin
                ? "¿No tienes cuenta? Regístrate"
                : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
