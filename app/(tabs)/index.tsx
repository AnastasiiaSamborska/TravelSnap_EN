import { ActivityIndicator, Platform, StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { useCallback, useMemo } from "react";

import { useRouter } from "expo-router";

import Animated, { LinearTransition } from "react-native-reanimated";

import { useTrips } from "@/contexts/TripContext";

import AnimatedTripCard from "@/components/AnimatedTripCard";

import ScreenHeader from "@/components/ScreenHeader";

import EmptyState from "@/components/ui/EmptyState";

import TripStats from "@/components/TripStats";

import AnimatedFAB from "@/components/AnimatedFAB";

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

      <Animated.FlatList
        data={sortedTrips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        style={styles.container}
        itemLayoutAnimation={LinearTransition.springify()}
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
        renderItem={({ item, index }) => (
          <AnimatedTripCard
            trip={item}
            index={index}
            onDelete={handleDeleteTrip}
          />
        )}
      />

      <AnimatedFAB onPress={() => router.push("/add-trip")} />
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
});
