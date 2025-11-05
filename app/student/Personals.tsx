// app/student/Personals.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Pressable,
  Modal,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Link, LinkProps, useRouter, Stack } from "expo-router";

// -------------------- Tipos --------------------
type Trainer = {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  pricePerHour: number; // BRL
  lat: number;
  lng: number;
  bio?: string;
};

// -------------------- Mock localização/alvos --------------------
const STUDENT_LOCATION = { lat: -23.561684, lng: -46.625378 };

const TRAINERS: Trainer[] = [
  {
    id: "t1",
    name: "Ana Martins",
    avatar:
      "https://images.unsplash.com/photo-1538688423619-a81d3f23454b?q=80&w=300&auto=format&fit=crop",
    specialty: "Emagrecimento",
    pricePerHour: 120,
    lat: -23.564,
    lng: -46.63,
    bio: "Foco em emagrecimento saudável e reeducação alimentar.",
  },
  {
    id: "t2",
    name: "Carlos Silva",
    avatar:
      "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=300&auto=format&fit=crop",
    specialty: "Hipertrofia",
    pricePerHour: 150,
    lat: -23.57,
    lng: -46.62,
    bio: "Protocolos para ganho de massa com segurança e constância.",
  },
  {
    id: "t3",
    name: "Bruna Lopes",
    avatar:
      "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=300&auto=format&fit=crop",
    specialty: "Funcional",
    pricePerHour: 100,
    lat: -23.55,
    lng: -46.61,
    bio: "Treinos funcionais e mobilidade para o dia a dia.",
  },
  {
    id: "t4",
    name: "Diego Rocha",
    avatar:
      "https://images.unsplash.com/photo-1599050751795-5cda2e934cd1?q=80&w=300&auto=format&fit=crop",
    specialty: "Reabilitação",
    pricePerHour: 130,
    lat: -23.565,
    lng: -46.64,
    bio: "Reabilitação pós-lesão e fortalecimento específico.",
  },
];

// -------------------- Utils --------------------
const RADIUS_KM = 6371;
const toRad = (v: number) => (v * Math.PI) / 180;
function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const la1 = toRad(a.lat);
  const la2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.asin(Math.sqrt(h));
  return RADIUS_KM * c;
}
const money = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

// -------------------- UI helpers --------------------
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <View className="px-2 py-1 rounded-lg bg-white/5 border border-white/10">
      <Text className="text-slate-300 text-[11px]">{children}</Text>
    </View>
  );
}

function InfoRow({
  icon,
  text,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  text: string;
}) {
  return (
    <View className="flex-row items-center mt-1">
      <Feather name={icon} size={14} color="#94a3b8" />
      <Text className="text-slate-300 text-[12px] ml-1">{text}</Text>
    </View>
  );
}

function PaywallModal({
  visible,
  onClose,
  checkoutHref = "/(student)/Checkout",
}: {
  visible: boolean;
  onClose: () => void;
  checkoutHref?: LinkProps["href"];
}) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />
      <View className="absolute left-3 right-3 bottom-6 rounded-2xl bg-slate-900 border border-white/10 p-4">
        <View className="flex-row items-center">
          <Feather name="lock" size={18} color="#facc15" />
          <Text className="text-white text-base font-semibold ml-2">Pagamento necessário</Text>
        </View>
        <Text className="text-slate-300 text-[13px] mt-2">
          Para agendar uma aula e conversar com o professor, finalize o pagamento via Stripe.
        </Text>

        <View className="flex-row justify-end gap-2 mt-3">
          <Pressable
            onPress={onClose}
            className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 items-center justify-center"
          >
            <Text className="text-slate-300 text-[12px]">Agora não</Text>
          </Pressable>

          <Link href={checkoutHref} asChild>
            <Pressable className="h-10 px-4 rounded-xl bg-emerald-500 items-center justify-center">
              <Text className="text-white text-[12px] font-semibold">Pagar e liberar</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </Modal>
  );
}

function TrainerCard({
  item,
  km,
  canBook,
  onPressBook,
  onPressView,
}: {
  item: Trainer;
  km: number;
  canBook: boolean;
  onPressBook: () => void;
  onPressView: () => void;
}) {
  return (
    <View className="rounded-2xl bg-white/5 border border-white/10 p-3 mb-3">
      <View className="flex-row">
        <Image
          source={{ uri: item.avatar }}
          className="h-16 w-16 rounded-xl bg-slate-700"
          resizeMode="cover"
        />
        <View className="flex-1 ml-3">
          <Text className="text-white font-semibold" numberOfLines={1}>
            {item.name}
          </Text>
          <Badge>{item.specialty}</Badge>
          <InfoRow icon="map-pin" text={`${km.toFixed(1)} km de você`} />
          <InfoRow icon="dollar-sign" text={`${money(item.pricePerHour)}/h`} />
        </View>
      </View>

      {item.bio ? (
        <Text className="text-slate-400 text-[12px] mt-2" numberOfLines={2}>
          {item.bio}
        </Text>
      ) : null}

      <View className="flex-row justify-end gap-2 mt-3">
        <Pressable
          onPress={onPressView}
          className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 items-center justify-center"
        >
          <Text className="text-slate-300 text-[12px]">Ver perfil</Text>
        </Pressable>

        <Pressable
          onPress={onPressBook}
          disabled={!canBook}
          className={`h-10 px-4 rounded-xl items-center justify-center ${
            canBook ? "bg-emerald-500" : "bg-white/5 border border-white/10"
          }`}
        >
          <View className="flex-row items-center">
            {!canBook && <Feather name="lock" size={14} color="#94a3b8" />}
            <Text
              className={`ml-1 text-[12px] font-semibold ${
                canBook ? "text-white" : "text-slate-300"
              }`}
            >
              {canBook ? "Agendar aula" : "Agendar (bloqueado)"}
            </Text>
          </View>
        </Pressable>
      </View>

      {!canBook && (
        <Text className="text-slate-500 text-[11px] mt-2">
          Mensagens e agendamentos só ficam disponíveis após o pagamento.
        </Text>
      )}
    </View>
  );
}

// -------------------- Tela principal --------------------
export default function PersonalsScreen() {
  const { width } = useWindowDimensions();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const [hasPayment, setHasPayment] = useState(false); // mock
  const [showPaywall, setShowPaywall] = useState(false);

  const specialties = useMemo(
    () => Array.from(new Set(TRAINERS.map((t) => t.specialty))),
    []
  );

  const withDistance = useMemo(
    () =>
      TRAINERS.map((t) => ({
        ...t,
        km: distanceKm(STUDENT_LOCATION, { lat: t.lat, lng: t.lng }),
      })).sort((a, b) => a.km - b.km),
    []
  );

  const filtered = useMemo(() => {
    return withDistance.filter((t) => {
      const byQuery =
        !query ||
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.specialty.toLowerCase().includes(query.toLowerCase());
      const bySpec = !specialty || t.specialty === specialty;
      const byPrice = maxPrice == null || t.pricePerHour <= maxPrice;
      return byQuery && bySpec && byPrice;
    });
  }, [withDistance, query, specialty, maxPrice]);

  const handleBook = (trainer: Trainer) => {
    if (!hasPayment) {
      setShowPaywall(true);
      return;
    }
    router.push({ pathname: "/(student)/Schedule", params: { trainerId: trainer.id } });
  };

  const openProfile = (trainer: Trainer) => {
    router.push({ pathname: "/(student)/TrainerProfile", params: { trainerId: trainer.id } });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      {/* ✅ esconde o header do Stack para evitar barra e espaço no topo */}
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Header (compacto) */}
      <View style={{ width }} className="px-4 pt-2 pb-2 border-b border-white/10">
        <Text className="text-white text-xl font-extrabold">Personals na sua região</Text>
        <Text className="text-slate-400 text-[12px] mt-0.5">
          Encontre um professor perto de você e agende aulas (após pagamento).
        </Text>
      </View>

      {/* Filtros */}
      <View style={{ width }} className="px-3 pt-2">
        <View className="flex-row items-center gap-2">
          <View className="flex-1 flex-row items-center h-10 rounded-xl border border-white/10 px-3 bg-white/5">
            <Feather name="search" size={16} color="#94a3b8" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Buscar por nome ou especialidade"
              placeholderTextColor="#94a3b8"
              className="flex-1 ml-2 text-white text-[13px]"
            />
          </View>

          {/* botão mock para simular pagamento */}
          <Pressable
            onPress={() => setHasPayment((v) => !v)}
            className={`h-10 px-3 rounded-xl items-center justify-center ${
              hasPayment ? "bg-emerald-600" : "bg-white/5 border border-white/10"
            }`}
          >
            <Text
              className={`text-[12px] font-semibold ${
                hasPayment ? "text-white" : "text-slate-300"
              }`}
            >
              {hasPayment ? "Pago ✔" : "Sem pagamento"}
            </Text>
          </Pressable>
        </View>

        <View className="flex-row mt-2">
          <Pressable
            className={`px-3 h-9 rounded-xl items-center justify-center mr-2 ${
              specialty === null ? "bg-emerald-500" : "bg-white/5 border border-white/10"
            }`}
            onPress={() => setSpecialty(null)}
          >
            <Text className={`text-[12px] ${specialty === null ? "text-white" : "text-slate-300"}`}>
              Todas
            </Text>
          </Pressable>
          {specialties.map((s) => (
            <Pressable
              key={s}
              className={`px-3 h-9 rounded-xl items-center justify-center mr-2 ${
                specialty === s ? "bg-emerald-500" : "bg-white/5 border border-white/10"
              }`}
              onPress={() => setSpecialty(s)}
            >
              <Text className={`text-[12px] ${specialty === s ? "text-white" : "text-slate-300"}`}>
                {s}
              </Text>
            </Pressable>
          ))}

          <Pressable
            onPress={() => setMaxPrice(null)}
            className={`px-3 h-9 rounded-xl items-center justify-center ml-auto ${
              maxPrice == null ? "bg-emerald-500" : "bg-white/5 border border-white/10"
            }`}
          >
            <Text className={`text-[12px] ${maxPrice == null ? "text-white" : "text-slate-300"}`}>
              Preço: Todos
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMaxPrice(120)}
            className={`px-3 h-9 rounded-xl items-center justify-center ml-2 ${
              maxPrice === 120 ? "bg-emerald-500" : "bg-white/5 border border-white/10"
            }`}
          >
            <Text className={`text-[12px] ${maxPrice === 120 ? "text-white" : "text-slate-300"}`}>
              Até {money(120)}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMaxPrice(150)}
            className={`px-3 h-9 rounded-xl items-center justify-center ml-2 ${
              maxPrice === 150 ? "bg-emerald-500" : "bg-white/5 border border-white/10"
            }`}
          >
            <Text className={`text-[12px] ${maxPrice === 150 ? "text-white" : "text-slate-300"}`}>
              Até {money(150)}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Lista (ocupando o restante da tela) */}
      <View className="flex-1" style={{ width }}>
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View className="px-3">
              <TrainerCard
                item={item}
                km={(item as any).km as number}
                canBook={hasPayment}
                onPressBook={() => handleBook(item)}
                onPressView={() => openProfile(item)}
              />
            </View>
          )}
          ListEmptyComponent={
            <View className="items-center py-12">
              <Text className="text-slate-400 text-[13px]">
                Nenhum personal encontrado com estes filtros.
              </Text>
            </View>
          }
          // padding da lista (sem sobrar espaço branco)
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Paywall */}
      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        checkoutHref="/(student)/Checkout"
      />
    </SafeAreaView>
  );
}
