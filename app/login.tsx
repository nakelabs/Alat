import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { demoUser } from '../data/demoUser.js';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [error, setError] = useState('');
  
  // Handle login
  const handleLogin = () => {
    setError('');
    
    // Validate inputs
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password');
      return;
    }
    
    // Check against demo user
    if (email === demoUser.email && password === demoUser.password) {
      // Login successful - navigate to dashboard
      router.push('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };
  
  // Bubble animations
  const bubble1X = useRef(new Animated.Value(0)).current;
  const bubble1Y = useRef(new Animated.Value(0)).current;
  const bubble2X = useRef(new Animated.Value(0)).current;
  const bubble2Y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Bubble 1 animation
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

    // Bubble 2 animation
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
  }, [bubble1X, bubble1Y, bubble2X, bubble2Y]);

  return (
    <ScrollView style={styles.container} scrollEventThrottle={16}>
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

      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>‹</Text>
      </TouchableOpacity>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Welcome Text */}
      <Text style={styles.welcomeText}>Welcome Back!</Text>

      {/* Email Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder={emailFocused ? "your@email.com" : ""}
          value={email}
          onChangeText={setEmail}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          placeholderTextColor="rgba(0, 0, 0, 0.4)"
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder={passwordFocused ? "••••••••" : ""}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          placeholderTextColor="rgba(0, 0, 0, 0.4)"
        />
        <TouchableOpacity style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <View style={styles.loginButtonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.biometricButton}>
          <Text style={styles.biometricIcon}>🔒</Text>
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}

      {/* Sign Up Text */}
      <Text style={styles.signUpText}>
        Unable to Log In? Kindly{' '}
        <Text style={styles.signUpLink}>Sign Up</Text>
        {' '}if:
      </Text>

      {/* Sign Up Options */}
      <View style={styles.optionsContainer}>
        <Text style={styles.optionText}>• You are new to WEMA and ALAT.</Text>
        <Text style={styles.optionText}>• You are new to ALAT and have a WEMA account.</Text>
        <Text style={styles.optionText}>• You are new to ALAT and have WEMA mobile.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f4ff',
    paddingTop: 12,
    paddingHorizontal: 16,
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 28,
    color: '#510f3c',
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    zIndex: 10,
  },
  logo: {
    width: 56,
    height: 56,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#000',
    textAlign: 'center',
    marginBottom: 28,
    zIndex: 10,
    letterSpacing: -0.8,
  },
  inputGroup: {
    marginBottom: 18,
    zIndex: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 11,
    letterSpacing: 0.2,
  },
  input: {
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
    borderWidth: 0,
    borderColor: 'transparent',
    shadowColor: '#8B0038',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  forgotPassword: {
    fontSize: 11,
    color: '#9e1e33',
    fontWeight: '700',
  },
  loginButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
    marginTop: 12,
    zIndex: 10,
  },
  loginButton: {
    flex: 1,
    backgroundColor: '#8B0038',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B0038',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ff4757',
    marginTop: 12,
    textAlign: 'center',
    zIndex: 10,
  },
  biometricButton: {
    width: 56,
    height: 56,
    borderRadius: 14,
    borderWidth: 0,
    backgroundColor: '#8B0038',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B0038',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  biometricIcon: {
    fontSize: 26,
    color: '#ffffff',
  },
  signUpText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    marginBottom: 14,
    lineHeight: 16,
    zIndex: 10,
  },
  signUpLink: {
    color: '#9e1e33',
    fontWeight: '700',
  },
  optionsContainer: {
    marginBottom: 16,
    zIndex: 10,
    paddingBottom: 12,
  },
  optionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    marginBottom: 7,
    lineHeight: 16,
    paddingLeft: 8,
  },
  quickActionsTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#510f3c',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 1,
    zIndex: 10,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    zIndex: 10,
  },
  quickActionButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#510f3c',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  quickActionText: {
    fontSize: 8,
    color: '#510f3c',
    fontWeight: '400',
    textAlign: 'center',
  },
});
