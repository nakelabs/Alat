import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Bubble {
  x: Animated.Value;
  y: Animated.Value;
  size: number;
  opacity: number;
  color: string;
  speed: number;
}

export function BackgroundBubbles() {
  const bubbles = useRef<Bubble[]>([]);

  // Initialize bubbles
  useEffect(() => {
    const colors = ['#FF6B9D', '#6B5B95', '#8B0038', '#9966CC', '#FF4B6E', '#7B68EE'];
    
    bubbles.current = Array.from({ length: 6 }, (_, index) => ({
      x: new Animated.Value(Math.random() * (SCREEN_WIDTH - 100)),
      y: new Animated.Value(Math.random() * (SCREEN_HEIGHT - 200)),
      size: 40 + Math.random() * 40, // Size between 40-80
      opacity: 0.15 + Math.random() * 0.15, // Opacity between 0.15-0.3 (more visible)
      color: colors[index],
      speed: 8000 + Math.random() * 7000, // Speed between 8-15 seconds (faster)
    }));

    // Start animations for each bubble
    bubbles.current.forEach((bubble, index) => {
      const animateBubble = () => {
        const newX = Math.random() * (SCREEN_WIDTH - bubble.size);
        const newY = Math.random() * (SCREEN_HEIGHT - bubble.size - 100);

        Animated.parallel([
          Animated.timing(bubble.x, {
            toValue: newX,
            duration: bubble.speed,
            useNativeDriver: true,
          }),
          Animated.timing(bubble.y, {
            toValue: newY,
            duration: bubble.speed,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Loop the animation
          animateBubble();
        });
      };

      // Start immediately with different positions for each bubble
      setTimeout(() => {
        animateBubble();
      }, index * 500); // Shorter delay between bubbles
    });
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {bubbles.current.map((bubble, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bubble,
            {
              width: bubble.size,
              height: bubble.size,
              borderRadius: bubble.size / 2,
              backgroundColor: bubble.color,
              opacity: bubble.opacity,
              transform: [
                { translateX: bubble.x },
                { translateY: bubble.y },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    pointerEvents: 'none',
  },
  bubble: {
    position: 'absolute',
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});