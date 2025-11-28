import { View, StyleSheet, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

export function MessageLoading() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(Animated.stagger(100, [dot1, dot2, dot3]), {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(Animated.stagger(100, [dot1, dot2, dot3]), {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createAnimation(0).start();
  }, []);

  const getDotStyle = (animValue: Animated.Value) => ({
    opacity: animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 1],
    }),
    transform: [
      {
        scale: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1.2],
        }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.dot,
          getDotStyle(dot1),
          { backgroundColor: '#FF6B9D', shadowColor: '#FF6B9D', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 6 },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          getDotStyle(dot2),
          { backgroundColor: '#6B5B95', shadowColor: '#6B5B95', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.35, shadowRadius: 6 },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          getDotStyle(dot3),
          { backgroundColor: '#8B0038', shadowColor: '#8B0038', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.45, shadowRadius: 6 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B0038',
  },
});
