// app/(teacher)/dashboard.tsx
import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StatusBar,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Sessao = {
  id: string;
  aluno: string;
  horario: string;   // "07:30"
  tipo: string;      // "Hipertrofia", "Funcional", etc.
  local: string;     // "Online" | "Academia Dr. Fit"
};

export default function TeacherDashboard() {
  // ----- estado simulado -----
  const [stats, setStats] = useState({
    alunosAtivos: 18,
    planosCriados: 42,
    avaliacaoMedia: 4.8,      // média de 0-5
    metasMes: {               // metas do mês para barras de progresso
      alunos: { atual: 18, alvo: 25 },
      planos: { atual: 42, alvo: 60 },
      aval:   { atual: 4.8, alvo: 5 },
    },
  });

  const [sessoesHoje, setSessoesHoje] = useState<Sessao[]>([
    { id: "1", aluno: "Mariana Silva", horario: "07:30", tipo: "Funcional",  local: "Academia Dr. Fit" },
    { id: "2", aluno: "Lucas Souza",   horario: "09:00", tipo: "Hipertrofia", local: "Online" },
    { id: "3", aluno: "Ana Paula",     horario: "14:00", tipo: "Mobilidade",  local: "Academia Dr. Fit" },
  ]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // simula fetch
    setTimeout(() => {
      // exemplo: incrementa números só pra ver mudança
      setStats((s) => ({
        ...s,
        alunosAtivos: s.alunosAtivos + 1,
        planosCriados: s.planosCriados + 2,
        avaliacaoMedia: Math.min(5, Number((s.avaliacaoMedia + 0.1).toFixed(1))),
        metasMes: {
          alunos: { ...s.metasMes.alunos, atual: s.metasMes.alunos.atual + 1 },
          planos: { ...s.metasMes.planos, atual: s.metasMes.planos.atual + 2 },
          aval:   { ...s.metasMes.aval,   atual: Math.min(5, Number((s.metasMes.aval.atual + 0.05).toFixed(2))) },
        },
      }));
      // mantém mesmas sessões
      setRefreshing(false);
    }, 900);
  }, []);

  // ----- helpers -----
  const pct = (atual: number, alvo: number) =>
    Math.max(0, Math.min(100, Math.round((atual / Math.max(1, alvo)) * 100)));

  const kpi = useMemo(
    () => ([
      {
        id: "alunos",
        title: "Alunos ativos",
        value: String(stats.alunosAtivos),
        sub: `${pct(stats.metasMes.alunos.atual, stats.metasMes.alunos.alvo)}% da meta`,
        p: pct(stats.metasMes.alunos.atual, stats.metasMes.alunos.alvo),
        hint: `${stats.metasMes.alunos.atual}/${stats.metasMes.alunos.alvo}`,
        emoji: "👥",
      },
      {
        id: "planos",
        title: "Planos criados",
        value: String(stats.planosCriados),
        sub: `${pct(stats.metasMes.planos.atual, stats.metasMes.planos.alvo)}% da meta`,
        p: pct(stats.metasMes.planos.atual, stats.metasMes.planos.alvo),
        hint: `${stats.metasMes.planos.atual}/${stats.metasMes.planos.alvo}`,
        emoji: "📄",
      },
      {
        id: "avaliacoes",
        title: "Avaliações",
        value: stats.avaliacaoMedia.toFixed(1),
        sub: `de 5,0`,
        p: pct(stats.metasMes.aval.atual, stats.metasMes.aval.alvo),
        hint: `${stats.metasMes.aval.atual.toFixed(1)}/${stats.metasMes.aval.alvo}`,
        emoji: "⭐",
      },
    ]),
    [stats]
  );

  // ----- UI components -----
  const Progress = ({ percent }: { percent: number }) => (
    <View className="h-2  w-full  rounded-full bg-white/10 overflow-hidden">
      <View style={{ width: `${percent}%` }} className="h-2 bg-emerald-500 rounded-full" />
    </View>
  );

  const StatCard = ({
    title,
    value,
    sub,
    percent,
    hint,
    emoji,
  }: {
    title: string;
    value: string;
    sub: string;
    percent: number;
    hint: string;
    emoji: string;
  }) => (
    <View className="flex-1 rounded-2xl bg-white/5 border border-white/10 p-4 mr-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-slate-300">{title}</Text>
        <Text className="text-xl">{emoji}</Text>
      </View>
      <Text className="text-white text-2xl font-extrabold mt-1">{value}</Text>
      <Text className="text-slate-400 text-xs mt-1">{sub} — {hint}</Text>
      <View className="mt-3">
        <Progress percent={percent} />
      </View>
    </View>
  );

  const SessaoItem = ({ s }: { s: Sessao }) => (
    <View className="rounded-2xl bg-white/5 border border-white/10 p-4 mb-3">
      <View className="flex-row justify-between">
        <Text className="text-white font-semibold">{s.aluno}</Text>
        <Text className="text-emerald-300 font-semibold">{s.horario}</Text>
      </View>
      <Text className="text-slate-300 mt-1">{s.tipo}</Text>
      <Text className="text-slate-400 text-xs mt-1">{s.local}</Text>
      <View className="flex-row mt-3">
        <Pressable className="px-3 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/30 mr-2 active:bg-emerald-500/30">
          <Text className="text-emerald-300 text-xs font-semibold">Ver plano</Text>
        </Pressable>
        <Pressable className="px-3 py-2 rounded-xl bg-white/10 border border-white/15 active:bg-white/15">
          <Text className="text-white text-xs font-semibold">Iniciar sessão</Text>
        </Pressable>
      </View>
    </View>
  );

  const QuickAction = ({
    label,
    onPress,
    emoji,
  }: {
    label: string;
    onPress: () => void;
    emoji: string;
  }) => (
    <Pressable
      onPress={onPress}
      className="flex-1 h-16 rounded-2xl bg-white/5 border border-white/10 items-center justify-center active:bg-white/10 mr-3"
    >
      <Text className="text-lg">{emoji}</Text>
      <Text className="text-slate-300 text-xs mt-1">{label}</Text>
    </Pressable>
  );

  // ----- render -----
  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Cabeçalho */}
      <View className="px-5 pt-2">
        <Text className="text-white text-2xl font-extrabold">Dashboard</Text>
        <Text className="text-slate-400 mt-1">Resumo das suas métricas e sessões</Text>
      </View>

      <ScrollView
        className="flex-1 mt-4"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#34d399"
            colors={["#34d399"]}
            progressBackgroundColor="#0b1220"
          />
        }
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        {/* KPIs */}
        <View className="flex-row">
          <StatCard
            title={kpi[0].title}
            value={kpi[0].value}
            sub={kpi[0].sub}
            percent={kpi[0].p}
            hint={kpi[0].hint}
            emoji={kpi[0].emoji}
          />
          <StatCard
            title={kpi[1].title}
            value={kpi[1].value}
            sub={kpi[1].sub}
            percent={kpi[1].p}
            hint={kpi[1].hint}
            emoji={kpi[1].emoji}
          />
        </View>
        <View className="flex-row mt-3">
          <StatCard
            title={kpi[2].title}
            value={kpi[2].value}
            sub={kpi[2].sub}
            percent={kpi[2].p}
            hint={kpi[2].hint}
            emoji={kpi[2].emoji}
          />
          <View className="flex-1 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-300/10 border border-emerald-400/20 p-4 ml-3">
            <Text className="text-slate-200 font-semibold">Meta do mês</Text>
            <Text className="text-slate-400 text-xs mt-1">
              Alcance 25 alunos ativos e 60 planos criados.
            </Text>
            <View className="mt-3">
              <Text className="text-slate-300 text-xs mb-1">Alunos</Text>
              <Progress percent={kpi[0].p} />
              <Text className="text-slate-500 text-[10px] mt-1">{kpi[0].hint}</Text>
            </View>
            <View className="mt-3">
              <Text className="text-slate-300 text-xs mb-1">Planos</Text>
              <Progress percent={kpi[1].p} />
              <Text className="text-slate-500 text-[10px] mt-1">{kpi[1].hint}</Text>
            </View>
          </View>
        </View>

        {/* Ações rápidas */}
        <View className="flex-row mt-5">
          <QuickAction emoji="➕" label="Novo plano" onPress={() => {}} />
          <QuickAction emoji="👤" label="Novo aluno" onPress={() => {}} />
          <QuickAction emoji="🗓️" label="Agendar" onPress={() => {}} />
        </View>

        {/* Próximas sessões (Hoje) */}
        <View className="mt-6">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white text-lg font-semibold">Próximas sessões (Hoje)</Text>
            <Pressable className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 active:bg-white/10">
              <Text className="text-slate-300 text-xs font-semibold">Ver agenda</Text>
            </Pressable>
          </View>

          {sessoesHoje.map((s) => (
            <SessaoItem key={s.id} s={s} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
