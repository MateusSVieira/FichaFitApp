import React, { useMemo, useState } from "react";
import { Platform, KeyboardAvoidingView, View, Text, TextInput, Pressable, ScrollView, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Trainer Signup Wizard — Expo + NativeWind (no extra deps)
 * Drop this file into: app/(onboarding)/trainer-wizard.tsx (expo-router) or any screen.
 * Tailwind (NativeWind) classes are used via `className` prop.
 */

type AtendTipo = "presencial" | "online" | "hibrido";

const ESPECIALIDADES = [
  "Emagrecimento",
  "Hipertrofia",
  "Funcional",
  "Cross Training",
  "Mobilidade",
  "Reabilitação",
  "Gestantes",
  "3ª Idade",
  "Atletas",
] as const;

const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"] as const;

export default function TrainerWizard() {
  const { width } = useWindowDimensions();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

  const cardWidth = useMemo(() => {
    // padrão de largura igual a outras telas: full + padding lateral
    return "w-full m-3 px-4";
  }, [width]);

  // --- form state (minimal, no external libs) ---
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [anosExp, setAnosExp] = useState<string>("");
  const [atendimento, setAtendimento] = useState<AtendTipo | null>(null);
  const [dias, setDias] = useState<string[]>([]);
  const [horaIni, setHoraIni] = useState("06:00");
  const [horaFim, setHoraFim] = useState("22:00");
  const [precoHora, setPrecoHora] = useState<string>("");
  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const steps = [
    "Perfil",
    "Especialidades",
    "Experiência",
    "Agenda",
    "Preço & Bio",
    "Redes",
    "Revisão",
  ];

  // --- helpers ---
  const toggleFromArray = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const validateStep = (s: number): string | null => {
    switch (s) {
      case 0:
        if (!nome.trim()) return "Informe seu nome.";
        if (!cidade.trim()) return "Informe sua cidade.";
        return null;
      case 1:
        if (especialidades.length === 0) return "Selecione ao menos 1 especialidade.";
        return null;
      case 2:
        if (!anosExp || isNaN(Number(anosExp))) return "Informe os anos de experiência (número).";
        if (!atendimento) return "Selecione o tipo de atendimento.";
        return null;
      case 3:
        if (dias.length === 0) return "Selecione pelo menos 1 dia de atendimento.";
        if (!horaIni || !horaFim) return "Informe horário inicial e final.";
        return null;
      case 4:
        if (!precoHora || isNaN(Number(precoHora))) return "Informe o preço/hora (número).";
        if (bio.trim().length < 20) return "Escreva uma bio com pelo menos 20 caracteres.";
        return null;
      case 5:
        if (!instagram && !whatsapp) return "Informe ao menos uma rede de contato.";
        return null;
      default:
        return null;
    }
  };

  const next = () => {
    const err = validateStep(step);
    setErrors(err);
    if (!err) setStep((p) => Math.min(p + 1, steps.length - 1));
  };
  const back = () => setStep((p) => Math.max(p - 1, 0));

  const handleSubmit = async () => {
    const err = validateStep(5);
    setErrors(err);
    if (err) return;
    setSubmitting(true);
    try {
      // Simule o envio — troque por sua chamada de API
      await new Promise((r) => setTimeout(r, 800));
      // Aqui você teria algo como: await api.post('/trainers', payload)
      alert("Cadastro enviado! ✅");
      setStep(0);
    } catch (e) {
      alert("Falha ao enviar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const progressPct = ((step + 1) / steps.length) * 100;

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.select({ ios: "padding", android: undefined })}
      >
        <View className="flex-1">
      {/* Header */}
      <View className={`mt-8 ${cardWidth}`}>
        <Text className="text-white text-2xl font-semibold">Cadastro do Personal</Text>
        <Text className="text-white/70 mt-1">Complete os passos para criar seu perfil profissional</Text>

        {/* Progress */}
        <View className="h-2 bg-white/10 rounded-full mt-4 overflow-hidden">
          <View style={{ width: `${progressPct}%` }} className="h-full bg-emerald-400" />
        </View>
        <Text className="text-white/60 mt-1">Etapa {step + 1} de {steps.length} — {steps[step]}</Text>
      </View>

      {/* Card */}
      <View className={`mt-8 rounded-3xl bg-white/5 border border-white/10 p-5 ${cardWidth} shadow-lg shadow-black/30`}>        
        {!!errors && (
          <View className="mb-3 rounded-xl bg-red-500/10 border border-red-500/40 p-3">
            <Text className="text-red-400 text-sm">{errors}</Text>
          </View>
        )}

        <ScrollView className="max-h-[70%]" contentContainerStyle={{ paddingBottom: 20 }}>
          {step === 0 && (
            <View>
              <Field label="Nome completo">
                <Input value={nome} onChangeText={setNome} placeholder="Seu nome" />
              </Field>
              <Field label="Cidade / UF">
                <Input value={cidade} onChangeText={setCidade} placeholder="Ex.: São Paulo - SP" />
              </Field>
              <Hint>Essas informações ajudam alunos a encontrar você na região.</Hint>
            </View>
          )}

          {step === 1 && (
            <View>
              <Text className="text-white text-base font-medium mb-2">Selecione suas especialidades</Text>
              <View className="flex-row flex-wrap gap-2">
                {ESPECIALIDADES.map((esp) => {
                  const active = especialidades.includes(esp);
                  return (
                    <Pressable
                      key={esp}
                      onPress={() => setEspecialidades((arr) => toggleFromArray(arr, esp))}
                      className={`px-3 py-2 rounded-full border ${
                        active ? "bg-emerald-500/20 border-emerald-400" : "bg-white/5 border-white/15"
                      }`}
                    >
                      <Text className={active ? "text-emerald-300" : "text-white/80"}>{esp}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <Hint className="mt-3">Toque para selecionar/deselecionar. Você pode escolher várias.</Hint>
            </View>
          )}

          {step === 2 && (
            <View>
              <Field label="Anos de experiência">
                <Input
                  value={anosExp}
                  onChangeText={(t: string) => setAnosExp(t.replace(/[^0-9]/g, ""))}
                  keyboardType="numeric"
                  placeholder="Ex.: 5"
                />
              </Field>
              <Text className="text-white text-base font-medium mb-2">Tipo de atendimento</Text>
              <View className="flex-row gap-2 mb-1">
                {(["presencial", "online", "hibrido"] as AtendTipo[]).map((t) => (
                  <RadioChip key={t} active={atendimento === t} onPress={() => setAtendimento(t)} label={t} />
                ))}
              </View>
              <Hint>Você pode alterar depois nas configurações.</Hint>
            </View>
          )}

          {step === 3 && (
            <View>
              <Text className="text-white text-base font-medium mb-2">Dias disponíveis</Text>
              <View className="flex-row flex-wrap gap-2 mb-3">
                {DIAS.map((d) => (
                  <Pressable
                    key={d}
                    onPress={() => setDias((arr) => toggleFromArray(arr, d))}
                    className={`px-3 py-2 rounded-full border ${
                      dias.includes(d) ? "bg-emerald-500/20 border-emerald-400" : "bg-white/5 border-white/15"
                    }`}
                  >
                    <Text className={dias.includes(d) ? "text-emerald-300" : "text-white/80"}>{d}</Text>
                  </Pressable>
                ))}
              </View>
              <View className="flex-row gap-3">
                <Field label="Hora início" className="flex-1">
                  <Input value={horaIni} onChangeText={setHoraIni} placeholder="06:00" />
                </Field>
                <Field label="Hora fim" className="flex-1">
                  <Input value={horaFim} onChangeText={setHoraFim} placeholder="22:00" />
                </Field>
              </View>
              <Hint className="mt-2">Formato 24h (HH:MM). Ex.: 07:30 — 21:00.</Hint>
            </View>
          )}

          {step === 4 && (
            <View>
              <Field label="Preço / hora (R$)">
                <Input
                  value={precoHora}
                  onChangeText={(t: string) => {
                    const clean = t.replace(/[^0-9.,]/g, "");
                    setPrecoHora(clean);
                  }}
                  keyboardType="decimal-pad"
                  placeholder="Ex.: 120"
                />
              </Field>
              <Field label="Bio">
                <Input multiline value={bio} onChangeText={setBio} placeholder="Conte sua história e método de trabalho" />
              </Field>
              <Hint>Dica: destaque resultados de alunos e metodologias que você domina.</Hint>
            </View>
          )}

          {step === 5 && (
            <View>
              <Field label="Instagram (opcional)">
                <Input value={instagram} onChangeText={setInstagram} placeholder="@seuuser" />
              </Field>
              <Field label="WhatsApp (opcional)">
                <Input value={whatsapp} onChangeText={setWhatsapp} placeholder="DDD + número" keyboardType="phone-pad" />
              </Field>
              <Hint>Nós mostraremos ícones de contato no seu perfil.</Hint>
            </View>
          )}

          {step === 6 && (
            <View>
              <Text className="text-white text-lg font-medium mb-2">Revise seus dados</Text>
              <SummaryRow label="Nome" value={nome} />
              <SummaryRow label="Cidade" value={cidade} />
              <SummaryRow label="Especialidades" value={especialidades.join(", ") || "-"} />
              <SummaryRow label="Experiência" value={`${anosExp || 0} anos`} />
              <SummaryRow label="Atendimento" value={atendimento || "-"} />
              <SummaryRow label="Dias" value={dias.join(", ") || "-"} />
              <SummaryRow label="Horário" value={`${horaIni} - ${horaFim}`} />
              <SummaryRow label="Preço/h" value={`R$ ${precoHora || 0}`} />
              <SummaryRow label="Bio" value={bio || "-"} />
              <SummaryRow label="Instagram" value={instagram || "-"} />
              <SummaryRow label="WhatsApp" value={whatsapp || "-"} />
              <Hint className="mt-2">Se algo estiver errado, volte e ajuste antes de enviar.</Hint>
            </View>
          )}
        </ScrollView>

        {/* Footer buttons */}
        <View className="mt-4 flex-row items-center justify-between">
          <Pressable onPress={back} disabled={step === 0 || submitting} className="px-4 py-3 rounded-xl border border-white/15 bg-white/5 disabled:opacity-40">
            <Text className="text-white">Voltar</Text>
          </Pressable>

          {step < steps.length - 1 ? (
            <Pressable onPress={next} disabled={submitting} className="px-4 py-3 rounded-xl bg-emerald-500/90">
              <Text className="text-white font-medium">Continuar</Text>
            </Pressable>
          ) : (
            <Pressable onPress={handleSubmit} disabled={submitting} className="px-4 py-3 rounded-xl bg-emerald-500">
              <Text className="text-white font-medium">Enviar cadastro</Text>
            </Pressable>
          )}
        </View>
        {Platform.OS === "ios" && <View className="h-2" />}
      </View>
            </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ---------- UI helpers ----------
function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <View className={`mb-3 ${className}`}>
      <Text className="text-white/90 mb-1">{label}</Text>
      {children}
    </View>
  );
}

function Input({ className = "", multiline = false, ...props }: any) {
  return (
    <TextInput
      {...props}
      multiline={multiline}
      textAlignVertical={multiline ? "top" : "auto"}
      placeholderTextColor="#9ca3af"
      className={`px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white ${multiline ? "min-h-[96px]" : ""} ${className}`}
    />
  );
}

function RadioChip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} className={`px-3 py-2 rounded-full border ${active ? "bg-emerald-500/20 border-emerald-400" : "bg-white/5 border-white/15"}`}>
      <Text className={active ? "text-emerald-300" : "text-white/80"}>{label}</Text>
    </Pressable>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between items-start py-2 border-b border-white/10">
      <Text className="text-white/70 w-1/3">{label}</Text>
      <Text className="text-white flex-1 text-right">{value}</Text>
    </View>
  );
}

function Hint({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <Text className={`text-white/60 text-xs ${className}`}>{children}</Text>;
}
