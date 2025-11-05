// app/(teacher)/AlunoTabs.tsx
import React, { useMemo, useState } from "react";
import { View, Text, TextInput, ScrollView, Pressable, StatusBar, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

// Tema base compacto
const inputBase =
  "h-10 rounded-xl bg-white/5 border border-white/10 px-3 text-white placeholder:text-slate-400 text-[13px]";

// ---------------- Tabs (estilo segmentado compacto) ------------------------
const TABS = [
  { key: "treino", label: "Treino", icon: "activity" as const },
  { key: "dieta", label: "Dieta", icon: "coffee" as const },
  { key: "avaliacao", label: "Avaliação", icon: "clipboard" as const },
  { key: "anexos", label: "Anexos", icon: "paperclip" as const },
];

type TabKey = typeof TABS[number]["key"];

function SegmentedTabs({ active, setActive, width }: { active: TabKey; setActive: (k: TabKey) => void; width: number }) {
  return (
    <View className="mt-2 rounded-xl bg-white/5 border border-white/10 overflow-hidden" style={{ width }}>
      <View className="flex-row">
        {TABS.map((t) => (
          <Pressable
            key={t.key}
            onPress={() => setActive(t.key)}
            className="flex-1 h-11 items-center justify-center"
          >
            <View className="items-center">
              <View className="flex-row items-center">
                <Feather
                  name={t.icon}
                  size={14}
                  color={active === t.key ? "#6ee7b7" : "#94a3b8"}
                />
                <Text
                  allowFontScaling={false}
                  className={`ml-2 text-[12px] ${active === t.key ? "text-emerald-200" : "text-slate-300"}`}
                >
                  {t.label}
                </Text>
              </View>
              <View className={`${active === t.key ? "bg-emerald-500" : "bg-transparent"} h-[2px] w-10 mt-2 rounded-full`} />
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ---------------- Conteúdos das abas --------------------------------------
function TreinoTab({ width }: { width: number }) {
  const [busca, setBusca] = useState("");
  const treinos = useMemo(
    () => [
      { id: "A", titulo: "Treino A — Peito/Tríceps", series: 4, exercicios: 6 },
      { id: "B", titulo: "Treino B — Costas/Bíceps", series: 4, exercicios: 6 },
      { id: "C", titulo: "Treino C — Pernas/Ombro", series: 5, exercicios: 7 },
    ],
    []
  );

  const filtrados = treinos.filter((t) => t.titulo.toLowerCase().includes(busca.toLowerCase()));

  return (
    <View className="mt-3" style={{ width }}>
      <View className="flex-row items-center gap-2">
        <View className="flex-1 flex-row items-center h-12 rounded-xl border border-white/10 px-3 bg-white/5">
          <Feather name="search" size={16} color="#94a3b8" />
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar treino"
            placeholderTextColor="#94a3b8"
            className="flex-1 ml-2 text-white text-[13px]"
          />
        </View>
        <Pressable className="h-10 px-3 rounded-xl bg-emerald-500 items-center justify-center">
          <Text allowFontScaling={false} className="text-white text-[12px] font-semibold">Novo</Text>
        </Pressable>
      </View>

      <View className="mt-2">
        {filtrados.map((t) => (
          <Pressable key={t.id} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 active:bg-white/10 mb-2">
            <Text allowFontScaling={false} className="text-white font-medium text-[14px]" numberOfLines={1}>{t.titulo}</Text>
            <Text allowFontScaling={false} className="text-slate-400 text-[12px] mt-1">{t.exercicios} exercícios • {t.series} séries</Text>
          </Pressable>
        ))}
        {filtrados.length === 0 && (
          <Text allowFontScaling={false} className="text-slate-400 text-[12px]">Nenhum treino encontrado.</Text>
        )}
      </View>
    </View>
  );
}

function DietaTab({ width }: { width: number }) {
  const refeicoes = [
    { id: 1, nome: "Café da manhã", itens: "Ovos, aveia, banana" },
    { id: 2, nome: "Almoço", itens: "Arroz, frango, salada" },
    { id: 3, nome: "Jantar", itens: "Peixe, legumes, batata" },
  ];
  return (
    <View className="mt-3" style={{ width }}>
      <Pressable className="self-start h-10 px-3 rounded-xl bg-emerald-500 items-center justify-center">
        <Text allowFontScaling={false} className="text-white text-[12px] font-semibold">Nova refeição</Text>
      </Pressable>
      <View className="mt-2">
        {refeicoes.map((r) => (
          <View key={r.id} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 mb-2">
            <Text allowFontScaling={false} className="text-white font-medium text-[14px]">{r.nome}</Text>
            <Text allowFontScaling={false} className="text-slate-400 text-[12px] mt-1">{r.itens}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function AvaliacaoTab({ width }: { width: number }) {
  return (
    <View className="mt-3" style={{ width }}>
      <Text allowFontScaling={false} className="text-slate-300 text-[12px] mb-2">Dados corporais</Text>
      <View className="flex-row gap-2">
        <TextInput  className={`flex-1 ${inputBase}`} keyboardType="numeric" placeholder="Peso (kg)" />
        <TextInput className={`flex-1 ${inputBase}`} keyboardType="numeric" placeholder="Altura (cm)" />
      </View>
      <View className="flex-row gap-2 mt-2">
        <TextInput className={`flex-1 ${inputBase}`} keyboardType="numeric" placeholder="% Gordura" />
        <TextInput className={`flex-1 ${inputBase}`} keyboardType="numeric" placeholder="Cintura (cm)" />
      </View>

      <Text allowFontScaling={false} className="text-slate-300 text-[12px] mt-4 mb-2">Observações</Text>
      <TextInput
        className={`min-h-[90px] ${inputBase}`}
        placeholder="Observações do avaliador"
        multiline
        textAlignVertical="top"
      />

      <Pressable className="mt-3 h-10 rounded-xl bg-emerald-500 items-center justify-center">
        <Text allowFontScaling={false} className="text-white text-[12px] font-semibold">Salvar avaliação</Text>
      </Pressable>
    </View>
  );
}

function AnexosTab({ width }: { width: number }) {
  const anexos = [
    { id: "1", nome: "Avaliacao_2025-11.pdf", tipo: "pdf" },
    { id: "2", nome: "Treino_A_foto.jpg", tipo: "img" },
  ];

  return (
    <View className="mt-3" style={{ width }}>
      <View className="flex-row gap-2">
        <Pressable className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 items-center justify-center flex-row">
          <Feather name="upload" size={16} color="#94a3b8" />
          <Text allowFontScaling={false} className="ml-2 text-slate-300 text-[12px]">Enviar PDF</Text>
        </Pressable>
        <Pressable className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 items-center justify-center flex-row">
          <Feather name="image" size={16} color="#94a3b8" />
          <Text allowFontScaling={false} className="ml-2 text-slate-300 text-[12px]">Enviar Foto</Text>
        </Pressable>
      </View>

      <View className="mt-2">
        {anexos.map((a) => (
          <View key={a.id} className="flex-row items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 mb-2">
            <View className="flex-row items-center">
              <Feather name={a.tipo === "pdf" ? "file-text" : "image"} size={16} color="#94a3b8" />
              <Text allowFontScaling={false} className="ml-2 text-white text-[13px]" numberOfLines={1}>{a.nome}</Text>
            </View>
            <View className="flex-row items-center gap-3">
              <Pressable className="px-2 py-1 rounded-lg bg-white/5 border border-white/10"><Text allowFontScaling={false} className="text-[11px] text-slate-300">Abrir</Text></Pressable>
              <Pressable className="px-2 py-1 rounded-lg bg-white/5 border border-white/10"><Text allowFontScaling={false} className="text-[11px] text-rose-300">Excluir</Text></Pressable>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// ---------------- Página ----------------------------------------------------
export default function AlunoTabsScreen() {
  const [active, setActive] = useState<TabKey>("treino");
  const { width } = useWindowDimensions(); // largura exata da tela

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Header em largura total */}
      <View className="pt-2 pb-3 border-b border-white/10" style={{ width }}>
        <View className="px-3">
          <Text allowFontScaling={false} className="text-white text-xl font-extrabold">Aluno</Text>
          <Text allowFontScaling={false} className="text-slate-400 text-[12px] mt-0.5">
            Gerencie treino, dieta, avaliações e anexos.
          </Text>
        </View>
        <View className="px-3">
          <SegmentedTabs active={active} setActive={setActive} width={width - 24 /* pra casar com px-3 */} />
        </View>
      </View>

      {/* Conteúdo ocupando toda a largura */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 12 }}
        style={{ width }}
      >
        {active === "treino" && <TreinoTab width={width - 24} />}
        {active === "dieta" && <DietaTab width={width - 24} />}
        {active === "avaliacao" && <AvaliacaoTab width={width - 24} />}
        {active === "anexos" && <AnexosTab width={width - 24} />}
      </ScrollView>
    </SafeAreaView>
  );
}
