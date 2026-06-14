import { Ionicons } from "@expo/vector-icons";

import { Pressable, StyleSheet } from "react-native";

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Colors } from "@/constants/Colors";

interface AnimatedFABProps {
  onPress: () => void;
}

export default function AnimatedFAB({ onPress }: AnimatedFABProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scale.value,
      },
    ],
  }));

  const pressIn = () => {
    scale.value = withSpring(0.85);
  };

  const pressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
        <Ionicons name="add" size={32} color="white" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",

    right: 24,

    bottom: 24,

    width: 60,

    height: 60,

    borderRadius: 30,

    backgroundColor: Colors.primary,

    justifyContent: "center",

    alignItems: "center",

    elevation: 6,
  },
});
