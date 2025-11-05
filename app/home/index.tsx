// app/home/index.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StatusBar,
  useWindowDimensions,
  Modal,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, LinkProps, useRouter, usePathname, Stack } from "expo-router";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FeatherName = React.ComponentProps<typeof Feather>["name"];
type Role = "student" | "trainer" | "admin";

/* ----------------- Cartão métrico (2x2 responsivo) ----------------- */
function StatCard({
  icon,
  label,
  value,
}: {
  icon: FeatherName;
  label: string;
  value: string | number;
}) {
  return (
    <View className="w-1/2 p-1">
      <View className="h-24 rounded-2xl bg-white/5 px-3 py-3 overflow-hidden">
        <View className="h-full justify-between">
          <View className="flex-row items-center">
            <Feather name={icon} size={16} color="#6ee7b7" />
            <Text
              className="text-slate-300 text-[12px] ml-2"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {label}
            </Text>
          </View>
          <Text className="text-white text-2xl font-extrabold">{value}</Text>
        </View>
      </View>
    </View>
  );
}

/* ----------------- Itens de lista ----------------- */
function AgendaItem({
  title,
  when,
  place,
}: {
  title: string;
  when: string;
  place?: string;
}) {
  return (
    <View className="rounded-2xl bg-white/5 px-3 py-2 mb-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-white font-medium">{title}</Text>
        <View className="flex-row items-center">
          <Feather name="clock" size={14} color="#94a3b8" />
          <Text className="text-slate-300 text-[12px] ml-1">{when}</Text>
        </View>
      </View>
      {place ? (
        <View className="flex-row items-center mt-1">
          <Feather name="map-pin" size={14} color="#94a3b8" />
          <Text className="text-slate-400 text-[12px] ml-1">{place}</Text>
        </View>
      ) : null}
    </View>
  );
}

function PendingItem({ icon, text }: { icon: FeatherName; text: string }) {
  return (
    <View className="rounded-2xl bg-white/5 px-3 py-2 mb-2 flex-row items-center">
      <Feather name={icon} size={14} color="#fbbf24" />
      <Text className="text-slate-200 ml-2">{text}</Text>
    </View>
  );
}

/* ----------------- Bottom Nav ----------------- */
function BottomNav() {
  const pathname = usePathname();

  const Item = ({
    href,
    icon,
    label,
  }: {
    href: LinkProps["href"];
    icon: FeatherName;
    label: string;
  }) => {
    const hrefPath =
      typeof href === "string" ? href : (href.pathname as string | undefined) || "";
    const active = pathname.startsWith(hrefPath);

    return (
      <Link href={href} asChild>
        <Pressable className="items-center px-4 py-1">
          <Feather name={icon} size={18} color={active ? "#a3e635" : "#cbd5e1"} />
          <Text className={`text-[11px] mt-1 ${active ? "text-emerald-400" : "text-slate-300"}`}>
            {label}
          </Text>
        </Pressable>
      </Link>
    );
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-slate-900/95">
      <View className="flex-row items-center justify-around py-2">
        <Item href="/Dashboard" icon="layout" label="Dashboard" />
        <Item href="/Students" icon="users" label="Alunos" />
        <Item href="/Training" icon="calendar" label="Treinos" />
        <Item href="/student/Personals" icon="map-pin" label="Personals" />
      </View>
    </View>
  );
}

/* ----------------- Header ----------------- */
function Header({
  width,
  onOpenMenu,
}: {
  width: number;
  onOpenMenu: () => void;
}) {
  return (
    <View style={{ width }} className="px-4 pt-4 pb-3 flex-row items-center">
      <View className="flex-1">
        <Text className="text-white text-3xl font-extrabold">Home</Text>
        <Text className="text-slate-400 text-[12px] mt-1">
          Veja seus números, próximos agendamentos e pendências.
        </Text>
      </View>

      <Pressable
        onPress={onOpenMenu}
        className="h-11 w-11 rounded-2xl bg-white/5 items-center justify-center active:bg-white/10"
        accessibilityLabel="Abrir menu"
        accessibilityRole="button"
      >
        <Feather name="menu" size={20} color="#e2e8f0" />
      </Pressable>
    </View>
  );
}

/* ----------------- Sandwich Menu (maior + divisória) ----------------- */
function SandwichMenu({
  visible,
  onClose,
  onLogout,
}: {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}) {
  const Item = ({
    href,
    icon,
    label,
  }: {
    href: LinkProps["href"];
    icon: FeatherName;
    label: string;
  }) => (
    <Link href={href} asChild>
      <Pressable className="flex-row items-center px-4 py-3.5 active:bg-white/5">
        <Feather name={icon} size={18} color="#cbd5e1" />
        <Text className="text-white ml-3 text-[15px]">{label}</Text>
      </Pressable>
    </Link>
  );

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />
      <View className="absolute right-3 top-14 w-72 rounded-3xl bg-slate-900 shadow-lg">
        <Text className="text-slate-400 text-[12px] px-4 pt-4 pb-2">Navegação</Text>

        <Item href="/Dashboard" icon="layout" label="Dashboard" />
        <Item href="/Students" icon="users" label="Alunos" />
        <Item href="/Training" icon="calendar" label="Treinos" />
        <Item href="/StudentsTabs" icon="columns" label="Aluno (Abas)" />
        <Item href="/StudentsTabs" icon="grid" label="Lista (Abas)" />
        <Item href="/Trainer-wizard" icon="briefcase" label="Onboarding" />
        <Item href="/student/Personals" icon="map-pin" label="Personals perto" />

        {/* divisória entre Personals e Perfil */}
        <View className="h-[1px] bg-white/10 mx-4 my-2" />

        <Item href="./Profile" icon="user" label="Perfil" />
        <Item href="./Plans" icon="star" label="Planos" />
        <Item href="./Settings" icon="settings" label="Configurações" />

        <Pressable onPress={onLogout} className="flex-row items-center px-4 py-3.5 active:bg-white/5">
          <Feather name="log-out" size={18} color="#fda4af" />
          <Text className="text-rose-300 ml-3 text-[15px]">Sair</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

/* ----------------- Home ----------------- */
export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // Oculta o header do expo-router apenas nesta tela
  const HeaderHider = <Stack.Screen options={{ headerShown: false }} />;

  const [role, setRole] = useState<Role>("trainer");

  useEffect(() => {
    (async () => {
      const r = (await AsyncStorage.getItem("role")) as Role | null;
      if (r) setRole(r);
    })();
  }, []);

  // métricas mock por papel
  const trainerMetrics = useMemo(
    () => [
      { icon: "users" as const, label: "Alunos ativos", value: 18 },
      { icon: "activity" as const, label: "Treinos hoje", value: 3 },
      { icon: "clipboard" as const, label: "Avaliações pendentes", value: 2 },
      { icon: "file-text" as const, label: "Fichas pendentes", value: 5 },
    ],
    []
  );

  const studentMetrics = useMemo(
    () => [
      { icon: "activity" as const, label: "Meus treinos hoje", value: 1 },
      { icon: "calendar" as const, label: "Próximas aulas", value: 2 },
      { icon: "clipboard" as const, label: "Avaliações marcadas", value: 1 },
      { icon: "file-text" as const, label: "Fichas liberadas", value: 4 },
    ],
    []
  );

  const adminMetrics = useMemo(
    () => [
      { icon: "users" as const, label: "Usuários ativos", value: 257 },
      { icon: "briefcase" as const, label: "Personals ativos", value: 41 },
      { icon: "activity" as const, label: "Treinos do dia", value: 129 },
      { icon: "clipboard" as const, label: "Avaliações do dia", value: 23 },
    ],
    []
  );

  const metrics = useMemo(() => {
    switch (role) {
      case "student":
        return studentMetrics;
      case "admin":
        return adminMetrics;
      default:
        return trainerMetrics;
    }
  }, [role, adminMetrics, studentMetrics, trainerMetrics]);

  // próximos agendamentos (mock)
  const agenda = useMemo(
    () => [
      { id: "a1", title: "Treino — João P.", when: "Hoje • 19:00", place: "Academia FitZone" },
      { id: "a2", title: "Avaliação — Ana S.", when: "Amanhã • 09:30", place: "Studio Center" },
      { id: "a3", title: "Treino — Carla M.", when: "Sex • 07:00", place: "Parque Ibirapuera" },
    ],
    []
  );

  // pendências (mock)
  const pendencias = useMemo(
    () => [
      { id: "p1", icon: "file-text" as const, text: "3 fichas de treino para revisar" },
      { id: "p2", icon: "clipboard" as const, text: "2 avaliações físicas pendentes" },
      { id: "p3", icon: "upload" as const, text: "1 anexo aguardando aprovação" },
    ],
    []
  );

  const onLogout = async () => {
    await AsyncStorage.removeItem("token");
    setMenuOpen(false);
    router.replace("/Login");
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      {HeaderHider}
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Header próprio */}
      <Header width={width} onOpenMenu={() => setMenuOpen(true)} />

      {/* Conteúdo (mais centralizado: paddingTop maior) */}
      <ScrollView
        style={{ width }}
        className="px-3"
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 110 }}
      >
        {/* Resumo de hoje (sempre 4 cards -> 2x2) */}
        <View className="mb-2">
          <Text className="text-slate-300 text-[12px]">
            Resumo de hoje {role === "student" ? "(Aluno)" : role === "trainer" ? "(Personal)" : "(Admin)"}
          </Text>
        </View>

        <View className="flex-row flex-wrap -m-1">
          {metrics.slice(0, 4).map((m, i) => (
            <StatCard key={`${m.label}-${i}`} icon={m.icon} label={m.label} value={m.value} />
          ))}
        </View>

        {/* Próximos agendamentos */}
        <View className="mt-6">
          <Text className="text-slate-300 text-[12px] mb-2">Próximos agendamentos</Text>
          {agenda.map((a) => (
            <AgendaItem key={a.id} title={a.title} when={a.when} place={a.place} />
          ))}
          {agenda.length === 0 && (
            <Text className="text-slate-400 text-[12px]">Nenhum agendamento futuro.</Text>
          )}
        </View>

        {/* Pendências */}
        <View className="mt-6">
          <Text className="text-slate-300 text-[12px] mb-2">Pendências</Text>
          {pendencias.map((p) => (
            <PendingItem key={p.id} icon={p.icon} text={p.text} />
          ))}
          {pendencias.length === 0 && (
            <Text className="text-slate-400 text-[12px]">Você está em dia. 🎉</Text>
          )}
        </View>

        {/* Dica */}
        <View className="mt-6 rounded-2xl bg-emerald-500/10 p-3">
          <Text className="text-emerald-200 font-semibold">Dica</Text>
          <Text className="text-slate-200 text-[12px] mt-1">
            Use modelos de ficha para criar treinos mais rápido para novos alunos.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom nav + Menu sanduíche */}
      <BottomNav />
      <SandwichMenu visible={menuOpen} onClose={() => setMenuOpen(false)} onLogout={onLogout} />
    </SafeAreaView>
  );
}
