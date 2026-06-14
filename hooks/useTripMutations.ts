import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteTrip, saveTrip } from "@/utils/tripStorage";

import type { Trip, TripData } from "@/types/trip";

export function useAddTrip() {
  const queryClient = useQueryClient();

  return useMutation<
    Trip,
    Error,
    TripData,
    {
      previous: Trip[];
    }
  >({
    mutationFn: saveTrip,

    onMutate: async (newTrip) => {
      await queryClient.cancelQueries({
        queryKey: ["trips"],
      });

      const previous = queryClient.getQueryData<Trip[]>(["trips"]) ?? [];

      const optimisticTrip: Trip = {
        ...newTrip,

        id: `optimistic-${Date.now()}`,
      };

      queryClient.setQueryData<Trip[]>(
        ["trips"],

        [optimisticTrip, ...previous],
      );

      return {
        previous,
      };
    },

    onError: (_error, _data, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["trips"],

          context.previous,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["trips"],
      });
    },
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    string,
    {
      previous: Trip[];
    }
  >({
    mutationFn: deleteTrip,

    onMutate: async (tripId) => {
      await queryClient.cancelQueries({
        queryKey: ["trips"],
      });

      const previous = queryClient.getQueryData<Trip[]>(["trips"]) ?? [];

      queryClient.setQueryData<Trip[]>(
        ["trips"],

        previous.filter((trip) => trip.id !== tripId),
      );

      return {
        previous,
      };
    },

    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["trips"],

          context.previous,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["trips"],
      });
    },
  });
}
