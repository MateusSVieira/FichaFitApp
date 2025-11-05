// app/(teacher)/Treinos.tsx
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  FlatList,
  Modal,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

// -------------------- Tipos --------------------
export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: string; // "12" | "12-10-8" | etc.
  notes?: string;
};

export type Workout = {
  id: string;
  dateISO: string; // YYYY-MM-DD
  title: string;
  exercises: Exercise[];
};

// -------------------- Datas --------------------
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const toISO = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const startOfWeek = (d: Date) => {
  const dow = d.getDay(); // 0-dom..6-sáb
  const diff = (dow + 6) % 7; // segunda=0
  return addDays(d, -diff);
};
const formatDayShort = (d: Date) =>
  d.toLocaleDateString(undefined, { weekday: "short" }).replace(".", "");
const formatHeader = (d: Date) =>
  d.toLocaleDateString(undefined, { day: "2-digit", month: "long" });

// -------------------- Tema --------------------
const inputBase =
  "h-10 rounded-xl bg-white/5 border border-white/10 px-3 text-white placeholder:text-slate-400 text-[13px]";

// -------------------- UI --------------------
function DayChip({
  date,
  selected,
  onPress,
}: {
  date: Date;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`items-center px-3 py-2 rounded-xl border mr-2 ${
        selected ? "bg-emerald-500/15 border-emerald-400/30" : "bg-white/5 border-white/10"
      }`}
    >
      <Text allowFontScaling={false} className={`text-[11px] ${selected ? "text-emerald-200" : "text-slate-300"}`}>
        {formatDayShort(date)}
      </Text>
      <Text allowFontScaling={false} className={`text-[13px] font-semibold ${selected ? "text-white" : "text-slate-200"}`}>
        {String(date.getDate()).padStart(2, "0")}
      </Text>
    </Pressable>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <View className="items-center py-10">
      <Text allowFontScaling={false} className="text-slate-400 text-[13px]">{text}</Text>
    </View>
  );
}

// -------------------- Editor de Exercício --------------------
function ExerciseEditor({
  visible,
  onClose,
  initial,
  onSave,
}: {
  visible: boolean;
  initial?: Partial<Exercise>;
  onClose: () => void;
  onSave: (e: Exercise) => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [sets, setSets] = useState(String(initial?.sets ?? 3));
  const [reps, setReps] = useState(initial?.reps ?? "12");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  React.useEffect(() => {
    setName(initial?.name ?? "");
    setSets(String(initial?.sets ?? 3));
    setReps(initial?.reps ?? "12");
    setNotes(initial?.notes ?? "");
  }, [initial, visible]);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 items-center justify-end">
        <View className="w-full bg-slate-900 rounded-t-2xl p-4 border-t border-white/10">
          <Text className="text-white text-base font-semibold">Exercício</Text>
          <View className="mt-3">
            <TextInput
              className={inputBase}
              placeholder="Nome do exercício"
              placeholderTextColor="#94a3b8"
              value={name}
              onChangeText={setName}
            />
            <View className="flex-row gap-2 mt-2">
              <TextInput className={`flex-1 ${inputBase}`} keyboardType="numeric" placeholder="Séries" value={sets} onChangeText={setSets} />
              <TextInput className={`flex-1 ${inputBase}`} placeholder="Repetições (ex: 12-10-8)" value={reps} onChangeText={setReps} />
            </View>
            <TextInput
              className={`mt-2 ${inputBase} min-h-[80px]`}
              placeholder="Notas"
              value={notes}
              onChangeText={setNotes}
              multiline
              textAlignVertical="top"
            />
          </View>
          <View className="flex-row justify-end gap-2 mt-3">
            <Pressable onPress={onClose} className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 items-center justify-center">
              <Text className="text-slate-300 text-[12px]">Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                const e: Exercise = {
                  id: initial?.id ?? Math.random().toString(36).slice(2),
                  name: name.trim() || "Sem nome",
                  sets: parseInt(sets || "0") || 0,
                  reps: reps.trim() || "-",
                  notes: notes.trim() || undefined,
                };
                onSave(e);
                onClose();
              }}
              className="h-10 px-4 rounded-xl bg-emerald-500 items-center justify-center"
            >
              <Text className="text-white text-[12px] font-semibold">Salvar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// -------------------- Editor de Treino --------------------
function WorkoutEditor({
  visible,
  onClose,
  initial,
  onSave,
}: {
  visible: boolean;
  initial?: Partial<Workout> & { dateISO: string };
  onClose: () => void;
  onSave: (w: Workout) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "Treino");
  const [exercises, setExercises] = useState<Exercise[]>(initial?.exercises ?? []);
  const [editingExercise, setEditingExercise] = useState<Exercise | undefined>();
  const [exerciseEditorOpen, setExerciseEditorOpen] = useState(false);

  React.useEffect(() => {
    setTitle(initial?.title ?? "Treino");
    setExercises(initial?.exercises ?? []);
  }, [initial, visible]);

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 items-center justify-end">
        <View className="w-full bg-slate-900 rounded-t-2xl p-4 border-t border-white/10 max-h-[85%]">
          <Text className="text-white text-base font-semibold">
            {initial?.id ? "Editar treino" : "Novo treino"}
          </Text>
          <Text className="text-slate-400 text-[12px]">{initial?.dateISO}</Text>

          <TextInput
            className={`mt-3 ${inputBase}`}
            placeholder="Título do treino"
            placeholderTextColor="#94a3b8"
            value={title}
            onChangeText={setTitle}
          />

          <View className="mt-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-slate-300 text-[12px]">Exercícios</Text>
              <Pressable
                onPress={() => {
                  setEditingExercise(undefined);
                  setExerciseEditorOpen(true);
                }}
                className="h-9 px-3 rounded-lg bg-emerald-500 items-center justify-center"
              >
                <Text className="text-white text-[12px] font-semibold">Adicionar</Text>
              </Pressable>
            </View>

            <FlatList
              className="mt-2"
              data={exercises}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <View className="flex-row items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 mb-2">
                  <View className="flex-1 pr-2">
                    <Text className="text-white text-[13px] font-medium" numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text className="text-slate-400 text-[11px]" numberOfLines={2}>
                      {item.sets} séries • {item.reps}
                      {item.notes ? ` • ${item.notes}` : ""}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Pressable
                      onPress={() => {
                        setEditingExercise(item);
                        setExerciseEditorOpen(true);
                      }}
                      className="h-8 w-8 rounded-lg items-center justify-center bg-white/5 border border-white/10"
                    >
                      <Feather name="edit-2" size={14} color="#94a3b8" />
                    </Pressable>
                    <Pressable
                      onPress={() => setExercises((arr) => arr.filter((e) => e.id !== item.id))}
                      className="h-8 w-8 rounded-lg items-center justify-center bg-white/5 border border-white/10"
                    >
                      <Feather name="trash-2" size={14} color="#fda4af" />
                    </Pressable>
                  </View>
                </View>
              )}
              ListEmptyComponent={<EmptyState text="Nenhum exercício adicionado" />}
            />
          </View>

          <View className="flex-row justify-end gap-2 mt-2">
            <Pressable onPress={onClose} className="h-10 px-3 rounded-xl bg-white/5 border border-white/10 items-center justify-center">
              <Text className="text-slate-300 text-[12px]">Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                const w: Workout = {
                  id: initial?.id ?? Math.random().toString(36).slice(2),
                  dateISO: initial!.dateISO,
                  title: title.trim() || "Treino",
                  exercises,
                };
                onSave(w);
                onClose();
              }}
              className="h-10 px-4 rounded-xl bg-emerald-500 items-center justify-center"
            >
              <Text className="text-white text-[12px] font-semibold">Salvar treino</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Editor de exercício */}
      <ExerciseEditor
        visible={exerciseEditorOpen}
        onClose={() => setExerciseEditorOpen(false)}
        initial={editingExercise}
        onSave={(ex) => {
          setExercises((arr) => {
            const exists = arr.find((e) => e.id === ex.id);
            return exists ? arr.map((e) => (e.id === ex.id ? ex : e)) : [...arr, ex];
          });
        }}
      />
    </Modal>
  );
}

// -------------------- Tela principal --------------------
export default function TreinosScreen() {
  const [selected, setSelected] = useState(startOfDay(new Date()));
  const [items, setItems] = useState<Workout[]>(() => {
    const iso = toISO(new Date());
    return [
      {
        id: "w1",
        dateISO: iso,
        title: "Treino A — Peito/Tríceps",
        exercises: [
          { id: "e1", name: "Supino reto", sets: 4, reps: "12-10-8-8" },
          { id: "e2", name: "Crucifixo", sets: 3, reps: "12" },
        ],
      },
    ];
  });
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Workout | undefined>(undefined);
  const { width } = useWindowDimensions(); // LARGURA REAL DA TELA

  const weekStart = startOfWeek(selected);
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const workoutsForSelected = items.filter((w) => w.dateISO === toISO(selected));

  const openNew = () => { setEditing(undefined); setEditorOpen(true); };
  const onSaveWorkout = (w: Workout) =>
    setItems((arr) => (arr.find((i) => i.id === w.id) ? arr.map((i) => (i.id === w.id ? w : i)) : [...arr, w]));
  const onDeleteWorkout = (id: string) => setItems((arr) => arr.filter((w) => w.id !== id));

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Header — largura total */}
      <View className="border-b border-white/10 pt-2 pb-3" style={{ width }}>
        <View className="px-3">
          <Text className="text-white text-xl font-extrabold">Treinos</Text>
          <Text className="text-slate-400 text-[12px] mt-0.5">
            Monte treinos por dia/semana, séries e repetições.
          </Text>
        </View>

        {/* Navegação da semana */}
        <View className="mt-3 px-3 flex-row items-center justify-between">
          <Pressable onPress={() => setSelected(addDays(selected, -7))} className="h-9 w-9 rounded-lg items-center justify-center bg-white/5 border border-white/10">
            <Feather name="chevron-left" size={18} color="#94a3b8" />
          </Pressable>
          <Text className="text-slate-300 text-[13px] font-medium">
            Semana de {formatHeader(weekStart)}
          </Text>
          <Pressable onPress={() => setSelected(addDays(selected, 7))} className="h-9 w-9 rounded-lg items-center justify-center bg-white/5 border border-white/10">
            <Feather name="chevron-right" size={18} color="#94a3b8" />
          </Pressable>
        </View>

        {/* Dias da semana */}
        <View className="mt-2 px-3 flex-row">
          {weekDays.map((d) => (
            <DayChip key={d.toISOString()} date={d} selected={toISO(d) === toISO(selected)} onPress={() => setSelected(d)} />
          ))}
        </View>
      </View>

      {/* Conteúdo — largura total */}
      <View style={{ width }} className="px-3 py-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-[15px] font-semibold">{formatHeader(selected)}</Text>
          <Pressable onPress={openNew} className="h-10 px-3 rounded-xl bg-emerald-500 items-center justify-center">
            <Text className="text-white text-[12px] font-semibold">Novo treino</Text>
          </Pressable>
        </View>

        <FlatList
          className="mt-2"
          data={workoutsForSelected}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <View className="rounded-2xl border border-white/10 bg-white/5 p-3 mb-2">
              <View className="flex-row items-center justify-between">
                <Text className="text-white text-[14px] font-semibold" numberOfLines={1}>{item.title}</Text>
                <View className="flex-row gap-2">
                  <Pressable onPress={() => { setEditing(item); setEditorOpen(true); }} className="h-9 w-9 rounded-lg items-center justify-center bg-white/5 border border-white/10">
                    <Feather name="edit-2" size={16} color="#94a3b8" />
                  </Pressable>
                  <Pressable onPress={() => onDeleteWorkout(item.id)} className="h-9 w-9 rounded-lg items-center justify-center bg-white/5 border border-white/10">
                    <Feather name="trash-2" size={16} color="#fda4af" />
                  </Pressable>
                </View>
              </View>

              {item.exercises.map((e) => (
                <View key={e.id} className="mt-2 p-2 rounded-xl bg-white/5 border border-white/10">
                  <Text className="text-white text-[13px] font-medium">{e.name}</Text>
                  <Text className="text-slate-400 text-[11px] mt-1">
                    {e.sets} séries • {e.reps}{e.notes ? ` • ${e.notes}` : ""}
                  </Text>
                </View>
              ))}
            </View>
          )}
          ListEmptyComponent={<EmptyState text="Nenhum treino para este dia" />}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </View>

      {/* Editor de treino */}
      <WorkoutEditor
        visible={editorOpen}
        onClose={() => setEditorOpen(false)}
        initial={{
          id: editing?.id,
          dateISO: toISO(selected),
          title: editing?.title,
          exercises: editing?.exercises,
        }}
        onSave={onSaveWorkout}
      />
    </SafeAreaView>
  );
}
