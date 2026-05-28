import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useEffect, useMemo } from "react";

import { Stack, router, useLocalSearchParams } from "expo-router";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";

import { useTrips } from "@/contexts/TripContext";

import { useImagePicker } from "@/hooks/useImagePicker";

import { tripSchema, type TripFormData } from "@/types/tripSchema";

export default function EditTripScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const { trips, updateTrip } = useTrips();

  const trip = useMemo(
    () => trips.find((t) => t.id === id),

    [trips, id],
  );

  const {
    control,

    handleSubmit,

    reset,

    setValue,

    formState: { isSubmitting },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),

    mode: "onBlur",
  });

  const { handleAddPhoto } = useImagePicker({
    tripId: trip?.id ?? "",

    onSaved: (uri) => {
      setValue("imageUri", uri);

      setValue("galleryUris", [...(trip?.galleryUris ?? []), uri]);
    },

    aspect: [16, 9],
  });

  useEffect(() => {
    if (!trip) {
      return;
    }

    reset({
      title: trip.title,

      destination: trip.destination,

      date: trip.date,

      rating: trip.rating,

      imageUri: trip.imageUri,

      galleryUris: trip.galleryUris,
    });
  }, [trip, reset]);

  const onSubmit = async (data: TripFormData): Promise<void> => {
    if (!trip) {
      return;
    }

    try {
      await updateTrip(trip.id, data);

      router.back();
    } catch (err) {
      Alert.alert(
        "Could not update",

        String(err),
      );
    }
  };

  if (!trip) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Trip not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit Trip",
        }}
      />

      <View style={styles.container}>
        <Text style={styles.title}>Edit trip</Text>

        <Controller
          control={control}
          name="title"
          render={({ field, fieldState }) => (
            <>
              <TextInput
                style={[styles.input, fieldState.error && styles.inputError]}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder="Title"
                placeholderTextColor={Colors.textSecondary}
              />

              {fieldState.error && (
                <Text style={styles.errorText}>{fieldState.error.message}</Text>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="destination"
          render={({ field, fieldState }) => (
            <>
              <TextInput
                style={[styles.input, fieldState.error && styles.inputError]}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder="Destination"
                placeholderTextColor={Colors.textSecondary}
              />

              {fieldState.error && (
                <Text style={styles.errorText}>{fieldState.error.message}</Text>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="date"
          render={({ field, fieldState }) => (
            <>
              <TextInput
                style={[styles.input, fieldState.error && styles.inputError]}
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.textSecondary}
              />

              {fieldState.error && (
                <Text style={styles.errorText}>{fieldState.error.message}</Text>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="rating"
          render={({ field, fieldState }) => (
            <>
              <TextInput
                style={[styles.input, fieldState.error && styles.inputError]}
                value={String(field.value)}
                onChangeText={(text) => field.onChange(Number(text))}
                keyboardType="numeric"
                onBlur={field.onBlur}
                placeholder="Rating"
                placeholderTextColor={Colors.textSecondary}
              />

              {fieldState.error && (
                <Text style={styles.errorText}>{fieldState.error.message}</Text>
              )}
            </>
          )}
        />

        <Controller
          control={control}
          name="imageUri"
          render={({ field }) =>
            field.value ? (
              <View style={styles.previewContainer}>
                <Image
                  source={{
                    uri: field.value,
                  }}
                  style={styles.preview}
                />

                <Pressable
                  style={styles.changePhotoButton}
                  onPress={handleAddPhoto}
                >
                  <Text style={styles.changePhotoText}>Add another photo</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={styles.photoPlaceholder}
                onPress={handleAddPhoto}
              >
                <Ionicons
                  name="camera-outline"
                  size={32}
                  color={Colors.textSecondary}
                />

                <Text style={styles.photoPlaceholderText}>Add a photo</Text>
              </Pressable>
            )
          }
        />

        <Pressable
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
        >
          {isSubmitting ? (
            <ActivityIndicator color={Colors.background} />
          ) : (
            <Text style={styles.buttonText}>Update</Text>
          )}
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: Colors.background,

    padding: 20,
  },

  centered: {
    flex: 1,

    alignItems: "center",

    justifyContent: "center",

    backgroundColor: Colors.background,
  },

  notFound: {
    color: Colors.textSecondary,

    fontSize: 16,
  },

  title: {
    fontSize: 24,

    fontWeight: "bold",

    color: Colors.textPrimary,

    marginBottom: 20,
  },

  input: {
    backgroundColor: Colors.inputBg,

    borderWidth: 1,

    borderColor: Colors.inputBorder,

    borderRadius: 8,

    padding: 12,

    marginBottom: 8,

    color: Colors.textPrimary,

    fontSize: 16,
  },

  inputError: {
    borderColor: Colors.accent,

    borderWidth: 1.5,
  },

  errorText: {
    color: Colors.accent,

    fontSize: 12,

    marginBottom: 8,
  },

  photoPlaceholder: {
    borderWidth: 1.5,

    borderColor: Colors.inputBorder,

    borderStyle: "dashed",

    borderRadius: 8,

    height: 100,

    alignItems: "center",

    justifyContent: "center",

    gap: 8,

    marginBottom: 12,
  },

  photoPlaceholderText: {
    color: Colors.textSecondary,

    fontSize: 14,
  },

  previewContainer: {
    marginBottom: 12,

    gap: 8,
  },

  preview: {
    width: "100%",

    height: 200,

    borderRadius: 8,
  },

  changePhotoButton: {
    alignItems: "center",

    paddingVertical: 8,

    borderRadius: 8,

    backgroundColor: Colors.inputBg,
  },

  changePhotoText: {
    color: Colors.primary,

    fontSize: 14,

    fontWeight: "600",
  },

  button: {
    backgroundColor: Colors.primary,

    paddingVertical: 14,

    borderRadius: 8,

    alignItems: "center",

    marginTop: 16,
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: Colors.background,

    fontWeight: "600",

    fontSize: 16,
  },
});
