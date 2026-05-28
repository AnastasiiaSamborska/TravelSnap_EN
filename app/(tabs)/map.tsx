import {
    ActivityIndicator,
    Linking,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import MapView, { Callout, Marker } from "react-native-maps";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import { Colors } from "@/constants/Colors";

import { useLocation } from "@/hooks/useLocation";

import { useTrips } from "@/contexts/TripContext";

export default function MapScreen() {
  const { location, error, loading } = useLocation();

  const { trips } = useTrips();

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>

        <Pressable style={styles.button} onPress={() => Linking.openSettings()}>
          <Text style={styles.buttonText}>Open settings</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location?.coords.latitude ?? 52.2297,

          longitude: location?.coords.longitude ?? 21.0122,

          latitudeDelta: 8,

          longitudeDelta: 8,
        }}
      >
        {trips.map((trip) => {
          if (!trip.coordinates) {
            return null;
          }

          return (
            <Marker
              key={trip.id}
              coordinate={{
                latitude: trip.coordinates.latitude,

                longitude: trip.coordinates.longitude,
              }}
            >
              <Callout onPress={() => router.push(`/trip/${trip.id}`)}>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{trip.title}</Text>

                  <Text>{trip.destination}</Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  centered: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: Colors.background,

    padding: 20,
  },

  errorText: {
    color: Colors.textPrimary,

    fontSize: 16,

    textAlign: "center",

    marginBottom: 16,
  },

  button: {
    backgroundColor: Colors.primary,

    paddingHorizontal: 20,

    paddingVertical: 12,

    borderRadius: 10,
  },

  buttonText: {
    color: Colors.background,

    fontWeight: "bold",
  },

  callout: {
    width: 160,
  },

  calloutTitle: {
    fontWeight: "bold",

    marginBottom: 4,
  },
});
