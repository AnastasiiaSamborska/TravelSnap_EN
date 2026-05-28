import { useEffect, useState } from "react";

import * as Location from "expo-location";

import type { LocationObject } from "expo-location";

interface UseLocationResult {
  location: LocationObject | null;

  error: string | null;

  loading: boolean;
}

export function useLocation(): UseLocationResult {
  const [location, setLocation] = useState<LocationObject | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setError("Location permission denied");

          setLoading(false);

          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setLocation(currentLocation);
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    }

    getLocation();
  }, []);

  return {
    location,

    error,

    loading,
  };
}
