// app/(teacher)/Students.tsx
import React, { useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  RefreshControl,
  StatusBar,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";

/* ---------- Layout ---------- */
const GRID_WIDTH = 680;

/* ---------- Tipos ---------- */
export type Aluno = {
  id: string;
  nome: string;
  email?: string;
  plano: "Mensal" | "Trimestral" | "Semestral" | "Anual";
  status: "Ativo" | "Inativo" | "Pausado";
  proximaSessao?: string; // ISO date
  progresso: number; // 0..100
  objetivo?:
    | "Hipertrofia"
    | "Emagrecimento"
    | "Condicionamento"
    | "Performance"
    | "Reabilitação";
};

/* ---------- Mock data (trocar pela API) ---------- */
const MOCK_ALUNOS: Aluno[] = [
  { id: "1", nome: "Ana Souza", email: "ana@example.com", plano: "Mensal", status: "Ativo", proximaSessao: new Date(Date.now() + 86400000).toISOString(), progresso: 62, objetivo: "Hipertrofia" },
  { id: "2", nome: "Bruno Lima", email: "bruno@example.com", plano: "Trimestral", status: "Pausado", proximaSessao: undefined, progresso: 28, objetivo: "Reabilitação" },
  { id: "3", nome: "Carla Mendes", email: "carla@example.com", plano: "Anual", status: "Ativo", proximaSessao: new Date(Date.now() + 3 * 86400000).toISOString(), progresso: 85, objetivo: "Performance" },
  { id: "4", nome: "Diego Ferraz", email: "diego@example.com", plano: "Semestral", status: "Inativo", proximaSessao: undefined, progresso: 10, objetivo: "Emagrecimento" },
  { id: "5", nome: "Elisa Prado", email: "elisa@example.com", plano: "Mensal", status: "Ativo", proximaSessao: new Date(Date.now() + 2 * 86400000).toISOString(), progresso: 47, objetivo: "Condicionamento" },
];

/* ---------- Utils ---------- */
const formatDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString() : "—");

const badgeClassesByStatus: Record<Aluno["status"], string> = {
  Ativo: "bg-emerald-500/15 text-emerald-300 border-emerald-400/20",
  Inativo: "bg-rose-500/15 text-rose-300 border-rose-400/20",
  Pausado: "bg-amber-500/15 text-amber-300 border-amber-400/20",
};

const planoColors: Record<Aluno["plano"], string> = {
  Mensal: "bg-sky-500/10 text-sky-300 border-sky-400/20",
  Trimestral: "bg-indigo-500/10 text-indigo-300 border-indigo-400/20",
  Semestral: "bg-violet-500/10 text-violet-300 border-violet-400/20",
  Anual: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-400/20",
};

/* ---------- UI helpers ---------- */
function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-2.5 py-1.5 rounded-xl border ${active ? "bg-emerald-500/20 border-emerald-400/30" : "bg-white/5 border-white/10"}`}
    >
      <Text allowFontScaling={false} className={`${active ? "text-emerald-200" : "text-slate-300"} text-[11px] font-medium`}>
        {label}
      </Text>
    </Pressable>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <View className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
      <View style={{ width: `${Math.min(100, Math.max(0, value))}%` }} className="h-full bg-emerald-500" />
    </View>
  );
}

/* ---------- DataGrid header ---------- */
function GridHeader({
  onSort,
  sortKey,
  sortDir,
}: {
  onSort: (key: keyof Aluno) => void;
  sortKey?: keyof Aluno;
  sortDir: "asc" | "desc";
}) {
  const HeaderCell = ({ label, colKey, flex }: { label: string; colKey?: keyof Aluno; flex?: number }) => {
    const isActive = !!colKey && sortKey === colKey;
    const iconName: React.ComponentProps<typeof Feather>["name"] =
      !colKey ? "help-circle" : isActive ? (sortDir === "asc" ? "chevron-up" : "chevron-down") : "chevrons-up";

    return (
      <Pressable onPress={() => colKey && onSort(colKey)} disabled={!colKey} className="flex-row items-center" style={{ flex }}>
        <Text allowFontScaling={false} className="text-[10px] uppercase tracking-wider text-slate-400 mr-1">{label}</Text>
        {colKey ? <Feather name={iconName} size={12} color="#94a3b8" /> : null}
      </Pressable>
    );
  };

  return (
    <View style={{ width: GRID_WIDTH }} className="flex-row items-center border-b border-white/10 px-3 py-2 bg-white/5">
      <HeaderCell label="Nome" colKey="nome" flex={2} />
      <HeaderCell label="Plano" colKey="plano" flex={1} />
      <HeaderCell label="Status" colKey="status" flex={1} />
      <HeaderCell label="Próx. Sessão" colKey="proximaSessao" flex={1} />
      <HeaderCell label="Progresso" colKey="progresso" flex={1} />
    </View>
  );
}

/* ---------- DataGrid row ---------- */
function GridRow({ item, onPress }: { item: Aluno; onPress?: (aluno: Aluno) => void }) {
  return (
    <Pressable onPress={() => onPress?.(item)} style={{ width: GRID_WIDTH }} className="flex-row items-center px-3 py-2.5 border-b border-white/5">
      <View style={{ flex: 2 }}>
        <Text allowFontScaling={false} className="text-white font-medium text-[13px]" numberOfLines={1}>{item.nome}</Text>
        {item.email && <Text allowFontScaling={false} className="text-slate-400 text-[11px]" numberOfLines={1}>{item.email}</Text>}
      </View>
      <View style={{ flex: 1 }} className="items-start">
        <Text allowFontScaling={false} className={`text-[10px] px-2 py-0.5 rounded-full border ${planoColors[item.plano]}`}>{item.plano}</Text>
      </View>
      <View style={{ flex: 1 }} className="items-start">
        <Text allowFontScaling={false} className={`text-[10px] px-2 py-0.5 rounded-full border ${badgeClassesByStatus[item.status]}`}>{item.status}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text allowFontScaling={false} className="text-slate-200 text-[12px]" numberOfLines={1}>{formatDate(item.proximaSessao)}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <ProgressBar value={item.progresso} />
      </View>
    </Pressable>
  );
}

/* ---------- Tela ---------- */
export default function StudentsScreen() {
  const router = useRouter();

  const [busca, setBusca] = useState("");
  const [statusAtivo, setStatusAtivo] = useState<Aluno["status"] | "Todos">("Todos");
  const [planoAtivo, setPlanoAtivo] = useState<Aluno["plano"] | "Todos">("Todos");
  const [objetivoAtivo, setObjetivoAtivo] = useState<Aluno["objetivo"] | "Todos">("Todos");
  const [sortKey, setSortKey] = useState<keyof Aluno | undefined>("nome");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [refreshing, setRefreshing] = useState(false);

  const onSort = useCallback(
    (key: keyof Aluno) => {
      setSortKey((prev) => (prev === key ? prev : key));
      setSortDir((prev) => (sortKey === key ? (prev === "asc" ? "desc" : "asc") : "asc"));
    },
    [sortKey]
  );

  const limparFiltros = useCallback(() => {
    setStatusAtivo("Todos");
    setPlanoAtivo("Todos");
    setObjetivoAtivo("Todos");
    setBusca("");
    setSortKey("nome");
    setSortDir("asc");
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  const dados = MOCK_ALUNOS;

  const alunosFiltrados = useMemo(() => {
    let base = dados.filter((a) => {
      const b = busca.trim().toLowerCase();
      const byBusca = !b || a.nome.toLowerCase().includes(b) || (a.email?.toLowerCase().includes(b) ?? false);
      const byStatus = statusAtivo === "Todos" || a.status === statusAtivo;
      const byPlano = planoAtivo === "Todos" || a.plano === planoAtivo;
      const byObjetivo = objetivoAtivo === "Todos" || a.objetivo === objetivoAtivo;
      return byBusca && byStatus && byPlano && byObjetivo;
    });

    if (sortKey) {
      base = base.sort((x, y) => {
        const dir = sortDir === "asc" ? 1 : -1;
        const vx: any = (x as any)[sortKey];
        const vy: any = (y as any)[sortKey];
        if (vx == null && vy == null) return 0;
        if (vx == null) return 1;
        if (vy == null) return -1;
        if (typeof vx === "string" && typeof vy === "string") return vx.localeCompare(vy) * dir;
        return (vx > vy ? 1 : vx < vy ? -1 : 0) * dir;
      });
    }
    return base;
  }, [dados, busca, statusAtivo, planoAtivo, objetivoAtivo, sortKey, sortDir]);

  const temFiltro = busca.length > 0 || statusAtivo !== "Todos" || planoAtivo !== "Todos" || objetivoAtivo !== "Todos";

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      {/* Esconde o header padrão do Expo Router */}
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Header próprio (centralizado e com seta voltar) */}
      <View className="px-4 pt-4 pb-3 flex-row items-center">
        <Pressable
          onPress={() => router.replace("/home")}
          className="h-10 w-10 rounded-xl bg-white/5 items-center justify-center active:bg-white/10"
          accessibilityLabel="Voltar para Home"
        >
          <Feather name="arrow-left" size={18} color="#e2e8f0" />
        </Pressable>

        <View className="ml-3">
          <Text allowFontScaling={false} className="text-white text-3xl font-extrabold">Alunos</Text>
          <Text allowFontScaling={false} className="text-slate-400 mt-1 text-[12px]">
            Gerencie sua base e encontre alunos rapidamente.
          </Text>
        </View>
      </View>

      {/* Busca + Filtros (mais centralizados) */}
      <View className="px-4">
        <View className="mt-2.5 flex-row items-center rounded-xl border border-white/10 px-3 h-12 bg-white/5">
          <Feather name="search" size={16} color="#94a3b8" />
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar por nome ou e-mail"
            placeholderTextColor="#94a3b8"
            className="flex-1 ml-2 text-white text-[13px]"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {busca.length > 0 && (
            <Pressable onPress={() => setBusca("")}>
              <Feather name="x" size={16} color="#94a3b8" />
            </Pressable>
          )}
        </View>

        <View className="mt-2 gap-2">
          <View className="flex-row flex-wrap gap-2">
            {(["Todos", "Ativo", "Inativo", "Pausado"] as const).map((s) => (
              <Chip key={s} label={`Status: ${s}`} active={statusAtivo === s} onPress={() => setStatusAtivo(s as any)} />
            ))}
          </View>
          <View className="flex-row flex-wrap gap-2">
            {(["Todos", "Mensal", "Trimestral", "Semestral", "Anual"] as const).map((p) => (
              <Chip key={p} label={`Plano: ${p}`} active={planoAtivo === p} onPress={() => setPlanoAtivo(p as any)} />
            ))}
          </View>
          <View className="flex-row flex-wrap gap-2">
            {(["Todos", "Hipertrofia", "Emagrecimento", "Condicionamento", "Performance", "Reabilitação"] as const).map((o) => (
              <Chip key={o} label={`Objetivo: ${o}`} active={objetivoAtivo === o} onPress={() => setObjetivoAtivo(o as any)} />
            ))}
          </View>

          <View className="flex-row items-center justify-between mt-1">
            <Pressable onPress={limparFiltros} disabled={!temFiltro} className="px-1.5 py-0.5">
              <Text allowFontScaling={false} className={`text-[11px] font-medium ${temFiltro ? "text-slate-300" : "text-slate-600"}`}>
                Limpar filtros
              </Text>
            </Pressable>

            <Pressable onPress={() => onSort(sortKey ?? "nome")} className="flex-row items-center gap-1 px-1.5 py-0.5">
              <Feather name="sliders" size={14} color="#94a3b8" />
              <Text allowFontScaling={false} className="text-[11px] text-slate-300">
                Ordenar por {sortKey ?? "nome"} ({sortDir})
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* DataGrid com scroll horizontal */}
      <View className="mx-3 my-3 rounded-xl overflow-hidden border border-white/10 bg-white/5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <GridHeader onSort={onSort} sortKey={sortKey} sortDir={sortDir} />
            <FlatList
              data={alunosFiltrados}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <GridRow item={item} onPress={() => {}} />}
              ListEmptyComponent={
                <View className="items-center py-8" style={{ width: GRID_WIDTH }}>
                  <Text allowFontScaling={false} className="text-white font-medium text-[13px]">Nenhum aluno encontrado</Text>
                  <Text allowFontScaling={false} className="text-slate-400 text-[12px] mt-1">Ajuste os filtros ou a busca.</Text>
                </View>
              }
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              contentContainerStyle={{ minHeight: 160 }}
            />
          </View>
        </ScrollView>
      </View>

      {/* Rodapé */}
      <View className="px-4 pb-3">
        <Text allowFontScaling={false} className="text-slate-400 text-[11px]">
          Exibindo {alunosFiltrados.length} de {dados.length} alunos
        </Text>
      </View>
    </SafeAreaView>
  );
}
