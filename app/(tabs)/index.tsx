import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useCallback, useMemo } from "react";

import { useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { useTrips } from "@/contexts/TripContext";

import TripCard from "@/components/TripCard";

import ScreenHeader from "@/components/ScreenHeader";

import EmptyState from "@/components/ui/EmptyState";

import TripStats from "@/components/TripStats";

import { Colors } from "@/constants/Colors";

const CARD_HEIGHT = 120;

export default function HomeScreen() {
  const { trips, deleteTrip, loading } = useTrips();

  const router = useRouter();

  const sortedTrips = useMemo(() => {
    return [...trips].sort((a, b) => b.rating - a.rating);
  }, [trips]);

  const handleTripPress = useCallback(
    (id: string) => {
      router.push(`/trip/${id}`);
    },

    [router],
  );

  const handleDeleteTrip = useCallback(
    (id: string) => {
      deleteTrip(id);
    },

    [deleteTrip],
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader tripCount={trips.length} />

      <FlatList
        data={sortedTrips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        style={styles.container}
        ListHeaderComponent={<TripStats trips={sortedTrips} />}
        ListEmptyComponent={
          <EmptyState
            icon="airplane-outline"
            title="No trips yet"
            subtitle="Add your first trip!"
          />
        }
        getItemLayout={(_, index) => ({
          length: CARD_HEIGHT,

          offset: CARD_HEIGHT * index,

          index,
        })}
        initialNumToRender={10}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={Platform.OS === "android"}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleTripPress(item.id)}>
            <TripCard {...item} onDelete={() => handleDeleteTrip(item.id)} />
          </Pressable>
        )}
      />

      <Pressable style={styles.fab} onPress={() => router.push("/add-trip")}>
        <Ionicons name="add" size={28} color={Colors.background} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,

    backgroundColor: Colors.background,
  },

  loadingContainer: {
    flex: 1,

    backgroundColor: Colors.background,

    justifyContent: "center",

    alignItems: "center",
  },

  container: {
    flex: 1,

    backgroundColor: Colors.background,
  },

  content: {
    padding: 16,

    paddingBottom: 96,
  },

  fab: {
    position: "absolute",

    bottom: 24,

    right: 24,

    width: 56,

    height: 56,

    borderRadius: 28,

    backgroundColor: Colors.primary,

    alignItems: "center",

    justifyContent: "center",

    elevation: 6,

    shadowColor: "#000",

    shadowOpacity: 0.3,

    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
});
