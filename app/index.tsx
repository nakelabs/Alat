import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const [showSubtext, setShowSubtext] = useState(false);
  const fadeInTitle = useRef(new Animated.Value(0)).current;
  const slideInTitle = useRef(new Animated.Value(30)).current;
  const fadeInSubtext = useRef(new Animated.Value(0)).current;
  const slideInSubtext = useRef(new Animated.Value(20)).current;
  
  // Bubble animations
  const bubble1X = useRef(new Animated.Value(0)).current;
  const bubble1Y = useRef(new Animated.Value(0)).current;
  const bubble2X = useRef(new Animated.Value(0)).current;
  const bubble2Y = useRef(new Animated.Value(0)).current;
  const bubble3X = useRef(new Animated.Value(0)).current;
  const bubble3Y = useRef(new Animated.Value(0)).current;
  const bubble4X = useRef(new Animated.Value(0)).current;
  const bubble4Y = useRef(new Animated.Value(0)).current;
  const bubble5X = useRef(new Animated.Value(0)).current;
  const bubble5Y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in and slide up title
    Animated.parallel([
      Animated.timing(fadeInTitle, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideInTitle, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Show subtext and animate it after delay
    const timer = setTimeout(() => {
      setShowSubtext(true);
      Animated.parallel([
        Animated.timing(fadeInSubtext, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideInSubtext, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2500);

    // Bubble 1 animation - floats up and right
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(bubble1X, {
            toValue: 40,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(bubble1Y, {
            toValue: -100,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(bubble1X, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(bubble1Y, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    // Bubble 2 animation - floats down and left
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(bubble2X, {
            toValue: -50,
            duration: 5000,
            useNativeDriver: true,
          }),
          Animated.timing(bubble2Y, {
            toValue: 80,
            duration: 5000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(bubble2X, {
            toValue: 0,
            duration: 5000,
            useNativeDriver: true,
          }),
          Animated.timing(bubble2Y, {
            toValue: 0,
            duration: 5000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    // Bubble 3 animation - floats up and left
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(bubble3X, {
            toValue: -60,
            duration: 6000,
            useNativeDriver: true,
          }),
          Animated.timing(bubble3Y, {
            toValue: -120,
            duration: 6000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(bubble3X, {
            toValue: 0,
            duration: 6000,
            useNativeDriver: true,
          }),
          Animated.timing(bubble3Y, {
            toValue: 0,
            duration: 6000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    // Bubble 4 animation - top left, moves down and right
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(bubble4X, {
            toValue: 70,
            duration: 4500,
            useNativeDriver: true,
          }),
          Animated.timing(bubble4Y, {
            toValue: 90,
            duration: 4500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(bubble4X, {
            toValue: 0,
            duration: 4500,
            useNativeDriver: true,
          }),
          Animated.timing(bubble4Y, {
            toValue: 0,
            duration: 4500,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    // Bubble 5 animation - top left, moves right and up
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(bubble5X, {
            toValue: 60,
            duration: 5500,
            useNativeDriver: true,
          }),
          Animated.timing(bubble5Y, {
            toValue: -100,
            duration: 5500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(bubble5X, {
            toValue: 0,
            duration: 5500,
            useNativeDriver: true,
          }),
          Animated.timing(bubble5Y, {
            toValue: 0,
            duration: 5500,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    return () => clearTimeout(timer);
  }, [fadeInTitle, slideInTitle, fadeInSubtext, slideInSubtext, bubble1X, bubble1Y, bubble2X, bubble2Y, bubble3X, bubble3Y, bubble4X, bubble4Y, bubble5X, bubble5Y]);

  return (
    <View style={styles.container}>
      {/* Modern Background */}
      <View style={styles.backgroundContainer}>
        <View style={[styles.gradientBlob, styles.blob1]} />
        <View style={[styles.gradientBlob, styles.blob2]} />
        <View style={[styles.gradientBlob, styles.blob3]} />
      </View>

      {/* Animated Floating Bubbles */}
      <Animated.View style={[
        styles.floatingBubble,
        styles.bubble,
        { transform: [{ translateX: bubble1X }, { translateY: bubble1Y }] }
      ]} />
      <Animated.View style={[
        styles.floatingBubble,
        styles.bubble2,
        { transform: [{ translateX: bubble2X }, { translateY: bubble2Y }] }
      ]} />
      <Animated.View style={[
        styles.floatingBubble,
        styles.bubble3,
        { transform: [{ translateX: bubble3X }, { translateY: bubble3Y }] }
      ]} />
      <Animated.View style={[
        styles.floatingBubble,
        styles.bubble4,
        { transform: [{ translateX: bubble4X }, { translateY: bubble4Y }] }
      ]} />
      <Animated.View style={[
        styles.floatingBubble,
        styles.bubble5,
        { transform: [{ translateX: bubble5X }, { translateY: bubble5Y }] }
      ]} />

      {/* Status Bar Indicators */}
      <View style={styles.statusBarContainer}>
        <View style={[styles.statusIndicator, styles.inactive]} />
        <View style={[styles.statusIndicator, styles.inactive]} />
        <View style={[styles.statusIndicator, styles.active]} />
        <View style={[styles.statusIndicator, styles.inactive]} />
      </View>

      {/* Top Icons */}
      <View style={styles.topIconsContainer}>
        <Image 
          source={require('../assets/icon.png')}
          style={styles.logoIcon}
          resizeMode="contain"
        />
        <Text style={styles.licensedText}>Licensed by CBN</Text>
      </View>

      {/* Hero Text */}
      <Animated.View style={[
        styles.heroContainer, 
        { 
          opacity: fadeInTitle,
          transform: [{ translateY: slideInTitle }]
        }
      ]}>
        <Text style={styles.heroTitle}>Send and receive money without stress</Text>
        {showSubtext && (
          <Animated.Text style={[
            styles.heroSubtext, 
            { 
              opacity: fadeInSubtext,
              transform: [{ translateY: slideInSubtext }]
            }
          ]}>Easy AI transfers instant alerts and seamless AI integration</Animated.Text>
        )}
      </Animated.View>

      {/* Version Text */}
      <Text style={styles.versionText}>v 5.0.0.0</Text>

      {/* Buttons Container */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={styles.getStartedButton} 
          onPress={() => router.push('/login')}
        >
          <Text style={styles.getStartedButtonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={() => router.push('/login')}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Chat Button */}
      <TouchableOpacity 
        style={styles.floatingChatButton}
        onPress={() => router.push('/chatbot')}
      >
        <Text style={styles.chatButtonIcon}>💬</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4ff',
    paddingTop: 12,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  gradientBlob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.15,
  },
  blob1: {
    width: 300,
    height: 300,
    backgroundColor: '#8B0038',
    top: -100,
    right: -50,
  },
  blob2: {
    width: 250,
    height: 250,
    backgroundColor: '#FF6B9D',
    bottom: 100,
    left: -30,
  },
  blob3: {
    width: 200,
    height: 200,
    backgroundColor: '#6B5B95',
    bottom: 50,
    right: 20,
  },
  floatingBubble: {
    position: 'absolute',
    borderRadius: 999,
    zIndex: 5,
  },
  bubble: {
    width: 80,
    height: 80,
    backgroundColor: '#FF6B9D',
    opacity: 0.2,
    top: '10%',
    right: '10%',
  },
  bubble2: {
    width: 60,
    height: 60,
    backgroundColor: '#8B0038',
    opacity: 0.15,
    bottom: '30%',
    left: '5%',
  },
  bubble3: {
    width: 100,
    height: 100,
    backgroundColor: '#6B5B95',
    opacity: 0.1,
    top: '50%',
    right: '5%',
  },
  bubble4: {
    width: 70,
    height: 70,
    backgroundColor: '#FF6B9D',
    opacity: 0.18,
    top: '5%',
    left: '8%',
  },
  bubble5: {
    width: 50,
    height: 50,
    backgroundColor: '#8B0038',
    opacity: 0.12,
    top: '12%',
    left: '18%',
  },
  statusBarContainer: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: 12,
    zIndex: 10,
  },
  statusIndicator: {
    height: 5,
    borderRadius: 3,
    flex: 1,
  },
  inactive: {
    backgroundColor: '#e0e0e0',
  },
  active: {
    backgroundColor: '#999999',
  },
  topIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    zIndex: 10,
  },
  logoIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  licensedText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  heroContainer: {
    marginBottom: 16,
    zIndex: 10,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    lineHeight: 34,
    fontFamily: 'System',
    letterSpacing: -0.5,
  },
  heroSubtext: {
    fontSize: 15,
    fontWeight: '500',
    color: '#888',
    lineHeight: 22,
    marginTop: 10,
    fontFamily: 'System',
    letterSpacing: 0.2,
  },
  imagePreviewContainer: {
    flex: 1,
    backgroundColor: '#fafafa',
    borderWidth: 1.5,
    borderColor: '#333',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    maxHeight: 200,
    zIndex: 10,
  },
  imagePreview: {
    width: '85%',
    height: '85%',
  },
  versionText: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
    zIndex: 10,
  },
  buttonsContainer: {
    gap: 12,
    marginBottom: 20,
    zIndex: 10,
  },
  getStartedButton: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  loginButton: {
    backgroundColor: '#8B0038',
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  floatingChatButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B0038',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B0038',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 20,
  },
  chatButtonIcon: {
    fontSize: 28,
  },
});