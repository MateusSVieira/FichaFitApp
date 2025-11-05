// app/lib/api.ts
import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
if (!BASE_URL) {
  console.warn("[api] EXPO_PUBLIC_API_URL não definido no .env");
}

export const api = axios.create({
  baseURL: BASE_URL,
  // timeout: 10000, // opcional
});

// helper opcional para GET por rota relativa
export const getByRoute = <T = any>(route: string, config?: any) => api.get<T>(route, config);
