// app/forgot.tsx
import React, { useState } from "react";
import { Platform, KeyboardAvoidingView, TextInput, Pressable, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onEnviar = async () => {
    setMsg(null);
    if (!email) {
      setMsg("Informe seu e-mail para receber as instruções.");
      return;
    }
    setEnviando(true);
    try {
      // TODO: chame sua API de recuperação de senha
      await new Promise((r) => setTimeout(r, 900));
      setMsg("Se o e-mail existir, enviaremos um link de redefinição.");
    } finally {
      setEnviando(false);
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
            <Text className="text-white text-2xl font-extrabold mt-4">Esqueci a senha</Text>
            <Text className="text-slate-400 mt-1 text-center">
              Informe seu e-mail para receber o link de redefinição.
            </Text>
          </View>

          {/* Card */}
          <View className="mt-8 rounded-3xl bg-white/5 border border-white/10 p-5 shadow-lg shadow-black/30">
            {!!msg && (
              <View
                className={`mb-3 rounded-xl p-3 border ${
                  msg.startsWith("Se o e-mail")
                    ? "bg-emerald-500/10 border-emerald-400/30"
                    : "bg-amber-500/10 border-amber-400/30"
                }`}
              >
                <Text
                  className={`text-xs ${
                    msg.startsWith("Se o e-mail") ? "text-emerald-300" : "text-amber-300"
                  }`}
                >
                  {msg}
                </Text>
              </View>
            )}

            {/* E-mail */}
            <Text className="text-slate-300 mb-2 font-medium">E-mail</Text>
            <TextInput
              className="h-12 rounded-2xl bg-white/10 border border-white/15 px-4 text-white placeholder:text-slate-400"
              placeholder="voce@email.com"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              returnKeyType="go"
              onSubmitEditing={onEnviar}
            />

            {/* Botão Enviar */}
            <Pressable
              onPress={onEnviar}
              disabled={enviando}
              className="mt-5 h-12 rounded-2xl bg-emerald-500 active:bg-emerald-600 items-center justify-center disabled:opacity-60"
            >
              <Text className="text-white font-semibold">
                {enviando ? "Enviando..." : "Enviar instruções"}
              </Text>
            </Pressable>

            {/* Ajuda */}
            <View className="items-center mt-4">
              <Text className="text-slate-500 text-center text-xs">
                Verifique também sua caixa de spam/lixo eletrônico.
              </Text>
            </View>
          </View>

          {/* Voltar ao login / cadastro */}
          <View className="items-center mt-6">
            <Text className="text-slate-400">
              Lembrou a senha?{" "}
              <Link href="/Login" className="text-emerald-400 font-semibold">
                Entrar
              </Link>
            </Text>
            <Text className="text-slate-400 mt-2">
              Novo por aqui?{" "}
              <Link href="/Signup" className="text-emerald-400 font-semibold">
                Cadastre-se
              </Link>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
