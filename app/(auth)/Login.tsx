// app/(auth)/Login.tsx
import React, { useRef, useState } from "react";
import {
  TextInput,
  Pressable,
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ---------------- MOCK DE USUÁRIO ----------------
// Troque por sua chamada real de API depois.
// Exemplo de credenciais:
// email: demo@pt.com
// senha: 123456
const DEMO_USER = {
  email: "admin",
  senha: "admin",
  token: "mock-demo-token",
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const senhaRef = useRef<TextInput>(null);
  const router = useRouter();

  const onLogin = async () => {
    setCarregando(true);
    setErro(null);
    try {
      // -------- MOCK ----------
      await new Promise((r) => setTimeout(r, 600));

      const ok =
        email.trim().toLowerCase() === DEMO_USER.email &&
        senha.trim() === DEMO_USER.senha;

      if (!ok) {
        setErro("Credenciais inválidas. Use demo@pt.com / 123456 para testar.");
        return;
      }

      // salva um token mockado para o guard da / (index.tsx) entender que está logado
      await AsyncStorage.setItem("token", DEMO_USER.token);

      // vai direto para a Home
      router.replace("../home");
    } catch (e) {
      setErro("Falha ao autenticar. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" translucent={false} backgroundColor="#0f172a" />

      {/* Toca fora para fechar o teclado */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View className="flex-1">
          <KeyboardAwareScrollView
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
            enableOnAndroid
            extraHeight={60}
            extraScrollHeight={60}
            keyboardOpeningTime={0}
            keyboardShouldPersistTaps="always"
            enableAutomaticScroll
            showsVerticalScrollIndicator={false}
          >
            {/* Cabeçalho / Marca */}
            <View className="items-center mt-8">
              <View className="h-16 w-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 items-center justify-center">
                <Text className="text-emerald-400 font-bold text-2xl">PT</Text>
              </View>
              <Text className="text-white text-2xl font-extrabold mt-4">Bem-vindo(a)!</Text>
              <Text className="text-slate-400 mt-1 text-center">
                Entre para acessar seus treinos, progresso e agenda.
              </Text>
            </View>

            {/* Card */}
            <View className="mt-8 rounded-3xl bg-white/5 border border-white/10 p-5 shadow-lg shadow-black/30">
              {/* E-mail */}
              <Text className="text-slate-300 mb-2 font-medium">E-mail</Text>
              <TextInput
                className="h-12 rounded-2xl bg-white/10 border border-white/15 px-4 text-white placeholder:text-slate-400"
                placeholder="voce@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => senhaRef.current?.focus()}
              />

              {/* Senha */}
              <Text className="text-slate-300 mt-4 mb-2 font-medium">Senha</Text>
              <View className="flex-row items-center">
                <TextInput
                  ref={senhaRef}
                  className="flex-1 h-12 rounded-2xl bg-white/10 border border-white/15 px-4 text-white placeholder:text-slate-400"
                  placeholder="••••••••"
                  secureTextEntry={!mostrarSenha}
                  value={senha}
                  onChangeText={setSenha}
                  returnKeyType="go"
                  blurOnSubmit={false}
                  autoComplete="password"
                  textContentType="password"
                  onSubmitEditing={onLogin}
                />
                <Pressable
                  onPress={() => setMostrarSenha((v) => !v)}
                  className="ml-2 h-12 px-3 rounded-2xl border border-white/15 bg-white/5 items-center justify-center"
                >
                  <Text className="text-slate-300 text-xs">
                    {mostrarSenha ? "Ocultar" : "Mostrar"}
                  </Text>
                </Pressable>
              </View>

              {/* Erro */}
              {erro && (
                <View className="mt-3 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2">
                  <Text className="text-rose-300 text-[12px]">{erro}</Text>
                </View>
              )}

              {/* Botão Entrar */}
              <Pressable
                onPress={onLogin}
                disabled={carregando}
                className="mt-4 h-12 rounded-2xl bg-emerald-500 active:bg-emerald-600 items-center justify-center disabled:opacity-60"
              >
                <Text className="text-white font-semibold">
                  {carregando ? "Entrando..." : "Entrar"}
                </Text>
              </Pressable>

              {/* Divisor */}
              <View className="flex-row items-center my-5">
                <View className="flex-1 h-[1px] bg-white/10" />
                <Text className="mx-3 text-slate-500 text-xs">ou</Text>
                <View className="flex-1 h-[1px] bg-white/10" />
              </View>

              {/* Botão alternativo (placeholder) */}
              <Pressable className="h-12 rounded-2xl bg-white/10 border border-white/15 items-center justify-center">
                <Text className="text-white font-medium">Entrar com outro método</Text>
              </Pressable>
            </View>

            {/* Rodapé: cadastro */}
            <View className="items-center mt-6">
              <Text className="text-slate-400">
                Novo por aqui?{" "}
                <Link href="/Signup" className="text-emerald-400 font-semibold">
                  Cadastre-se
                </Link>
              </Text>
            </View>

            {/* Texto legal/segurança */}
            <View className="items-center mt-4 mb-3">
              <Text className="text-slate-500 text-center text-xs">
                Ao continuar, você concorda com nossos{" "}
                <Text className="text-slate-300 underline">Termos</Text> e{" "}
                <Text className="text-slate-300 underline">Política de Privacidade</Text>.
              </Text>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
