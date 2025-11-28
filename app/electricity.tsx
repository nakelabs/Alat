import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { demoUser, processCompleteTransaction } from '../data/demoUser.js';

const electricityProviders = [
  { id: 'aedc', name: 'AEDC NG', fullName: 'Abuja Electricity Distribution Company' },
  { id: 'ekedc', name: 'EKEDC', fullName: 'Eko Electricity Distribution Company' },
  { id: 'ikedc', name: 'IKEDC', fullName: 'Ikeja Electric Distribution Company' },
  { id: 'kaedc', name: 'KAEDC', fullName: 'Kaduna Electric Distribution Company' },
  { id: 'phedc', name: 'PHEDC', fullName: 'Port Harcourt Electric Distribution Company' },
  { id: 'iedc', name: 'IEDC', fullName: 'Ibadan Electricity Distribution Company' }
];

const electricityPackages = [
  { id: 'prepaid', name: 'Prepaid', description: 'Pay as you use' },
  { id: 'postpaid', name: 'Postpaid', description: 'Monthly billing' }
];

const quickAmounts = [1000, 2000, 5000, 10000, 15000, 20000];

export default function ElectricityScreen() {
  const router = useRouter();
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [meterVerified, setMeterVerified] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animate page entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleMeterVerification = async () => {
    if (!selectedProvider || !meterNumber || !selectedPackage) {
      Alert.alert('Error', 'Please select provider, package and enter meter number');
      return;
    }

    if (meterNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid meter number');
      return;
    }

    // Simulate meter verification
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock customer data
      const mockCustomers = [
        'JOHN ADEBAYO SMITH',
        'MARY CHIAMAKA OKONKWO', 
        'IBRAHIM HASSAN MOHAMMED',
        'ELIZABETH FUNMI WILLIAMS'
      ];
      
      const randomCustomer = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
      setCustomerName(randomCustomer);
      setMeterVerified(true);
      
    } catch (error) {
      Alert.alert('Error', 'Could not verify meter number. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePurchase = async () => {
    if (!meterVerified) {
      Alert.alert('Error', 'Please verify your meter number first');
      return;
    }

    const purchaseAmount = parseFloat(amount);
    if (!purchaseAmount || purchaseAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (purchaseAmount > demoUser.balance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const providerName = electricityProviders.find(p => p.id === selectedProvider)?.name || 'Electric Provider';
      
      const result = processCompleteTransaction({
        amount: purchaseAmount,
        recipientName: `${providerName} - ${meterNumber}`,
        description: `${providerName} ${selectedPackage} - ${meterNumber}`
      });

      if (result.success) {
        Alert.alert(
          'Purchase Successful',
          `₦${purchaseAmount.toLocaleString()} electricity token has been purchased for meter ${meterNumber}`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Clear form
                setSelectedProvider('');
                setSelectedPackage('');
                setMeterNumber('');
                setAmount('');
                setCustomerName('');
                setMeterVerified(false);
                
                // Navigate back to dashboard
                router.back();
              }
            }
          ]
        );
      } else {
        Alert.alert('Purchase Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatMeterNumber = (text: string) => {
    // Remove non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    setMeterNumber(cleaned);
    
    // Reset verification when meter number changes
    if (meterVerified) {
      setMeterVerified(false);
      setCustomerName('');
    }
  };

  const formatAmount = (text: string) => {
    // Remove non-numeric characters except decimal point
    const cleanText = text.replace(/[^0-9.]/g, '');
    setAmount(cleanText);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Electricity</Text>
            <View style={styles.nigerianFlag}>
              <View style={styles.flagGreen} />
              <View style={styles.flagWhite} />
              <View style={styles.flagGreen} />
            </View>
          </View>
          <View style={styles.placeholder} />
        </Animated.View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View 
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Balance Display */}
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>Balance: </Text>
              <Text style={styles.balanceAmount}>
                NGN{demoUser.balance.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </Text>
            </View>

            {/* Service Provider Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Service Provider</Text>
              <View style={styles.providerSelector}>
                <TouchableOpacity 
                  style={styles.providerButton}
                  onPress={() => {
                    // For now, just set AEDC as default, could add a picker modal later
                    setSelectedProvider('aedc');
                  }}
                >
                  <View style={styles.providerInfo}>
                    <View style={styles.providerIcon}>
                      <Text style={styles.providerIconText}>⚡</Text>
                    </View>
                    <Text style={styles.providerName}>
                      {selectedProvider ? 
                        electricityProviders.find(p => p.id === selectedProvider)?.name || 'AEDC NG' 
                        : 'AEDC NG'
                      }
                    </Text>
                  </View>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Package Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Package</Text>
              <View style={styles.packageSelector}>
                <TouchableOpacity 
                  style={styles.packageButton}
                  onPress={() => {
                    // For demo, show package options
                    Alert.alert(
                      'Select Package',
                      'Choose your electricity package type',
                      [
                        { text: 'Prepaid', onPress: () => setSelectedPackage('prepaid') },
                        { text: 'Postpaid', onPress: () => setSelectedPackage('postpaid') },
                        { text: 'Cancel', style: 'cancel' }
                      ]
                    );
                  }}
                >
                  <Text style={[styles.packageText, !selectedPackage && styles.placeholderText]}>
                    {selectedPackage ? 
                      electricityPackages.find(p => p.id === selectedPackage)?.name || 'Choose a Package'
                      : 'Choose a Package'
                    }
                  </Text>
                  <Text style={styles.dropdownIcon}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Meter Number */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Meter Number</Text>
              <View style={styles.meterInputContainer}>
                <TextInput
                  style={styles.meterInput}
                  placeholder="Enter your meter number"
                  placeholderTextColor="#666"
                  value={meterNumber}
                  onChangeText={formatMeterNumber}
                  keyboardType="numeric"
                  maxLength={15}
                />
                <TouchableOpacity 
                  style={[
                    styles.verifyButton,
                    (!selectedProvider || !meterNumber || !selectedPackage || isProcessing) && styles.verifyButtonDisabled
                  ]}
                  onPress={handleMeterVerification}
                  disabled={!selectedProvider || !meterNumber || !selectedPackage || isProcessing}
                >
                  <Text style={[
                    styles.verifyButtonText,
                    (!selectedProvider || !meterNumber || !selectedPackage || isProcessing) && styles.verifyButtonTextDisabled
                  ]}>
                    {isProcessing ? 'Verifying...' : 'Verify'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              {/* Customer Name Display */}
              {meterVerified && customerName && (
                <View style={styles.customerInfo}>
                  <Text style={styles.customerLabel}>Customer Name:</Text>
                  <Text style={styles.customerName}>{customerName}</Text>
                </View>
              )}
            </View>

            {/* Amount Section */}
            {meterVerified && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Amount</Text>
                
                {/* Quick Amount Buttons */}
                <View style={styles.quickAmountContainer}>
                  <Text style={styles.quickAmountLabel}>Quick Amount</Text>
                  <View style={styles.quickAmountGrid}>
                    {quickAmounts.map((quickAmount) => (
                      <TouchableOpacity
                        key={quickAmount}
                        style={[
                          styles.quickAmountButton,
                          amount === quickAmount.toString() && styles.quickAmountButtonSelected
                        ]}
                        onPress={() => setAmount(quickAmount.toString())}
                      >
                        <Text style={[
                          styles.quickAmountText,
                          amount === quickAmount.toString() && styles.quickAmountTextSelected
                        ]}>
                          ₦{quickAmount.toLocaleString()}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Custom Amount Input */}
                <View style={styles.customAmountContainer}>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="N0.00"
                    placeholderTextColor="#666"
                    value={amount}
                    onChangeText={formatAmount}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
            )}

            {/* Purchase Button */}
            {meterVerified && (
              <TouchableOpacity
                style={[
                  styles.purchaseButton,
                  (!amount || isProcessing) && styles.purchaseButtonDisabled
                ]}
                onPress={handlePurchase}
                disabled={!amount || isProcessing}
              >
                <Text style={[
                  styles.purchaseButtonText,
                  (!amount || isProcessing) && styles.purchaseButtonTextDisabled
                ]}>
                  {isProcessing ? 'Processing...' : 'Next'}
                </Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8B0038',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  nigerianFlag: {
    flexDirection: 'row',
    width: 24,
    height: 16,
    borderRadius: 2,
    overflow: 'hidden',
  },
  flagGreen: {
    flex: 1,
    backgroundColor: '#008751',
  },
  flagWhite: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  formContainer: {
    paddingVertical: 20,
    gap: 24,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8B0038',
  },
  balanceLabel: {
    fontSize: 12,
    color: '#999',
  },
  balanceAmount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  providerSelector: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8B0038',
  },
  providerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  providerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B0038',
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerIconText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  dropdownIcon: {
    fontSize: 16,
    color: '#999',
  },
  packageSelector: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  packageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  packageText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  placeholderText: {
    color: '#666',
  },
  meterInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  meterInput: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#444',
  },
  verifyButton: {
    backgroundColor: '#8B0038',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'center',
  },
  verifyButtonDisabled: {
    backgroundColor: '#444',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  verifyButtonTextDisabled: {
    color: '#999',
  },
  customerInfo: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#8B0038',
    gap: 8,
  },
  customerLabel: {
    fontSize: 12,
    color: '#999',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickAmountContainer: {
    gap: 12,
  },
  quickAmountLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickAmountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAmountButton: {
    width: '30%',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  quickAmountButtonSelected: {
    borderColor: '#8B0038',
    backgroundColor: '#8B0038',
  },
  quickAmountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickAmountTextSelected: {
    color: '#FFFFFF',
  },
  customAmountContainer: {
    gap: 8,
  },
  amountInput: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#444',
  },
  purchaseButton: {
    backgroundColor: '#8B0038',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#8B0038',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  purchaseButtonDisabled: {
    backgroundColor: '#444',
    shadowOpacity: 0,
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  purchaseButtonTextDisabled: {
    color: '#999',
  },
});