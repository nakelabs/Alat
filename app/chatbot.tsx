import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Animated, Platform, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, Bubble, Send, IMessage, BubbleProps, SendProps } from 'react-native-gifted-chat';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BackgroundBubbles } from '../components/BackgroundBubbles';
import { processCompleteTransaction, demoUser } from '../data/demoUser.js';
import axios from 'axios';

// Function to extract transaction details from AI response
const extractTransactionDetails = (message: string) => {
  const details = {
    amount: 0,
    recipientName: '',
    description: ''
  };
  
  // Extract amount using various patterns
  const amountPatterns = [
    /₦([\d,]+(?:\.\d{2})?)/g,
    /([\d,]+(?:\.\d{2})?)\s*naira/gi,
    /amount.*?([\d,]+(?:\.\d{2})?)/gi,
    /sent.*?([\d,]+(?:\.\d{2})?)/gi,
    /transferred.*?([\d,]+(?:\.\d{2})?)/gi
  ];
  
  for (const pattern of amountPatterns) {
    const match = message.match(pattern);
    if (match) {
      const amountStr = match[0].replace(/[^\d.,]/g, '').replace(/,/g, '');
      const amount = parseFloat(amountStr);
      if (!isNaN(amount) && amount > 0) {
        details.amount = amount;
        break;
      }
    }
  }
  
  // Extract recipient name using patterns
  const recipientPatterns = [
    /to\s+([A-Za-z\s]+?)(?:\s|$|\.|,)/gi,
    /sent.*?to\s+([A-Za-z\s]+?)(?:\s|$|\.|,)/gi,
    /transferred.*?to\s+([A-Za-z\s]+?)(?:\s|$|\.|,)/gi,
    /recipient.*?([A-Za-z\s]+?)(?:\s|$|\.|,)/gi
  ];
  
  for (const pattern of recipientPatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      const name = match[1].trim();
      if (name.length > 2 && name.length < 50) {
        details.recipientName = name;
        break;
      }
    }
  }
  
  // If no recipient found, use a default
  if (!details.recipientName) {
    details.recipientName = 'ALAT Transfer';
  }
  
  details.description = `Transfer via ALAT AI`;
  
  return details;
};

export default function ChatbotScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [inputText, setInputText] = useState('');
  
  // Debug messages state
  useEffect(() => {
    console.log("🔄 Messages state updated:", messages.length, "messages");
    messages.forEach((msg, index) => {
      console.log(`Message ${index}:`, msg.text, "from user:", msg.user.name);
    });
  }, [messages]);
  
  // Use a ref for the socket so it doesn't re-render the component
  const socketRef = useRef<WebSocket | null>(null);
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(1)).current;
  const [displayedSubtitle, setDisplayedSubtitle] = useState('');
  const fullSubtitle = 'Your own AI assistant';

  // 1. HANDSHAKE - FETCH SESSION ID ON MOUNT
  useEffect(() => {
    const initChat = async () => {
      try {
        console.log("🚀 Making handshake request to session endpoint...");
        
        // Call the endpoint to create a new session
        const response = await axios.get('https://alir-backend.onrender.com/chat/session/new');
        
        console.log("📝 Session API Response:", response.data);
        
        // Parse Response: Extract session_id and websocket_url
        const { session_id, websocket_url } = response.data;
        
        console.log("🔑 Session ID:", session_id);
        console.log("🔗 WebSocket relative path:", websocket_url);

        // Connect: Construct the full WSS URL
        const fullWsUrl = `wss://alir-backend.onrender.com${websocket_url}`;
        console.log("🌐 Full WebSocket URL:", fullWsUrl);
        
        // Open WebSocket connection
        connectToWebSocket(fullWsUrl);

      } catch (error) {
        console.error("❌ Failed to get session ID:", error);
        // Show error message in chat
        setMessages([
          {
            _id: 1,
            text: 'Hello! I\'m having trouble connecting to the server right now, but I\'m here to help with your banking needs!',
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'BelAI',
              avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png',
            },
          } as IMessage,
        ]);
        setIsConnected(true); // Allow offline usage
      }
    };

    initChat();

    // Cleanup: Close the socket when the component unmounts
    return () => {
      if (socketRef.current) {
        console.log('🧹 Cleaning up WebSocket connection');
        socketRef.current.close();
      }
      if (heartbeatInterval.current) {
        clearInterval(heartbeatInterval.current);
      }
    };
  }, []);

  // 2. CONNECT TO WEBSOCKET
  const connectToWebSocket = (url: string) => {
    try {
      console.log("🔌 Connecting to WebSocket:", url);
      socketRef.current = new WebSocket(url);
      
      socketRef.current.onopen = () => {
        console.log("✅ WebSocket Connected!");
        setIsConnected(true);
        setConnectionAttempts(0);
        
        // Start heartbeat to keep connection alive
        if (heartbeatInterval.current) {
          clearInterval(heartbeatInterval.current);
        }
        
        heartbeatInterval.current = setInterval(() => {
          if (socketRef.current?.readyState === WebSocket.OPEN) {
            console.log("💓 Sending heartbeat...");
            socketRef.current.send(JSON.stringify({ type: "ping" }));
          }
        }, 30000); // Send ping every 30 seconds
      };
      
      // 3. LISTEN - Handle incoming messages
      socketRef.current.onmessage = (event: MessageEvent) => {
        console.log("🎯 WebSocket onmessage triggered!");
        console.log("📨 Raw message received:", event.data);
        console.log("📨 Event type:", typeof event.data);
        
        try {
          
          // Parse the JSON response
          const data = JSON.parse(event.data);
          console.log("📋 Parsed JSON data:", data);
          
          // Extract the text from data.content (based on your API response format)
          const messageText = data.content || data.message || data.reply || data.text;
          
          // Skip empty or ping responses
          if (!messageText || messageText.trim() === '' || data.type === 'pong') {
            console.log("⏭️ Skipping empty or ping response");
            return;
          }
          
          console.log("💬 Extracted message text:", messageText);
          
          // Append it to the Gifted Chat state
          const aiMessage: IMessage = {
            _id: Math.random().toString(),
            text: messageText,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'BelAI',
              avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png',
            },
          };
          
          console.log("✅ Adding AI message to chat:", aiMessage);
          
          // Check if the AI response indicates a completed transaction
          const transactionKeywords = [
            'transaction completed',
            'transfer successful',
            'payment successful', 
            'transaction successful',
            'money sent',
            'transfer complete',
            'payment complete',
            'successfully transferred',
            'successfully sent',
            'transaction processed',
            'sent ₦',
            'transferred ₦',
            'paid ₦'
          ];
          
          const isTransactionComplete = transactionKeywords.some(keyword => 
            messageText.toLowerCase().includes(keyword)
          );
          
          if (isTransactionComplete) {
            console.log('🎉 Transaction completed! Processing transaction...');
            
            // Extract transaction details from the AI message
            const transactionDetails = extractTransactionDetails(messageText);
            
            if (transactionDetails.amount > 0) {
              console.log('💰 Transaction details extracted:', transactionDetails);
              
              // Process the transaction
              const result = processCompleteTransaction(transactionDetails);
              
              if (result.success) {
                console.log('✅ Transaction processed successfully:', result);
                
                // Set flag for rating popup
                AsyncStorage.setItem('shouldShowRating', 'true')
                  .then(() => {
                    console.log('✅ Rating flag set successfully');
                  })
                  .catch((error) => {
                    console.error('❌ Error setting rating flag:', error);
                  });
                
                // Store transaction details for dashboard refresh
                AsyncStorage.setItem('lastTransaction', JSON.stringify({
                  ...result,
                  timestamp: new Date().toISOString()
                }))
                  .then(() => {
                    console.log('✅ Transaction details stored for dashboard');
                  })
                  .catch((error) => {
                    console.error('❌ Error storing transaction details:', error);
                  });
              } else {
                console.log('❌ Transaction failed:', result.message);
              }
            }
          }
          
          setMessages(previousMessages => {
            const newMessages = GiftedChat.append(previousMessages, [aiMessage]);
            console.log("📊 Previous messages count:", previousMessages.length);
            console.log("📊 New messages count:", newMessages.length);
            return newMessages;
          });
          
        } catch (parseError) {
          console.error("❌ Error parsing JSON message:", parseError);
          console.log("📄 Raw data that failed to parse:", event.data);
          
          // Handle JSON parsing errors gracefully - use raw text
          const fallbackMessage: IMessage = {
            _id: Math.random().toString(),
            text: typeof event.data === 'string' ? event.data : 'Received an invalid message format',
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'BelAI',
              avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png',
            },
          };
          
          setMessages(previousMessages => GiftedChat.append(previousMessages, [fallbackMessage]));
        }
      };
      
      socketRef.current.onclose = (event: CloseEvent) => {
        console.log("❌ WebSocket disconnected:", event.code, event.reason);
        setIsConnected(false);
        
        // Clear heartbeat
        if (heartbeatInterval.current) {
          clearInterval(heartbeatInterval.current);
        }
        
        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && connectionAttempts < 3) {
          console.log(`🔄 Attempting reconnection (${connectionAttempts + 1}/3)...`);
          setTimeout(() => {
            setConnectionAttempts(prev => prev + 1);
            connectToWebSocket(url);
          }, 2000 * (connectionAttempts + 1)); // Exponential backoff
        }
      };
      
      socketRef.current.onerror = (error: Event) => {
        console.error("❌ WebSocket error:", error);
        setIsConnected(false);
      };
      
    } catch (error) {
      console.error("❌ Failed to connect WebSocket:", error);
      setIsConnected(false);
    }
  };

  // Header animations
  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Breathing effect for title
    const breathingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    breathingAnimation.start();

    // Typewriter effect for subtitle
    let index = 0;
    const typewriterInterval = setInterval(() => {
      if (index <= fullSubtitle.length) {
        setDisplayedSubtitle(fullSubtitle.slice(0, index));
        index++;
      } else {
        clearInterval(typewriterInterval);
      }
    }, 100);

    return () => {
      breathingAnimation.stop();
      clearInterval(typewriterInterval);
    };
  }, []);

  // 4. SEND - Handle user messages
  const onSend = useCallback((newMessages: IMessage[] = []) => {
    console.log("📤 onSend called with:", newMessages);
    // Append user message to chat immediately
    setMessages(previousMessages => {
      const updated = GiftedChat.append(previousMessages, newMessages);
      console.log("📊 User message added, total count:", updated.length);
      return updated;
    });
    
    const userText = newMessages[0].text;
    console.log("📤 Sending user message:", userText);

    // Send JSON string to WebSocket
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log("🔗 WebSocket state:", socketRef.current.readyState, "(OPEN =", WebSocket.OPEN, ")");
      const payload = JSON.stringify({ 
        type: "message", 
        content: userText 
      });
      console.log("📦 Sending payload:", payload);
      socketRef.current.send(payload);
      console.log("✅ Message sent successfully");
      
      // Add a timeout to check if we get a response
      setTimeout(() => {
        console.log("⏰ 5 seconds passed - checking if we received any response...");
      }, 5000);
    } else {
      console.error("❌ Cannot send message - WebSocket not connected");
      console.log("🔍 WebSocket current state:", socketRef.current?.readyState);
      console.log("🔍 Expected OPEN state:", WebSocket.OPEN);
      
      // Show error message if not connected
      const errorMessage: IMessage = {
        _id: Math.random().toString(),
        text: 'Sorry, I\'m not connected right now. Please try again in a moment.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'BelAI',
          avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712109.png',
        },
      };
      
      setMessages(previousMessages => GiftedChat.append(previousMessages, [errorMessage]));
    }
  }, []);

  // Handle custom send message
  const handleSendMessage = useCallback(() => {
    if (!inputText.trim()) return;

    const userMessage: IMessage = {
      _id: Math.random().toString(),
      text: inputText.trim(),
      createdAt: new Date(),
      user: {
        _id: 1,
      },
    };

    onSend([userMessage]);
    setInputText('');
  }, [inputText, onSend]);

  // Custom bubble style
  const renderBubble = (props: BubbleProps<IMessage>) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#6C63FF',
          },
          left: {
            backgroundColor: '#2A2A2A',
          },
        }}
        textStyle={{
          right: {
            color: '#FFFFFF',
          },
          left: {
            color: '#FFFFFF',
          },
        }}
      />
    );
  };

  // Custom send button
  const renderSend = (props: SendProps<IMessage>) => {
    return (
      <Send {...props} containerStyle={{ justifyContent: 'center', paddingLeft: 10 }}>
        <View style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </View>
      </Send>
    );
  };

  // Handle back navigation
  const handleBackPress = async () => {
    try {
      // Clear the chatbot flag when leaving
      await AsyncStorage.removeItem('userInChatbot');
      router.back();
    } catch (error) {
      console.error('Error clearing chatbot flag:', error);
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundBubbles />
      
      {/* Header Section */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        {/* Back Button and Title Row */}
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Animated.Text style={[styles.title, { transform: [{ scale: breatheAnim }] }]}>
            Alat AI
          </Animated.Text>
          <View style={styles.placeholder} />
        </View>
        
        <Text style={styles.subtitle}>
          {displayedSubtitle}
          {displayedSubtitle.length < fullSubtitle.length && (
            <Text style={styles.cursor}>|</Text>
          )}
        </Text>
        
        {/* Connection Status */}
        <View style={[
          styles.statusIndicator,
          { backgroundColor: isConnected ? '#4CAF50' : '#FF5722' }
        ]}>
          <Text style={styles.statusText}>
            {isConnected ? '🟢 Connected' : '🔴 Offline'}
          </Text>
        </View>
      </Animated.View>

      {/* GiftedChat Component */}
      <View style={styles.chatContainer}>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: 1,
          }}
          renderBubble={renderBubble}
          renderInputToolbar={() => null}
          messagesContainerStyle={styles.messagesContainer}
        />
      </View>
      
      {/* Custom Input Section */}
      <View style={styles.customInputContainer}>
        <TextInput
          style={styles.customTextInput}
          placeholder="Type your message here..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.customSendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!inputText.trim()}
        >
          <Text style={[styles.customSendButtonText, !inputText.trim() && styles.sendButtonTextDisabled]}>Send</Text>
        </TouchableOpacity>
      </View>
      
      {/* Loading indicator if connecting */}
      {!isConnected && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Connecting to BelAI...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    zIndex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
    flex: 1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#B0BEC5',
    marginBottom: 12,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  cursor: {
    color: '#6C63FF',
    fontWeight: 'bold',
  },
  statusIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 5,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  giftedChat: {
    backgroundColor: '#121212',
  },
  messagesContainer: {
    backgroundColor: '#121212',
    paddingHorizontal: 10,
  },
  inputToolbar: {
    backgroundColor: '#121212',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  customInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
    alignItems: 'flex-end',
  },
  customTextInput: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    color: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#444',
    fontSize: 16,
    maxHeight: 100,
  },
  customSendButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customSendButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sendButtonDisabled: {
    backgroundColor: '#444',
    opacity: 0.6,
  },
  sendButtonTextDisabled: {
    color: '#888',
  },
  sendButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 18, 18, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});
