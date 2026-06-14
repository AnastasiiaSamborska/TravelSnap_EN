import { useQuery } from "@tanstack/react-query";

const POPULAR_DESTINATIONS = [
  "Tokyo",
  "Lisbon",
  "Reykjavik",
  "Bali",
  "Cape Town",
  "Kyoto",
  "Marrakech",
  "Patagonia",
];

async function fetchDestinations(): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(POPULAR_DESTINATIONS);
    }, 500);
  });
}

export function useDestinationsQuery() {
  return useQuery({
    queryKey: ["destinations"],

    queryFn: fetchDestinations,
  });
}
