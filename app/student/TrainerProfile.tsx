import React from "react";
import { View, Text, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

export default function TrainerProfileScreen() {
  const { trainerId } = useLocalSearchParams<{ trainerId?: string }>();

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <View className="p-4">
        <Text className="text-white text-xl font-extrabold">Perfil do Personal</Text>
        <Text className="text-slate-300 mt-2">ID: {trainerId}</Text>
        {/* renderize bio completa, avaliações, fotos, etc. */}
      </View>
    </SafeAreaView>
  );
}
