import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ChatBubbleProps {
  variant?: 'sent' | 'received';
  message: string;
  avatar?: string;
  fallback?: string;
}

export function ChatBubble({
  variant = 'received',
  message,
  avatar,
  fallback = 'AI',
}: ChatBubbleProps) {
  return (
    <View style={[styles.container, variant === 'sent' && styles.sentContainer]}>
      {variant === 'received' && (
        <View style={styles.avatar}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{fallback}</Text>
            </View>
          )}
        </View>
      )}
      
      {variant === 'received' ? (
        <LinearGradient
          colors={["#6B5B95", "#8B0038"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.messageBubble, styles.receivedBubbleGradient]}
        >
          <Text style={[styles.messageText, styles.receivedText]}>{message}</Text>
        </LinearGradient>
      ) : (
        <View style={[styles.messageBubble, styles.sentBubble]}>
          <Text style={[styles.messageText, styles.sentText]}>{message}</Text>
        </View>
      )}

      {variant === 'sent' && (
        <View style={styles.avatar}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>{fallback}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
    gap: 10,
  },
  sentContainer: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarFallback: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8B0038',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  messageBubble: {
    maxWidth: '74%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  receivedBubble: {
    backgroundColor: '#2a2a2a',
  },
  sentBubble: {
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 15,
    color: '#fff',
    lineHeight: 20,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  receivedText: {
    color: '#fff',
  },
  sentText: {
    color: '#1a1a1a',
  },
  receivedBubbleGradient: {
    borderRadius: 16,
    overflow: 'hidden',
  },
});
