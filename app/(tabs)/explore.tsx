import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import DestinationCard from "@/components/DestinationCard";

import ErrorState from "@/components/ui/ErrorState";

import { Colors } from "@/constants/Colors";

import { useDestinationsQuery } from "@/hooks/useDestinationsQuery";

export default function ExploreScreen() {
  const {
    data = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useDestinationsQuery();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <ErrorState message="Failed to load destinations" onRetry={refetch} />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={data}
        keyExtractor={(city) => city}
        renderItem={({ item }) => <DestinationCard city={item} />}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={Colors.primary}
          />
        }
      />
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

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: Colors.background,
  },

  content: {
    padding: 16,
  },
});
