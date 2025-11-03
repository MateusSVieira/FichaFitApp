// app/login.tsx (ou src/screens/Login.tsx)
import React, { useState } from "react";
import { Platform, KeyboardAvoidingView, TextInput, Pressable, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const onLogin = async () => {
    setCarregando(true);
    try {
      // TODO: chame sua API/autenticação aqui
      await new Promise((r) => setTimeout(r, 900));
    } finally {
      setCarregando(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <View className="flex-1 px-5">
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
              value={email}
              onChangeText={setEmail}
              returnKeyType="next"
            />

            {/* Senha */}
            <Text className="text-slate-300 mt-4 mb-2 font-medium">Senha</Text>
            <View className="flex-row items-center">
              <TextInput
                className="flex-1 h-12 rounded-2xl bg-white/10 border border-white/15 px-4 text-white placeholder:text-slate-400"
                placeholder="••••••••"
                secureTextEntry={!mostrarSenha}
                value={senha}
                onChangeText={setSenha}
                returnKeyType="go"
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

            {/* Links auxiliares */}
            <View className="flex-row justify-between items-center mt-3">
              <Pressable className="py-2">
                <Text className="text-emerald-400 font-medium">Esqueci a senha</Text>
              </Pressable>
              <Pressable className="py-2">
                <Text className="text-slate-400">Ajuda</Text>
              </Pressable>
            </View>

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

            {/* Botão alternativo (ex.: Apple/Google – placeholder) */}
            <Pressable className="h-12 rounded-2xl bg-white/10 border border-white/15 items-center justify-center">
              <Text className="text-white font-medium">Entrar com outro método</Text>
            </Pressable>
          </View>

          {/* Rodapé: cadastro */}
          <View className="items-center mt-6">
            <Text className="text-slate-400">
              Novo por aqui?{" "}
              <Text className="text-emerald-400 font-semibold">Cadastre-se</Text>
            </Text>
          </View>

          {/* Texto legal/segurança */}
          <View className="items-center mt-4">
            <Text className="text-slate-500 text-center text-xs">
              Ao continuar, você concorda com nossos{" "}
              <Text className="text-slate-300 underline">Termos</Text> e{" "}
              <Text className="text-slate-300 underline">Política de Privacidade</Text>.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
