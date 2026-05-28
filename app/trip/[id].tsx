import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Image } from "expo-image";

import { Stack, router, useLocalSearchParams } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";

import { useTrips } from "@/contexts/TripContext";

import RatingStars from "@/components/RatingStars";

import CountryCard from "@/components/CountryCard";

export default function TripDetailsScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const { trips, deleteTrip } = useTrips();

  const trip = trips.find((t) => t.id === id);

  if (!trip) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Trip not found</Text>
      </View>
    );
  }

  const handleDelete = (): void => {
    Alert.alert(
      "Delete trip",

      "Are you sure you want to delete this trip?",

      [
        {
          text: "Cancel",

          style: "cancel",
        },

        {
          text: "Delete",

          style: "destructive",

          onPress: () => {
            deleteTrip(trip.id);

            router.back();
          },
        },
      ],
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: trip.title,
        }}
      />

      <ScrollView style={styles.container}>
        {trip.imageUri && (
          <Image
            source={{
              uri: trip.imageUri,
            }}
            placeholder={{
              blurhash: "LGF5]+Yk^6#M@-5c,1J5@[or[Q6.",
            }}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={300}
            style={styles.heroImage}
          />
        )}

        <View style={styles.content}>
          <Text style={styles.title}>{trip.title}</Text>

          <Text style={styles.destination}>{trip.destination}</Text>

          <Text style={styles.date}>{trip.date}</Text>

          <View style={styles.separator} />

          <RatingStars rating={trip.rating} />

          <CountryCard countryName={trip.destination} />

          {trip.galleryUris && trip.galleryUris.length > 0 && (
            <>
              <Text style={styles.galleryTitle}>Gallery</Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {trip.galleryUris.map((uri, index) => (
                  <Image
                    key={index}
                    source={{
                      uri,
                    }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    transition={200}
                    style={styles.galleryImage}
                  />
                ))}
              </ScrollView>
            </>
          )}

          <Pressable
            style={styles.editButton}
            onPress={() => router.push(`/trip/edit/${trip.id}`)}
          >
            <Ionicons
              name="create-outline"
              size={18}
              color={Colors.background}
            />

            <Text style={styles.buttonText}>Edit Trip</Text>
          </Pressable>

          <Pressable style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons
              name="trash-outline"
              size={18}
              color={Colors.background}
            />

            <Text style={styles.buttonText}>Delete Trip</Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: Colors.background,
  },

  centered: {
    flex: 1,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: Colors.background,
  },

  notFound: {
    color: Colors.textSecondary,

    fontSize: 16,
  },

  heroImage: {
    width: "100%",

    height: 260,
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 28,

    fontWeight: "bold",

    color: Colors.textPrimary,
  },

  destination: {
    fontSize: 18,

    color: Colors.primary,

    marginTop: 8,
  },

  date: {
    fontSize: 14,

    color: Colors.textSecondary,

    marginTop: 6,
  },

  separator: {
    borderBottomWidth: 1,

    borderBottomColor: Colors.border,

    marginVertical: 20,
  },

  galleryTitle: {
    fontSize: 20,

    fontWeight: "bold",

    color: Colors.textPrimary,

    marginTop: 24,

    marginBottom: 12,
  },

  galleryImage: {
    width: 180,

    height: 120,

    borderRadius: 16,

    marginRight: 12,
  },

  editButton: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 8,

    backgroundColor: Colors.primary,

    paddingVertical: 14,

    borderRadius: 10,

    marginTop: 28,
  },

  deleteButton: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 8,

    backgroundColor: Colors.accent,

    paddingVertical: 14,

    borderRadius: 10,

    marginTop: 12,

    marginBottom: 40,
  },

  buttonText: {
    color: Colors.background,

    fontWeight: "bold",

    fontSize: 16,
  },
});
