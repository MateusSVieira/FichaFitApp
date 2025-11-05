// app/(auth)/Signup.tsx
import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import axios from "axios";

type Role = "aluno" | "personal";
type FeatherName = React.ComponentProps<typeof Feather>["name"];

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "";

// ---------- UI helpers ----------
const label = "text-slate-300 mb-1 text-[12px]";
const input =
  "h-11 rounded-xl bg-white/5 border border-white/10 px-3 text-white placeholder:text-slate-400 text-[13px]";

function Field({
  labelText,
  ...rest
}: {
  labelText: string;
  [k: string]: any;
}) {
  return (
    <View className="mb-3">
      <Text className={label}>{labelText}</Text>
      <TextInput className={input} {...rest} />
    </View>
  );
}

function Chip({
  text,
  selected,
  onPress,
}: {
  text: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-3 h-9 rounded-xl items-center justify-center mr-2 mb-2 ${
        selected ? "bg-emerald-500" : "bg-white/5 border border-white/10"
      }`}
    >
      <Text className={`text-[12px] ${selected ? "text-white" : "text-slate-300"}`}>
        {text}
      </Text>
    </Pressable>
  );
}

function RoleTabs({ role, setRole }: { role: Role; setRole: (r: Role) => void }) {
  return (
    <View className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
      <View className="flex-row">
        {(["aluno", "personal"] as Role[]).map((r) => (
          <Pressable
            key={r}
            onPress={() => setRole(r)}
            className={`flex-1 h-11 items-center justify-center ${
              role === r ? "bg-white/10" : ""
            }`}
          >
            <View className="flex-row items-center">
              <Feather
                // ícones válidos do Feather
                name={(r === "aluno" ? "user" : "activity") as FeatherName}
                size={16}
                color={role === r ? "#6ee7b7" : "#94a3b8"}
              />
              <Text
                className={`ml-2 text-[12px] ${
                  role === r ? "text-emerald-200" : "text-slate-300"
                }`}
              >
                {r === "aluno" ? "Aluno" : "Personal Trainer"}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ---------- Página ----------
export default function SignupScreen() {
  const navigation = useNavigation();

  // Configura o header localmente (mantém a seta e remove linhas brancas)
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerBackTitleVisible: false,
      headerShadowVisible: false,
      headerTintColor: "#fff",
      headerStyle: { backgroundColor: "#0f172a" },
      contentStyle: { backgroundColor: "#0b1220" },
    } as any);
  }, [navigation]);

  const [role, setRole] = useState<Role>("aluno");
  const [loading, setLoading] = useState(false);

  // comuns
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");

  // aluno
  const [cpfAluno, setCpfAluno] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [condicao, setCondicao] = useState("");

  // personal
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [anosExp, setAnosExp] = useState("");
  const [precoHora, setPrecoHora] = useState("");
  const [bio, setBio] = useState("");
  const especialidades = useMemo(
    () => ["Emagrecimento", "Hipertrofia", "Funcional", "Reabilitação", "Performance"],
    []
  );
  const [especialSel, setEspecialSel] = useState<string[]>([]);

  const toggleEspecial = (s: string) =>
    setEspecialSel((old) => (old.includes(s) ? old.filter((i) => i !== s) : [...old, s]));

  // validações mínimas
  function validate() {
    if (!nome || !email || !senha || !confirmar) return "Preencha nome, e-mail e senha.";
    if (senha !== confirmar) return "As senhas não conferem.";
    if (role === "aluno") {
      if (!cpfAluno) return "Informe o CPF.";
    } else {
      if (!cpfCnpj) return "Informe o CPF/CNPJ.";
      if (!anosExp) return "Informe os anos de experiência.";
      if (!precoHora) return "Informe o preço/hora.";
      if (especialSel.length === 0) return "Selecione ao menos uma especialidade.";
    }
    return null;
  }

  async function onSubmit() {
    const err = validate();
    if (err) {
      Alert.alert("Atenção", err);
      return;
    }
    setLoading(true);
    try {
      const payload =
        role === "aluno"
          ? {
              role,
              nome,
              email,
              senha,
              telefone,
              cep,
              endereco,
              cpf: cpfAluno,
              nascimento,
              objetivo,
              condicao_medica: condicao,
            }
          : {
              role,
              nome,
              email,
              senha,
              telefone,
              cep,
              endereco,
              cpf_cnpj: cpfCnpj,
              anos_experiencia: Number(anosExp),
              preco_hora: Number(precoHora),
              bio,
              especialidades: especialSel,
            };

      const url = `${API_URL}/auth/register`;
      // comente a linha abaixo caso ainda não tenha backend
      await axios.post(url, payload);

      Alert.alert("Sucesso", "Cadastro realizado! Você já pode fazer login.");
    } catch (e: any) {
      Alert.alert("Erro", e?.response?.data?.message ?? "Não foi possível cadastrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0b1220" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Título */}
        <View className="pt-3 pb-3">
          <Text className="text-white text-2xl font-extrabold">Criar conta</Text>
          <Text className="text-slate-400 text-[12px] mt-1">
            Escolha o tipo de conta e preencha seus dados.
          </Text>
        </View>

        {/* Abas (Aluno / Personal) */}
        <RoleTabs role={role} setRole={setRole} />

        {/* Campos comuns */}
        <View className="mt-4">
          <Field labelText="Nome completo" value={nome} onChangeText={setNome} placeholder="Ex.: Ana Souza" />
          <Field
            labelText="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="voce@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
          <View className="flex-row gap-2">
            <View className="flex-1">
              <Text className={label}>Senha</Text>
              <TextInput className={input} value={senha} onChangeText={setSenha} placeholder="••••••••" secureTextEntry />
            </View>
            <View className="flex-1">
              <Text className={label}>Confirmar senha</Text>
              <TextInput className={input} value={confirmar} onChangeText={setConfirmar} placeholder="••••••••" secureTextEntry />
            </View>
          </View>

          <View className="flex-row gap-2 mt-3">
            <View className="flex-1">
              <Text className={label}>Telefone</Text>
              <TextInput className={input} value={telefone} onChangeText={setTelefone} placeholder="(11) 99999-9999" keyboardType="phone-pad" />
            </View>
            <View className="w-32">
              <Text className={label}>CEP</Text>
              <TextInput className={input} value={cep} onChangeText={setCep} placeholder="00000-000" keyboardType="numeric" />
            </View>
          </View>

          <Field labelText="Endereço" value={endereco} onChangeText={setEndereco} placeholder="Rua, número, bairro, cidade" />
        </View>

        {/* Campos por papel */}
        {role === "aluno" ? (
          <View className="mt-2">
            <Text className="text-slate-200 font-semibold mb-2">Dados do aluno</Text>
            <Field labelText="CPF" value={cpfAluno} onChangeText={setCpfAluno} placeholder="000.000.000-00" keyboardType="numeric" />
            <View className="flex-row gap-2">
              <View className="flex-1">
                <Text className={label}>Data de nascimento</Text>
                <TextInput className={input} value={nascimento} onChangeText={setNascimento} placeholder="dd/mm/aaaa" keyboardType="numbers-and-punctuation" />
              </View>
              <View className="flex-1">
                <Text className={label}>Objetivo</Text>
                <TextInput className={input} value={objetivo} onChangeText={setObjetivo} placeholder="Emagrecer, ganhar massa..." />
              </View>
            </View>
            <Text className={label + " mt-3"}>Condição médica (opcional)</Text>
            <TextInput
              className="min-h-[90px] rounded-xl bg-white/5 border border-white/10 px-3 text-white placeholder:text-slate-400 text-[13px]"
              value={condicao}
              onChangeText={setCondicao}
              placeholder="Ex.: hipertensão controlada, histórico de lesão..."
              multiline
              textAlignVertical="top"
            />
          </View>
        ) : (
          <View className="mt-2">
            <Text className="text-slate-200 font-semibold mb-2">Informações do personal trainer</Text>
            <Field labelText="CPF/CNPJ" value={cpfCnpj} onChangeText={setCpfCnpj} placeholder="000.000.000-00" keyboardType="numbers-and-punctuation" />
            <View className="flex-row gap-2">
              <View className="flex-1">
                <Text className={label}>Anos de experiência</Text>
                <TextInput className={input} value={anosExp} onChangeText={setAnosExp} placeholder="Ex.: 5" keyboardType="numeric" />
              </View>
              <View className="flex-1">
                <Text className={label}>Preço por hora (R$)</Text>
                <TextInput className={input} value={precoHora} onChangeText={setPrecoHora} placeholder="Ex.: 120" keyboardType="numeric" />
              </View>
            </View>

            <Text className={label + " mt-3"}>Especialidades</Text>
            <View className="flex-row flex-wrap">
              {especialidades.map((s) => (
                <Chip key={s} text={s} selected={especialSel.includes(s)} onPress={() => toggleEspecial(s)} />
              ))}
            </View>

            {/* <Text className={label + " mt-3"}>Bio / sobre você</Text>
            <TextInput
              className="min-h-[100px] rounded-xl bg-white/5 border border-white/10 px-3 text-white placeholder:text-slate-400 text-[13px]"
              value={bio}
              onChangeText={setBio}
              placeholder="Conte um pouco sobre sua formação, certificações e metodologia."
              multiline
              textAlignVertical="top"
            /> */}
          </View>
        )}

        {/* Botão enviar */}
        <Pressable
          onPress={onSubmit}
          disabled={loading}
          className="mt-4 h-12 rounded-2xl bg-emerald-500 items-center justify-center active:bg-emerald-600 disabled:opacity-60"
        >
          <Text className="text-white font-semibold">{loading ? "Enviando..." : "Criar conta"}</Text>
        </Pressable>

        <Text className="text-slate-500 text-[11px] text-center mt-3">
          Ao continuar, você concorda com os Termos de Uso e Política de Privacidade.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
