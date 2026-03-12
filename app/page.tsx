"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchHabitos } from "@/store/slices/habitosSlice";

export default function Home() {
  const dispatch = useAppDispatch();
  const { habitos, loading } = useAppSelector((state) => state.habitos);

  useEffect(() => {
    dispatch(fetchHabitos());
  }, [dispatch]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 text-white">
      <div>
        <h1 className="text-3xl font-bold mb-4">Habitos</h1>

        {loading && <p>Cargando...</p>}

        <ul>
          {habitos.map((habito) => (
            <li key={habito._id}>{habito.nombre}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
