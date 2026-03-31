import axios from "axios";

const api = axios.create({
  baseURL: "https://habitflow-snowy.vercel.app/api",
});

// Interceptor para agregar el token JWT a todas las peticiones
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido - limpiar localStorage y redirigir a login
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  }
);

export default api;