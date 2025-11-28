import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { demoUser } from '../data/demoUser.js';
import RatingPopup from '../components/RatingPopup';
import BlogPopup from '../components/BlogPopup';

export default function DashboardScreen() {
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(false);
  const [balance, setBalance] = useState(demoUser.balance);
  const [transactions, setTransactions] = useState(demoUser.transactions);
  const [recentTransactions, setRecentTransactions] = useState(demoUser.recentTransactions);
  const [blogPosts, setBlogPosts] = useState(demoUser.blogPosts);
  
  // Rating popup state
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [isPopupChecked, setIsPopupChecked] = useState(false);
  
  // Blog popup state
  const [showBlogPopup, setShowBlogPopup] = useState(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState<any>(null);

  // Pulsing animation for transactions container
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Counter animations for stats
  const [totalCount, setTotalCount] = useState(0);
  const [successfulCount, setSuccessfulCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);

  useEffect(() => {
    // Update blog posts from demoUser
    setBlogPosts(demoUser.blogPosts);
  }, []);

  // Check for completed transactions and show rating popup
  useEffect(() => {
    const checkForRating = async () => {
      if (isPopupChecked) return;
      
      try {
        const shouldShowRating = await AsyncStorage.getItem('shouldShowRating');
        const lastRatingShown = await AsyncStorage.getItem('lastRatingShown');
        const lastTransactionData = await AsyncStorage.getItem('lastTransaction');
        const today = new Date().toDateString();
        
        // Check for transaction updates
        if (lastTransactionData) {
          console.log('🔄 Refreshing dashboard with new transaction data');
          // Force refresh the data from demoUser
          setBalance(demoUser.balance);
          setTransactions(demoUser.transactions);
          setRecentTransactions([...demoUser.recentTransactions]);
          
          // Clear the transaction data after processing
          await AsyncStorage.removeItem('lastTransaction');
        }
        
        // Show rating popup if:
        // 1. User completed a transaction in chatbot
        // 2. Rating hasn't been shown today
        if (shouldShowRating === 'true' && lastRatingShown !== today) {
          // Small delay to ensure dashboard is loaded
          setTimeout(() => {
            setShowRatingPopup(true);
          }, 1000);
        }
        
        setIsPopupChecked(true);
      } catch (error) {
        console.error('Error checking rating status:', error);
        setIsPopupChecked(true);
      }
    };

    checkForRating();
  }, [isPopupChecked]);

  // Refresh data when component focuses (user returns to dashboard)
  useEffect(() => {
    const refreshData = () => {
      console.log('🔄 Dashboard focused - refreshing data');
      setBalance(demoUser.balance);
      setTransactions(demoUser.transactions);
      setRecentTransactions([...demoUser.recentTransactions]);
    };

    // Refresh immediately
    refreshData();

    // Set up interval to refresh every 5 seconds when component is active
    const interval = setInterval(refreshData, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  // Count up animation effect
  useEffect(() => {
    const animateCounter = (targetValue: number, setter: (value: number) => void, duration = 1500) => {
      let startValue = 0;
      const increment = targetValue / (duration / 50);
      
      const timer = setInterval(() => {
        startValue += increment;
        if (startValue >= targetValue) {
          setter(targetValue);
          clearInterval(timer);
        } else {
          setter(Math.floor(startValue));
        }
      }, 50);
      
      return timer;
    };

    // Start counter animations with slight delays
    const timer1 = setTimeout(() => animateCounter(transactions.sent + transactions.received, setTotalCount), 300);
    const timer2 = setTimeout(() => animateCounter(transactions.sent, setSuccessfulCount), 600);
    const timer3 = setTimeout(() => animateCounter(transactions.pending, setPendingCount), 900);
    const timer4 = setTimeout(() => animateCounter(transactions.failed, setFailedCount), 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const balanceAmount = `${demoUser.currency}${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const firstName = demoUser.firstName;

  // Rating popup handlers
  const handleCloseRatingPopup = async () => {
    setShowRatingPopup(false);
    try {
      // Clear the flag and mark rating as shown today
      await AsyncStorage.removeItem('shouldShowRating');
      await AsyncStorage.setItem('lastRatingShown', new Date().toDateString());
    } catch (error) {
      console.error('Error closing rating popup:', error);
    }
  };

  const handleRatingNext = async (rating: number, feedback?: { reason: string; improvement: string }) => {
    console.log('User rated the transaction:', rating);
    
    if (feedback) {
      console.log('User feedback:', {
        rating,
        reason: feedback.reason,
        improvement: feedback.improvement
      });
    }
    
    // Here you could send the rating and feedback to your backend
    try {
      // For demo purposes, just log it
      console.log(`Rating submitted: ${rating}/5 stars`);
      
      if (feedback) {
        console.log('Feedback details:', {
          reason: feedback.reason,
          improvement: feedback.improvement
        });
      }
      
      // You could add an API call here to save the rating and feedback
      // await submitRating({ 
      //   rating, 
      //   feedback: feedback ? {
      //     reason: feedback.reason,
      //     improvement: feedback.improvement
      //   } : null,
      //   transactionId, 
      //   userId 
      // });
      
      // Show a success message or navigate somewhere
      // You could add a toast notification here
      
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  // Update floating chat button to set transaction flag
  const handleChatButtonPress = async () => {
    try {
      // Set flag that user might complete a transaction
      await AsyncStorage.setItem('userInChatbot', 'true');
      router.push('/chatbot');
    } catch (error) {
      console.error('Error setting chatbot flag:', error);
      router.push('/chatbot');
    }
  };

  // Handle blog post click
  const handleBlogPostPress = (blogPost: any) => {
    setSelectedBlogPost(blogPost);
    setShowBlogPopup(true);
  };

  // Handle blog popup close
  const handleCloseBlogPopup = () => {
    setShowBlogPopup(false);
    setSelectedBlogPost(null);
  };

  const quickActions = [
    { icon: 'transfer', label: 'Transfer', type: 'icon' },
    { icon: 'airtime', label: 'Airtime & Data', type: 'icon' },
    { icon: 'transactions', label: 'Transactions', type: 'icon' },
    { icon: 'electricity', label: 'Buy Electricity', type: 'icon' },
  ];

  const bottomNav = [
    { icon: '🏠', label: 'Home' },
    { icon: '↔️', label: 'Transfer' },
    { icon: '💰', label: 'Cards' },
    { icon: '📋', label: 'Services' },
    { icon: '🎯', label: 'Goals' },
  ];

  return (
    <View style={styles.mainWrapper}>
      <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.userAvatar}>
            <Text style={styles.avatarText}>{firstName.charAt(0)}{demoUser.name.split(' ')[1]?.charAt(0)}</Text>
          </View>
          <Text style={styles.userName}>HI, {firstName.toUpperCase()}</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Text style={styles.iconText}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconSpacing}>
            <Text style={styles.iconText}>🎧</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceTop}>
          <Text style={styles.balanceStatus}>ACTIVE</Text>
          <Text style={styles.balanceTier}>TIER 3 SAVINGS ACCOUNT</Text>
        </View>
        
        <View style={styles.balanceMiddle}>
          <View style={styles.balanceLeftContent}>
            <View style={styles.balanceInfoRow}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                <Text style={styles.balanceEyeIcon}>👁️</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.amount}>{showBalance ? balanceAmount : '••••••••'}</Text>
          </View>
          <TouchableOpacity style={styles.fundAccountBtn}>
            <Text style={styles.fundAccountBtnText}>Fund Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.balanceBottom}>
          <TouchableOpacity 
            style={styles.transactionHistoryBtn}
            onPress={() => router.push('/transactions')}
          >
            <Text style={styles.transactionHistoryText}>Transaction History ›</Text>
          </TouchableOpacity>
          <View style={styles.balanceDots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>
      </View>

      {/* Stats Row */}
      <View style={styles.statsContainer}>
        <View style={styles.statBadge}>
          <Text style={styles.statBadgeLabel}>Total</Text>
          <Text style={styles.statBadgeLabel}>Transactions</Text>
          <View style={styles.statCircle}>
            <Text style={styles.statCircleNumber}>{totalCount}</Text>
          </View>
        </View>
        <View style={styles.statBadge}>
          <Text style={styles.statBadgeLabel}>Successful</Text>
          <Text style={styles.statBadgeLabel}>Transactions</Text>
          <View style={styles.statCircle}>
            <Text style={styles.statCircleNumber}>{successfulCount}</Text>
          </View>
        </View>
        <View style={styles.statBadge}>
          <Text style={styles.statBadgeLabel}>Pending</Text>
          <Text style={styles.statBadgeLabel}>Transactions</Text>
          <View style={styles.statCircle}>
            <Text style={styles.statCircleNumber}>{pendingCount}</Text>
          </View>
        </View>
        <View style={styles.statBadge}>
          <Text style={styles.statBadgeLabel}>Failed</Text>
          <Text style={styles.statBadgeLabel}>Transactions</Text>
          <View style={styles.statCircle}>
            <Text style={styles.statCircleNumber}>{failedCount}</Text>
          </View>
        </View>
      </View>

      {/* My Favorites */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Favorites</Text>
          <Text style={styles.seeMore}>edit my favorites</Text>
        </View>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.actionButton}
              onPress={() => {
                if (action.icon === 'transfer') {
                  router.push('/transfer');
                } else if (action.icon === 'airtime') {
                  router.push('/airtime');
                } else if (action.icon === 'transactions') {
                  router.push('/transactions');
                } else if (action.icon === 'electricity') {
                  router.push('/electricity');
                }
                // Add other navigation logic here for other actions
              }}
            >
              <View style={styles.actionIconContainer}>
                {action.icon === 'transfer' && (
                  <View style={styles.transferIcon}>
                    <View style={styles.transferArrow1} />
                    <View style={styles.transferArrow2} />
                  </View>
                )}
                {action.icon === 'airtime' && (
                  <View style={styles.airtimeIcon}>
                    <View style={styles.airtimeSignal1} />
                    <View style={styles.airtimeSignal2} />
                    <View style={styles.airtimeSignal3} />
                  </View>
                )}
                {action.icon === 'transactions' && (
                  <View style={styles.transactionsIcon}>
                    <View style={styles.transactionLine1} />
                    <View style={styles.transactionLine2} />
                    <View style={styles.transactionLine3} />
                    <View style={styles.transactionDot} />
                  </View>
                )}
                {action.icon === 'electricity' && (
                  <View style={styles.electricityIcon}>
                    <View style={styles.lightBulb} />
                    <View style={styles.electricityBolt} />
                  </View>
                )}
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transactions</Text>
          <TouchableOpacity onPress={() => router.push('/transactions')}>
            <Text style={styles.seeMore}>View All</Text>
          </TouchableOpacity>
        </View>
        <Animated.View style={[
          styles.transactionsContainer,
          {
            transform: [{ scale: pulseAnim }],
            borderColor: '#8B0038',
          }
        ]}>
          {recentTransactions.slice(0, 3).map((transaction) => (
            <TouchableOpacity 
              key={transaction.id} 
              style={styles.transactionItem}
              onPress={() => router.push('/transactions')}
            >
              <View style={styles.transactionLeft}>
                <View style={[styles.transactionAvatar, { backgroundColor: transaction.avatarColor }]}>
                  <Text style={styles.transactionAvatarText}>{transaction.avatar}</Text>
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionName}>
                    {transaction.type === 'credit' ? transaction.senderName : transaction.recipientName}
                  </Text>
                  <Text style={styles.transactionTime}>
                    {transaction.time} • {transaction.date}
                  </Text>
                </View>
              </View>
              <Text style={[
                styles.transactionAmount,
                { color: transaction.type === 'credit' ? '#00C851' : '#fff' }
              ]}>
                {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>

      {/* Blog Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.blogSectionTitle}>The Latest</Text>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.blogScrollContainer}
          scrollEventThrottle={16}
          decelerationRate="fast"
        >
          {blogPosts.map((post) => (
            <TouchableOpacity 
              key={post.id} 
              style={styles.blogCard}
              onPress={() => handleBlogPostPress(post)}
              activeOpacity={0.8}
            >
                <LinearGradient
                  colors={post.gradient as any}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.blogCardGradient}
                >
                  <View style={styles.blogCardContent}>
                    <Text style={styles.blogCardTitle}>{post.title}</Text>
                    <Text style={styles.blogCardSubtitle}>{post.subtitle}</Text>
                    <View style={styles.blogCardIcon}>
                      <Text style={styles.blogCardIconText}>{post.icon}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Expense Tracker */}
      <View style={styles.expenseSection}>
        <View style={styles.expenseHeader}>
          <Text style={styles.expenseIcon}>💼</Text>
          <View>
            <Text style={styles.expenseTitle}>Expense Tracker</Text>
            <Text style={styles.expenseSubtitle}>Expense Tracker Expense Tracker...</Text>
          </View>
        </View>
      </View>

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacing} />
    </ScrollView>

    {/* Floating Chat Button */}
    <TouchableOpacity 
      style={styles.floatingChatButton}
      onPress={handleChatButtonPress}
    >
      <Text style={styles.chatButtonIcon}>💬</Text>
    </TouchableOpacity>

    {/* Rating Popup */}
    <RatingPopup
      visible={showRatingPopup}
      onClose={handleCloseRatingPopup}
      onNext={handleRatingNext}
    />

    {/* Blog Popup */}
    <BlogPopup
      visible={showBlogPopup}
      blogPost={selectedBlogPost}
      onClose={handleCloseBlogPopup}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    position: 'relative',
  },
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B0038',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  userName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconText: {
    fontSize: 20,
  },
  iconSpacing: {
    marginLeft: 4,
  },
  balanceCard: {
    backgroundColor: '#8B0038',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#8B0038',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  balanceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceStatus: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 1,
  },
  balanceTier: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.75)',
  },
  balanceMiddle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  balanceLeftContent: {
    flex: 1,
  },
  balanceInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  balanceEyeIcon: {
    fontSize: 14,
  },
  amount: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
  },
  fundAccountBtn: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  fundAccountBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8B0038',
  },
  balanceBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionHistoryBtn: {
    flex: 1,
  },
  transactionHistoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  balanceDots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dotActive: {
    backgroundColor: '#fff',
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addAccountBtn: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  balanceAmount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 10,
  },
  statBadge: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderWidth: 2.5,
    borderColor: '#8B0038',
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  statBadgeLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 12,
    textAlign: 'center',
  },
  statCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#8B0038',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#2a2a2a',
  },
  statCircleNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.8,
  },
  seeMore: {
    fontSize: 10,
    color: '#8B0038',
    fontWeight: '700',
  },
  editFavoritesBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#8B0038',
    shadowColor: '#8B0038',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  editFavoritesText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.3,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#8B0038',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#8B0038',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  // Transfer Icon Styles
  transferIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transferArrow1: {
    width: 16,
    height: 2,
    backgroundColor: '#fff',
    position: 'absolute',
    transform: [{ rotate: '45deg' }, { translateY: -3 }],
  },
  transferArrow2: {
    width: 16,
    height: 2,
    backgroundColor: '#fff',
    position: 'absolute',
    transform: [{ rotate: '-45deg' }, { translateY: 3 }],
  },
  // Airtime Icon Styles
  airtimeIcon: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  airtimeSignal1: {
    width: 4,
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  airtimeSignal2: {
    width: 4,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  airtimeSignal3: {
    width: 4,
    height: 16,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  // QR Code Icon Styles
  qrcodeIcon: {
    width: 20,
    height: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  qrSquare1: {
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 1,
  },
  qrSquare2: {
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 1,
  },
  qrSquare3: {
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 1,
  },
  qrSquare4: {
    width: 8,
    height: 8,
    backgroundColor: '#fff',
    borderRadius: 1,
  },
  // Bank Icon Styles
  bankIcon: {
    alignItems: 'center',
  },
  bankRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#fff',
    marginBottom: 2,
  },
  bankColumns: {
    flexDirection: 'row',
    gap: 2,
  },
  bankColumn: {
    width: 3,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 1,
  },
  // Electricity Icon Styles
  electricityIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightBulb: {
    width: 12,
    height: 16,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 2,
  },
  electricityBolt: {
    width: 8,
    height: 12,
    backgroundColor: '#fff',
    transform: [{ rotate: '15deg' }],
    borderRadius: 1,
  },
  // Transactions Icon Styles
  transactionsIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  transactionLine1: {
    width: 18,
    height: 2,
    backgroundColor: '#fff',
    marginBottom: 3,
    borderRadius: 1,
  },
  transactionLine2: {
    width: 14,
    height: 2,
    backgroundColor: '#fff',
    marginBottom: 3,
    borderRadius: 1,
    alignSelf: 'flex-start',
  },
  transactionLine3: {
    width: 10,
    height: 2,
    backgroundColor: '#fff',
    marginBottom: 4,
    borderRadius: 1,
    alignSelf: 'flex-start',
  },
  transactionDot: {
    width: 6,
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 3,
    alignSelf: 'flex-end',
  },
  actionImageIcon: {
    width: 60,
    height: 60,
    marginBottom: 12,
    borderRadius: 14,
    backgroundColor: '#f8f4ff',
    padding: 10,
    shadowColor: '#8B0038',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 16,
  },
  recurringHeader: {
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#8B0038',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  waveChart: {
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  recurringTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  transactionsContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#8B0038',
    shadowColor: '#8B0038',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionAvatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: 11,
    color: '#999',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  setupButton: {
    backgroundColor: '#8B0038',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#8B0038',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  setupButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  favoritesContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  blogSectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.8,
    marginBottom: 4,
  },
  blogScrollContainer: {
    paddingRight: 16,
  },
  blogCard: {
    width: 280,
    height: 180,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  blogCardTouchable: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  blogCardGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  blogCardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  blogCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 24,
    marginBottom: 8,
  },
  blogCardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
    marginBottom: 16,
  },
  blogCardIcon: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blogCardIconText: {
    fontSize: 20,
  },
  favoriteCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    minHeight: 140,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardPattern: {
    height: 40,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: '#000',
    transform: [{ rotate: '45deg' }],
    marginBottom: 8,
  },
  favoriteLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    backgroundColor: '#8B0038',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    textAlign: 'center',
  },
  expenseSection: {
    marginBottom: 24,
  },
  expenseHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: '#8B0038',
    shadowColor: '#8B0038',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  expenseIcon: {
    fontSize: 28,
  },
  expenseTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  expenseSubtitle: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 100,
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
