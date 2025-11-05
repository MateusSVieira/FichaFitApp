// app/signup.tsx
import React, { useState } from "react";
import { Platform, KeyboardAvoidingView, TextInput, Pressable, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

export default function SignupScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const onCadastrar = async () => {
    setErro(null);
    if (!nome || !email || !senha || !confirmar) {
      setErro("Preencha todos os campos.");
      return;
    }
    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (senha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }
    setCarregando(true);
    try {
      // TODO: chame sua API de cadastro
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
          {/* Cabeçalho */}
          <View className="items-center mt-8">
            <View className="h-16 w-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 items-center justify-center">
              <Text className="text-emerald-400 font-bold text-2xl">PT</Text>
            </View>
            <Text className="text-white text-2xl font-extrabold mt-4">Crie sua conta</Text>
            <Text className="text-slate-400 mt-1 text-center">
              Cadastre-se para começar seus treinos personalizados.
            </Text>
          </View>

          {/* Card */}
          <View className="mt-8 rounded-3xl bg-white/5 border border-white/10 p-5 shadow-lg shadow-black/30">
            {!!erro && (
              <View className="mb-3 rounded-xl bg-red-500/10 border border-red-400/30 p-3">
                <Text className="text-red-300 text-xs">{erro}</Text>
              </View>
            )}

            {/* Nome */}
            <Text className="text-slate-300 mb-2 font-medium">Nome</Text>
            <TextInput
              className="h-12 rounded-2xl bg-white/10 border border-white/15 px-4 text-white placeholder:text-slate-400"
              placeholder="Seu nome completo"
              value={nome}
              onChangeText={setNome}
              returnKeyType="next"
            />

            {/* E-mail */}
            <Text className="text-slate-300 mt-4 mb-2 font-medium">E-mail</Text>
            <TextInput
              className="h-12 rounded-2xl bg-white/10 border border-white/15 px-4 text-white placeholder:text-slate-400"
              placeholder="voce@email.com"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
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
                returnKeyType="next"
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

            {/* Confirmar Senha */}
            <Text className="text-slate-300 mt-4 mb-2 font-medium">Confirmar senha</Text>
            <View className="flex-row items-center">
              <TextInput
                className="flex-1 h-12 rounded-2xl bg-white/10 border border-white/15 px-4 text-white placeholder:text-slate-400"
                placeholder="••••••••"
                secureTextEntry={!mostrarConfirmar}
                value={confirmar}
                onChangeText={setConfirmar}
                returnKeyType="go"
                onSubmitEditing={onCadastrar}
              />
              <Pressable
                onPress={() => setMostrarConfirmar((v) => !v)}
                className="ml-2 h-12 px-3 rounded-2xl border border-white/15 bg-white/5 items-center justify-center"
              >
                <Text className="text-slate-300 text-xs">
                  {mostrarConfirmar ? "Ocultar" : "Mostrar"}
                </Text>
              </Pressable>
            </View>

            {/* Botão Cadastrar */}
            <Pressable
              onPress={onCadastrar}
              disabled={carregando}
              className="mt-5 h-12 rounded-2xl bg-emerald-500 active:bg-emerald-600 items-center justify-center disabled:opacity-60"
            >
              <Text className="text-white font-semibold">
                {carregando ? "Cadastrando..." : "Criar conta"}
              </Text>
            </Pressable>

            {/* Termos */}
            <Text className="text-slate-500 text-center text-xs mt-3">
              Ao criar conta, você concorda com os{" "}
              <Text className="text-slate-300 underline">Termos</Text> e a{" "}
              <Text className="text-slate-300 underline">Política de Privacidade</Text>.
            </Text>
          </View>

          {/* Já tem conta */}
          <View className="items-center mt-6">
            <Text className="text-slate-400">
              Já tem conta?{" "}
              <Link href="/Login" className="text-emerald-400 font-semibold">
                Entrar
              </Link>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
