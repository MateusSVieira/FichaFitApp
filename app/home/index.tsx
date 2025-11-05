import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StatusBar,
  useWindowDimensions,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, LinkProps, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FeatherName = React.ComponentProps<typeof Feather>["name"];

// ----------------- Botões reutilizáveis -----------------
function NavButton({
  icon,
  label,
  href,
}: {
  icon: FeatherName;
  label: string;
  href: LinkProps["href"];
}) {
  return (
    <Link href={href} asChild>
      <Pressable className="flex-1 min-h-24 rounded-2xl bg-white/5 border border-white/10 active:bg-white/10 items-center justify-center m-1">
        <Feather name={icon} size={20} color="#a3e635" />
        <Text className="text-white mt-2 text-[12px] font-medium">{label}</Text>
      </Pressable>
    </Link>
  );
}

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
    <View className="flex-1 min-h-20 rounded-2xl bg-white/5 border border-white/10 items-start justify-center px-3 m-1">
      <View className="flex-row items-center">
        <Feather name={icon} size={16} color="#6ee7b7" />
        <Text className="text-slate-300 text-[12px] ml-2">{label}</Text>
      </View>
      <Text className="text-white text-lg font-extrabold mt-1">{value}</Text>
    </View>
  );
}

// ----------------- Menu Inferior fixo -----------------
function BottomNav() {
  return (
    <View className="absolute bottom-0 left-0 right-0 bg-slate-900/95 border-t border-white/10">
      <View className="flex-row items-center justify-around py-2">
        <Link href="/Dashboard" asChild>
          <Pressable className="items-center px-4 py-1">
            <Feather name="layout" size={18} color="#cbd5e1" />
            <Text className="text-slate-300 text-[11px] mt-1">Dashboard</Text>
          </Pressable>
        </Link>

        <Link href="/Students" asChild>
          <Pressable className="items-center px-4 py-1">
            <Feather name="users" size={18} color="#cbd5e1" />
            <Text className="text-slate-300 text-[11px] mt-1">Alunos</Text>
          </Pressable>
        </Link>

        <Link href="/Training" asChild>
          <Pressable className="items-center px-4 py-1">
            <Feather name="calendar" size={18} color="#cbd5e1" />
            <Text className="text-slate-300 text-[11px] mt-1">Treinos</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

// ----------------- Header com menu sanduíche -----------------
function Header({
  width,
  onOpenMenu,
}: {
  width: number;
  onOpenMenu: () => void;
}) {
  return (
    <View style={{ width }} className="px-4 pt-2 pb-3 border-b border-white/10 flex-row items-center">
      <View className="flex-1">
        <Text className="text-white text-2xl font-extrabold">Home</Text>
        <Text className="text-slate-400 text-[12px] mt-0.5">
          Acesse rapidamente as áreas do app.
        </Text>
      </View>

      <Pressable
        onPress={onOpenMenu}
        className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 items-center justify-center active:bg-white/10"
        accessibilityLabel="Abrir menu"
        accessibilityRole="button"
      >
        <Feather name="menu" size={18} color="#e2e8f0" />
      </Pressable>
    </View>
  );
}

// ----------------- Modal de menu sanduíche -----------------
function SandwichMenu({
  visible,
  onClose,
  onLogout,
}: {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40" onPress={onClose}>
        {/* vazio para capturar o toque fora */}
      </Pressable>

      <View className="absolute right-3 top-14 w-56 rounded-2xl bg-slate-900 border border-white/10 shadow-lg">
        <Link href="/Profile" asChild>
          <Pressable className="flex-row items-center px-3 py-3 active:bg-white/5">
            <Feather name="user" size={16} color="#94a3b8" />
            <Text className="text-white ml-2">Perfil</Text>
          </Pressable>
        </Link>

        <Link href="/Plans" asChild>
          <Pressable className="flex-row items-center px-3 py-3 active:bg-white/5">
            <Feather name="star" size={16} color="#94a3b8" />
            <Text className="text-white ml-2">Planos</Text>
          </Pressable>
        </Link>

        <Link href="/Settings" asChild>
          <Pressable className="flex-row items-center px-3 py-3 active:bg-white/5">
            <Feather name="settings" size={16} color="#94a3b8" />
            <Text className="text-white ml-2">Configurações</Text>
          </Pressable>
        </Link>

        <Pressable
          onPress={onLogout}
          className="flex-row items-center px-3 py-3 active:bg-white/5 border-t border-white/10"
        >
          <Feather name="log-out" size={16} color="#fda4af" />
          <Text className="text-rose-300 ml-2">Sair</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

// ----------------- Home -----------------
export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // mocks simples — substitua por dados reais depois
  const stats = useMemo(
    () => ({
      alunosAtivos: 18,
      treinosHoje: 3,
      avaliacoesPend: 2,
    }),
    []
  );

  const onLogout = async () => {
    await AsyncStorage.removeItem("token");
    setMenuOpen(false);
    router.replace("/Login");
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Header */}
      <Header width={width} onOpenMenu={() => setMenuOpen(true)} />

      {/* Conteúdo principal (padding inferior para não colidir com o bottom nav) */}
      <View style={{ width }} className="px-3 py-3 pb-20">
        {/* Resumo do dia */}
        <View className="mb-2">
          <Text className="text-slate-300 text-[12px]">Resumo de hoje</Text>
        </View>

        <View className="flex-row">
          <StatCard icon="users" label="Alunos ativos" value={stats.alunosAtivos} />
          <StatCard icon="activity" label="Treinos hoje" value={stats.treinosHoje} />
        </View>
        <View className="flex-row">
          <StatCard icon="clipboard" label="Avaliações pendentes" value={stats.avaliacoesPend} />
          <View className="flex-1 m-1" />
        </View>

        {/* Atalhos (grid) */}
        <View className="mt-3">
          <Text className="text-slate-300 text-[12px] mb-2">Acesso rápido</Text>

          <View className="flex-row">
            <NavButton icon="layout" label="Dashboard" href="/Dashboard" />
            <NavButton icon="users" label="Alunos" href="/Students" />
          </View>

          <View className="flex-row">
            <NavButton icon="calendar" label="Treinos" href="/Training" />
            <NavButton icon="columns" label="Aluno (Abas)" href="/StudentsTabs" />
          </View>

          <View className="flex-row">
            <NavButton icon="grid" label="Lista (Abas)" href="/StudentsTabs" />
            <NavButton icon="briefcase" label="Onboarding" href="/Trainer-wizard" />
          </View>
        </View>

        {/* Ajuda / dicas (mock) */}
        <View className="mt-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 p-3">
          <Text className="text-emerald-200 font-semibold">Dica</Text>
          <Text className="text-slate-200 text-[12px] mt-1">
            Você pode duplicar treinos da semana passada para ganhar tempo.
          </Text>
        </View>
      </View>

      {/* Menu inferior fixo */}
      <BottomNav />

      {/* Menu sanduíche */}
      <SandwichMenu
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onLogout={onLogout}
      />
    </SafeAreaView>
  );
}
