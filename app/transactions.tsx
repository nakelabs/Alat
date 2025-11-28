import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { demoUser } from '../data/demoUser';

interface Transaction {
  id: number;
  type: 'credit' | 'debit';
  amount: number;
  recipientName?: string;
  senderName?: string;
  time: string;
  date: string;
  avatar: string;
  avatarColor: string;
  status: 'successful' | 'pending' | 'failed';
  category: string;
  description: string;
}

interface FilterOption {
  value: string;
  label: string;
}

const categoryOptions: FilterOption[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'transfer_to', label: 'Transfer To' },
  { value: 'transfer_from', label: 'Transfer From' },
  { value: 'bank_deposit', label: 'Add Money' },
  { value: 'airtime', label: 'Airtime' },
  { value: 'mobile_data', label: 'Mobile Data' },
  { value: 'electricity', label: 'Electricity' },
  { value: 'online_payment', label: 'Online Payment' },
  { value: 'tv', label: 'TV Subscription' },
  { value: 'gift_card', label: 'Gift Card' },
  { value: 'cash_withdraw', label: 'Cash Withdraw' },
  { value: 'card_payment', label: 'Card Payment' },
  { value: 'add_money', label: 'Cashback' },
  { value: 'sms_subscription', label: 'SMS' },
];

const statusOptions: FilterOption[] = [
  { value: 'all', label: 'All Status' },
  { value: 'successful', label: 'Successful' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const slideAnim = new Animated.Value(300);

  useEffect(() => {
    // Load transactions from demo user
    const userTransactions = demoUser.recentTransactions || [];
    setTransactions(userTransactions as Transaction[]);
    setFilteredTransactions(userTransactions as Transaction[]);
    
    // Animate page entrance
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [selectedCategory, selectedStatus, transactions]);

  const filterTransactions = () => {
    let filtered = transactions;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(transaction => transaction.category === selectedCategory);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === selectedStatus);
    }

    setFilteredTransactions(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful': return '#4CAF50';
      case 'pending': return '#FF9500';
      case 'failed': return '#F44336';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'successful': return 'checkmark-circle';
      case 'pending': return 'time';
      case 'failed': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const formatAmount = (amount: number, type: string) => {
    const sign = type === 'credit' ? '+' : '-';
    return `${sign}₦${amount.toLocaleString()}`;
  };

  const handleCategorySelect = (value: string) => {
    setSelectedCategory(value);
    setShowCategoryDropdown(false);
  };

  const handleStatusSelect = (value: string) => {
    setSelectedStatus(value);
    setShowStatusDropdown(false);
  };

  const renderDropdown = (
    options: FilterOption[],
    selectedValue: string,
    onSelect: (value: string) => void,
    show: boolean
  ) => {
    if (!show) return null;

    return (
      <View style={styles.dropdown}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.dropdownItem,
              selectedValue === option.value && styles.dropdownItemSelected
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text style={[
              styles.dropdownText,
              selectedValue === option.value && styles.dropdownTextSelected
            ]}>
              {option.label}
            </Text>
            {selectedValue === option.value && (
              <Ionicons name="checkmark" size={16} color="#8B0038" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
          <Text style={styles.avatarText}>{item.avatar}</Text>
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionName}>
            {item.type === 'credit' ? item.senderName : item.recipientName}
          </Text>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          <Text style={styles.transactionTime}>{item.time} • {item.date}</Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <View style={styles.statusRow}>
          <Ionicons
            name={getStatusIcon(item.status)}
            size={14}
            color={getStatusColor(item.status)}
          />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
        <Text style={[
          styles.transactionAmount,
          { color: item.type === 'credit' ? '#4CAF50' : '#F44336' }
        ]}>
          {formatAmount(item.amount, item.type)}
        </Text>
      </View>
    </View>
  );

  const getCategoryLabel = (value: string) => {
    return categoryOptions.find(option => option.value === value)?.label || 'All Categories';
  };

  const getStatusLabel = (value: string) => {
    return statusOptions.find(option => option.value === value)?.label || 'All Status';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction History</Text>
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Filter Transactions</Text>
        
        <View style={styles.filterRow}>
          {/* Category Filter */}
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              setShowCategoryDropdown(!showCategoryDropdown);
              setShowStatusDropdown(false);
            }}
          >
            <Text style={styles.filterButtonText}>
              {getCategoryLabel(selectedCategory)}
            </Text>
            <Ionicons 
              name={showCategoryDropdown ? "chevron-up" : "chevron-down"} 
              size={16} 
              color="#FFF" 
            />
          </TouchableOpacity>

          {/* Status Filter */}
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              setShowStatusDropdown(!showStatusDropdown);
              setShowCategoryDropdown(false);
            }}
          >
            <Text style={styles.filterButtonText}>
              {getStatusLabel(selectedStatus)}
            </Text>
            <Ionicons 
              name={showStatusDropdown ? "chevron-up" : "chevron-down"} 
              size={16} 
              color="#FFF" 
            />
          </TouchableOpacity>
        </View>

        {/* Dropdowns */}
        {renderDropdown(categoryOptions, selectedCategory, handleCategorySelect, showCategoryDropdown)}
        {renderDropdown(statusOptions, selectedStatus, handleStatusSelect, showStatusDropdown)}
      </View>

      {/* Results Summary */}
      <View style={styles.summarySection}>
        <Text style={styles.summaryText}>
          Showing {filteredTransactions.length} of {transactions.length} transactions
        </Text>
      </View>

      {/* Transactions List */}
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id.toString()}
        style={styles.transactionsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color="#666" />
            <Text style={styles.emptyStateText}>No transactions found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your filters to see more results
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B0038',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFF',
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 0,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3a3a3a',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#8B0038',
  },
  filterButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    top: 90,
    left: 20,
    right: 20,
    backgroundColor: '#3a3a3a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#8B0038',
    maxHeight: 300,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4a4a4a',
  },
  dropdownItemSelected: {
    backgroundColor: '#8B003810',
  },
  dropdownText: {
    color: '#FFF',
    fontSize: 14,
    flex: 1,
  },
  dropdownTextSelected: {
    color: '#8B0038',
    fontWeight: '600',
  },
  summarySection: {
    paddingHorizontal: 20,
    paddingVertical: 3,
  },
  summaryText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3a3a3a',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4a4a4a',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionDescription: {
    color: '#CCC',
    fontSize: 14,
    marginBottom: 2,
  },
  transactionTime: {
    color: '#999',
    fontSize: 12,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
