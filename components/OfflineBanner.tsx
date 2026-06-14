import { StyleSheet, Text } from "react-native";

import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";

import { useNetworkStatus } from "@/hooks/useNetworkStatus";

import { Colors } from "@/constants/Colors";

export default function OfflineBanner() {
  const { isOnline } = useNetworkStatus();

  if (isOnline) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutUp}
      style={styles.container}
    >
      <Text style={styles.text}>No internet connection</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.accent,

    padding: 12,

    alignItems: "center",
  },

  text: {
    color: "white",

    fontWeight: "bold",
  },
});
