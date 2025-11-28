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

const networks = [
  { id: 'mtn', name: 'MTN', color: '#FFCC00', icon: 'M' },
  { id: 'airtel', name: 'AIRTEL', color: '#FF0000', icon: 'A' },
  { id: 'glo', name: 'GLO', color: '#00B04F', icon: 'G' },
  { id: '9mobile', name: '9MOBILE', color: '#00A651', icon: '9' }
];

const airtimeAmounts = [200, 500, 1000, 2000, 3000, 5000];
const dataPlans = [
  { amount: 500, data: '1GB', validity: '30 days' },
  { amount: 1000, data: '2GB', validity: '30 days' },
  { amount: 1500, data: '3GB', validity: '30 days' },
  { amount: 2000, data: '5GB', validity: '30 days' },
  { amount: 3000, data: '10GB', validity: '30 days' },
  { amount: 5000, data: '20GB', validity: '30 days' }
];

const recentNumbers = [
  { number: '08101057686', name: 'My Number', network: 'mtn' },
  { number: '08105531503', name: 'Mtn Ng', network: 'mtn' }
];

export default function AirtimeScreen() {
  const router = useRouter();
  const [serviceType, setServiceType] = useState<'airtime' | 'data'>('airtime');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedDataPlan, setSelectedDataPlan] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
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

  const handlePurchase = async () => {
    if (!selectedNetwork || !phoneNumber) {
      Alert.alert('Error', 'Please select a network and enter a phone number');
      return;
    }

    let amount = 0;
    let description = '';

    if (serviceType === 'airtime') {
      amount = selectedAmount || parseFloat(customAmount);
      if (!amount || amount <= 0) {
        Alert.alert('Error', 'Please select or enter an amount');
        return;
      }
      description = `${selectedNetwork.toUpperCase()} Airtime - ${phoneNumber}`;
    } else {
      if (!selectedDataPlan) {
        Alert.alert('Error', 'Please select a data plan');
        return;
      }
      amount = selectedDataPlan.amount;
      description = `${selectedNetwork.toUpperCase()} Data ${selectedDataPlan.data} - ${phoneNumber}`;
    }

    if (amount > demoUser.balance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const result = processCompleteTransaction({
        amount,
        recipientName: phoneNumber,
        description
      });

      if (result.success) {
        Alert.alert(
          'Purchase Successful',
          `₦${amount.toLocaleString()} ${serviceType} has been sent to ${phoneNumber}`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Clear form
                setSelectedNetwork('');
                setPhoneNumber('');
                setSelectedAmount(0);
                setCustomAmount('');
                setSelectedDataPlan(null);
                
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

  const formatPhoneNumber = (text: string) => {
    // Remove non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    setPhoneNumber(cleaned);
  };

  const getNetworkFromNumber = (number: string) => {
    const prefix = number.substring(0, 4);
    if (['0803', '0806', '0703', '0706', '0813', '0816', '0810', '0814', '0903', '0906', '0913', '0916'].includes(prefix)) {
      return 'mtn';
    } else if (['0802', '0808', '0708', '0812', '0901', '0902', '0904', '0907', '0912'].includes(prefix)) {
      return 'airtel';
    } else if (['0805', '0807', '0705', '0815', '0811', '0905', '0915'].includes(prefix)) {
      return 'glo';
    } else if (['0809', '0818', '0817', '0909', '0908'].includes(prefix)) {
      return '9mobile';
    }
    return '';
  };

  useEffect(() => {
    if (phoneNumber.length >= 4) {
      const detectedNetwork = getNetworkFromNumber(phoneNumber);
      if (detectedNetwork) {
        setSelectedNetwork(detectedNetwork);
      }
    }
  }, [phoneNumber]);

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
            <Text style={styles.headerTitle}>Airtime</Text>
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
            {/* Service Type Toggle */}
            <View style={styles.serviceToggle}>
              <TouchableOpacity
                style={[styles.toggleButton, serviceType === 'airtime' && styles.toggleButtonActive]}
                onPress={() => setServiceType('airtime')}
              >
                <Text style={[styles.toggleText, serviceType === 'airtime' && styles.toggleTextActive]}>
                  Airtime
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, serviceType === 'data' && styles.toggleButtonActive]}
                onPress={() => setServiceType('data')}
              >
                <Text style={[styles.toggleText, serviceType === 'data' && styles.toggleTextActive]}>
                  Data
                </Text>
              </TouchableOpacity>
            </View>

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

            {/* Most Recent Numbers */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Most Recent</Text>
              <View style={styles.recentNumbers}>
                {recentNumbers.map((contact, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.recentContact}
                    onPress={() => {
                      setPhoneNumber(contact.number);
                      setSelectedNetwork(contact.network);
                    }}
                  >
                    <View style={[styles.contactAvatar, { backgroundColor: networks.find(n => n.id === contact.network)?.color }]}>
                      <Text style={styles.contactAvatarText}>{contact.name.charAt(0)}</Text>
                    </View>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactNumber}>{contact.number}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Amount Selection for Airtime */}
            {serviceType === 'airtime' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Choose an amount</Text>
                <View style={styles.amountGrid}>
                  {airtimeAmounts.map((amount) => (
                    <TouchableOpacity
                      key={amount}
                      style={[
                        styles.amountButton,
                        selectedAmount === amount && styles.amountButtonSelected
                      ]}
                      onPress={() => {
                        setSelectedAmount(amount);
                        setCustomAmount('');
                      }}
                    >
                      <Text style={[
                        styles.amountText,
                        selectedAmount === amount && styles.amountTextSelected
                      ]}>
                        ₦{amount.toLocaleString()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Custom Amount Input */}
                <View style={styles.customAmountContainer}>
                  <Text style={styles.inputLabel}>Amount</Text>
                  <TextInput
                    style={styles.amountInput}
                    placeholder="N0.00"
                    placeholderTextColor="#666"
                    value={customAmount}
                    onChangeText={(text) => {
                      setCustomAmount(text);
                      setSelectedAmount(0);
                    }}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
            )}

            {/* Data Plans Selection */}
            {serviceType === 'data' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Choose Data Plan</Text>
                <View style={styles.dataPlansContainer}>
                  {dataPlans.map((plan, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dataPlanButton,
                        selectedDataPlan?.amount === plan.amount && styles.dataPlanButtonSelected
                      ]}
                      onPress={() => setSelectedDataPlan(plan)}
                    >
                      <View style={styles.dataPlanInfo}>
                        <Text style={[
                          styles.dataPlanData,
                          selectedDataPlan?.amount === plan.amount && styles.dataPlanTextSelected
                        ]}>
                          {plan.data}
                        </Text>
                        <Text style={[
                          styles.dataPlanValidity,
                          selectedDataPlan?.amount === plan.amount && styles.dataPlanTextSelected
                        ]}>
                          {plan.validity}
                        </Text>
                      </View>
                      <Text style={[
                        styles.dataPlanAmount,
                        selectedDataPlan?.amount === plan.amount && styles.dataPlanTextSelected
                      ]}>
                        ₦{plan.amount.toLocaleString()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Network Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Choose Network</Text>
              <View style={styles.networkGrid}>
                {networks.map((network) => (
                  <TouchableOpacity
                    key={network.id}
                    style={[
                      styles.networkButton,
                      selectedNetwork === network.id && styles.networkButtonSelected
                    ]}
                    onPress={() => setSelectedNetwork(network.id)}
                  >
                    <View style={[styles.networkIcon, { backgroundColor: network.color }]}>
                      <Text style={styles.networkIconText}>{network.icon}</Text>
                    </View>
                    <Text style={[
                      styles.networkName,
                      selectedNetwork === network.id && styles.networkNameSelected
                    ]}>
                      {network.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Phone Number Input */}
            <View style={styles.section}>
              <View style={styles.phoneNumberHeader}>
                <Text style={styles.sectionTitle}>Phone Number</Text>
                <TouchableOpacity style={styles.chooseContactButton}>
                  <Text style={styles.chooseContactText}>Choose Contact</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="0801 234 5678"
                placeholderTextColor="#666"
                value={phoneNumber}
                onChangeText={formatPhoneNumber}
                keyboardType="phone-pad"
                maxLength={11}
              />
            </View>

            {/* Purchase Button */}
            <TouchableOpacity
              style={[
                styles.purchaseButton,
                (!selectedNetwork || !phoneNumber || 
                 (serviceType === 'airtime' && !selectedAmount && !customAmount) ||
                 (serviceType === 'data' && !selectedDataPlan) ||
                 isProcessing) && styles.purchaseButtonDisabled
              ]}
              onPress={handlePurchase}
              disabled={
                !selectedNetwork || !phoneNumber || 
                (serviceType === 'airtime' && !selectedAmount && !customAmount) ||
                (serviceType === 'data' && !selectedDataPlan) ||
                isProcessing
              }
            >
              <Text style={[
                styles.purchaseButtonText,
                (!selectedNetwork || !phoneNumber || 
                 (serviceType === 'airtime' && !selectedAmount && !customAmount) ||
                 (serviceType === 'data' && !selectedDataPlan) ||
                 isProcessing) && styles.purchaseButtonTextDisabled
              ]}>
                {isProcessing ? 'Processing...' : 'Next'}
              </Text>
            </TouchableOpacity>
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
  serviceToggle: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#8B0038',
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#8B0038',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  toggleTextActive: {
    color: '#FFFFFF',
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
  recentNumbers: {
    flexDirection: 'row',
    gap: 16,
  },
  recentContact: {
    alignItems: 'center',
    gap: 8,
  },
  contactAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contactName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  contactNumber: {
    fontSize: 10,
    color: '#999',
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amountButton: {
    width: '30%',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  amountButtonSelected: {
    borderColor: '#8B0038',
    backgroundColor: '#8B0038',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  amountTextSelected: {
    color: '#FFFFFF',
  },
  customAmountContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
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
  dataPlansContainer: {
    gap: 12,
  },
  dataPlanButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  dataPlanButtonSelected: {
    borderColor: '#8B0038',
    backgroundColor: '#8B0038',
  },
  dataPlanInfo: {
    gap: 4,
  },
  dataPlanData: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  dataPlanValidity: {
    fontSize: 12,
    color: '#999',
  },
  dataPlanAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B0038',
  },
  dataPlanTextSelected: {
    color: '#FFFFFF',
  },
  networkGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  networkButton: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#444',
  },
  networkButtonSelected: {
    borderColor: '#8B0038',
  },
  networkIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  networkIconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  networkName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  networkNameSelected: {
    color: '#8B0038',
  },
  phoneNumberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chooseContactButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#8B0038',
  },
  chooseContactText: {
    fontSize: 12,
    color: '#8B0038',
    fontWeight: '600',
  },
  phoneInput: {
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