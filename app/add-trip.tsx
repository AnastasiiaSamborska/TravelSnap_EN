import { useRouter } from "expo-router";

import { ScrollView, StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import AddTripForm from "@/components/AddTripForm";

import { Colors } from "@/constants/Colors";

import { useAddTrip } from "@/hooks/useTripMutations";

import type { TripData } from "@/types/trip";

export default function AddTripScreen() {
  const router = useRouter();

  const { mutate: addTrip } = useAddTrip();

  const handleAdd = (data: TripData): void => {
    addTrip(data);

    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <AddTripForm onAdd={handleAdd} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,

    backgroundColor: Colors.background,
  },

  content: {
    padding: 16,
  },
});
