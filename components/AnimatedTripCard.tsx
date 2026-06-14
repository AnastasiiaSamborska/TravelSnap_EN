import { Gesture, GestureDetector } from "react-native-gesture-handler";

import Animated, {
  FadeInDown,
  FadeOutLeft,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import TripCard from "./TripCard";

import type { Trip } from "@/types/trip";

interface AnimatedTripCardProps {
  trip: Trip;

  index: number;

  onDelete: (id: string) => void;
}

export default function AnimatedTripCard({
  trip,
  index,
  onDelete,
}: AnimatedTripCardProps) {
  const scale = useSharedValue(1);

  const translateX = useSharedValue(0);

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      scale.value = withSpring(0.96);
    })

    .onFinalize(() => {
      scale.value = withSpring(1);
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = event.translationX;
      }
    })

    .onEnd(() => {
      if (translateX.value < -100) {
        translateX.value = withTiming(
          -500,
          {
            duration: 300,
          },
          () => {
            runOnJS(onDelete)(trip.id);
          },
        );
      } else {
        translateX.value = withSpring(0);
      }
    });

  const gesture = Gesture.Simultaneous(tapGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },

      {
        scale: scale.value,
      },
    ],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).springify()}
      exiting={FadeOutLeft.springify()}
    >
      <GestureDetector gesture={gesture}>
        <Animated.View style={animatedStyle}>
          <TripCard {...trip} />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}
