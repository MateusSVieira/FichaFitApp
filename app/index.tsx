// app/index.tsx
import { useEffect, useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { useRouter, useRootNavigationState } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getByRoute } from "./lib/api";

// defina apenas a ROTA (relativa) que valida o usuário logado
// ex.: retorna 200/OK quando o token é válido
const AUTH_CHECK_ROUTE = "/auth/me"; // ajuste conforme sua API

export default function Index() {
  const router = useRouter();
  const rootState = useRootNavigationState();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!rootState?.key) return; // espera o Root montar

    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token"); // troque a chave se necessário
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

        // faz a requisição APENAS com a rota; baseURL vem do .env
        const res = await getByRoute(AUTH_CHECK_ROUTE, { headers });

        if (res.status >= 200 && res.status < 300) {
          router.replace("./home");
        } else {
          router.replace("/Login");
        }
      } catch (err) {
        // qualquer falha leva para login
        router.replace("/Login");
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [rootState?.key]);

  // Splash/loading simples enquanto decide rota
  if (checking) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950">
        <ActivityIndicator />
        <Text className="text-slate-300 mt-3">Verificando sessão…</Text>
      </View>
    );
  }

  return null;
}
