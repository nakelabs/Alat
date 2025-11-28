// Demo user account with full banking data
export const demoUser = {
  name: 'John Doe',
  firstName: 'John',
  email: 'johndoe@gmail.com',
  password: '12345678',
  balance: 2200019.82,
  currency: '₦',
  transactions: {
    sent: 12,
    received: 11,
    pending: 0,
    failed: 1,
  },
  recentTransactions: [
    {
      id: 1,
      type: 'debit',
      amount: 5490.00,
      recipientName: 'Adegbite, Oyinkonsolami David',
      time: '05:14 pm',
      date: '27 Nov 2025',
      avatar: 'A',
      avatarColor: '#9966CC',
      status: 'successful',
      category: 'transfer_to',
      description: 'Money Transfer'
    },
    {
      id: 2,
      type: 'credit',
      amount: 5500.00,
      senderName: 'Plain Savings',
      time: '05:14 pm',
      date: '27 Nov 2025',
      avatar: 'P',
      avatarColor: '#9966CC',
      status: 'successful',
      category: 'owealth',
      description: 'OWealth Interest Earned'
    },
    {
      id: 3,
      type: 'debit',
      amount: 400.00,
      recipientName: 'Sunday Boniface Momoh',
      time: '01:50 pm',
      date: '27 Nov 2025',
      avatar: 'S',
      avatarColor: '#FF4B6E',
      status: 'successful',
      category: 'transfer_to',
      description: 'Money Transfer'
    },
    {
      id: 4,
      type: 'credit',
      amount: 12000.00,
      senderName: 'Michael Johnson',
      time: '11:30 am',
      date: '26 Nov 2025',
      avatar: 'M',
      avatarColor: '#6B5B95',
      status: 'successful',
      category: 'bank_deposit',
      description: 'Bank Deposit'
    },
    {
      id: 5,
      type: 'debit',
      amount: 2500.00,
      recipientName: 'Sarah Williams',
      time: '09:45 am',
      date: '26 Nov 2025',
      avatar: 'S',
      avatarColor: '#8B0038',
      status: 'successful',
      category: 'transfer_to',
      description: 'Money Transfer'
    },
    {
      id: 6,
      type: 'debit',
      amount: 900.00,
      recipientName: 'MTN Nigeria',
      time: '08:30 pm',
      date: '26 Nov 2025',
      avatar: 'M',
      avatarColor: '#FFCC00',
      status: 'successful',
      category: 'mobile_data',
      description: 'Mobile Data Purchase'
    },
    {
      id: 7,
      type: 'debit',
      amount: 200.00,
      recipientName: 'Airtel Nigeria',
      time: '02:15 pm',
      date: '26 Nov 2025',
      avatar: 'A',
      avatarColor: '#FF0000',
      status: 'successful',
      category: 'airtime',
      description: 'Airtime Purchase'
    },
    {
      id: 8,
      type: 'debit',
      amount: 5000.00,
      recipientName: 'AEDC Electricity',
      time: '11:20 am',
      date: '25 Nov 2025',
      avatar: 'E',
      avatarColor: '#FF9500',
      status: 'successful',
      category: 'electricity',
      description: 'Electricity Bill Payment'
    },
    {
      id: 9,
      type: 'credit',
      amount: 50000.00,
      senderName: 'Salary Payment',
      time: '09:00 am',
      date: '25 Nov 2025',
      avatar: 'S',
      avatarColor: '#4CAF50',
      status: 'successful',
      category: 'bank_deposit',
      description: 'Salary Credit'
    },
    {
      id: 10,
      type: 'debit',
      amount: 1500.00,
      recipientName: 'Netflix Subscription',
      time: '07:45 pm',
      date: '24 Nov 2025',
      avatar: 'N',
      avatarColor: '#E50914',
      status: 'pending',
      category: 'online_payment',
      description: 'Subscription Payment'
    },
    {
      id: 11,
      type: 'debit',
      amount: 3200.00,
      recipientName: 'Amazon Purchase',
      time: '03:30 pm',
      date: '24 Nov 2025',
      avatar: 'A',
      avatarColor: '#FF9900',
      status: 'failed',
      category: 'online_payment',
      description: 'Online Shopping'
    },
    {
      id: 12,
      type: 'credit',
      amount: 15000.00,
      senderName: 'Freelance Payment',
      time: '12:00 pm',
      date: '24 Nov 2025',
      avatar: 'F',
      avatarColor: '#2196F3',
      status: 'successful',
      category: 'transfer_from',
      description: 'Payment Received'
    },
    {
      id: 13,
      type: 'debit',
      amount: 800.00,
      recipientName: 'Uber Trip',
      time: '06:15 pm',
      date: '23 Nov 2025',
      avatar: 'U',
      avatarColor: '#000000',
      status: 'successful',
      category: 'opay_card_payment',
      description: 'Transportation'
    },
    {
      id: 14,
      type: 'credit',
      amount: 25000.00,
      senderName: 'Investment Return',
      time: '10:30 am',
      date: '23 Nov 2025',
      avatar: 'I',
      avatarColor: '#9C27B0',
      status: 'successful',
      category: 'owealth',
      description: 'Investment Maturity'
    },
    {
      id: 15,
      type: 'debit',
      amount: 1200.00,
      recipientName: 'Glo Nigeria',
      time: '04:45 pm',
      date: '22 Nov 2025',
      avatar: 'G',
      avatarColor: '#00B04F',
      status: 'successful',
      category: 'mobile_data',
      description: 'Data Bundle Purchase'
    },
    {
      id: 16,
      type: 'debit',
      amount: 750.00,
      recipientName: 'POS Withdrawal',
      time: '01:20 pm',
      date: '22 Nov 2025',
      avatar: 'P',
      avatarColor: '#607D8B',
      status: 'successful',
      category: 'cash_withdraw',
      description: 'POS Cash Withdrawal'
    },
    {
      id: 17,
      type: 'credit',
      amount: 8500.00,
      senderName: 'Gift Payment',
      time: '11:15 am',
      date: '21 Nov 2025',
      avatar: 'G',
      avatarColor: '#FF6B6B',
      status: 'successful',
      category: 'gift_card',
      description: 'Gift Card Redemption'
    },
    {
      id: 18,
      type: 'debit',
      amount: 2200.00,
      recipientName: 'DStv Subscription',
      time: '08:00 pm',
      date: '20 Nov 2025',
      avatar: 'D',
      avatarColor: '#FF5722',
      status: 'pending',
      category: 'tv',
      description: 'TV Subscription'
    },
    {
      id: 19,
      type: 'credit',
      amount: 450.00,
      senderName: 'Cashback Reward',
      time: '02:30 pm',
      date: '20 Nov 2025',
      avatar: 'C',
      avatarColor: '#4CAF50',
      status: 'successful',
      category: 'add_money',
      description: 'Cashback Credit'
    },
    {
      id: 20,
      type: 'debit',
      amount: 120.00,
      recipientName: 'SMS Bundle',
      time: '09:45 am',
      date: '19 Nov 2025',
      avatar: 'S',
      avatarColor: '#795548',
      status: 'failed',
      category: 'sms_subscription',
      description: 'SMS Package'
    },
    {
      id: 21,
      type: 'credit',
      amount: 0.60,
      senderName: 'OWealth Interest',
      time: '01:29 am',
      date: '28 Nov 2025',
      avatar: '%',
      avatarColor: '#9966CC',
      status: 'successful',
      category: 'owealth',
      description: 'Daily Interest'
    },
    {
      id: 22,
      type: 'credit',
      amount: 9.00,
      senderName: 'Data Bonus',
      time: '11:23 pm',
      date: '27 Nov 2025',
      avatar: 'D',
      avatarColor: '#00B04F',
      status: 'successful',
      category: 'mobile_data',
      description: 'Bonus from Data Purchase'
    }
  ],
  blogPosts: [
    {
      id: 1,
      title: 'Welcome To Wema Bank Get Started',
      subtitle: 'Let us get you started on your banking journey with us',
      category: 'Welcome',
      gradient: ['#8B0038', '#6B5B95'],
      icon: '🏦',
      image: 'welcome',
      readTime: '5 min read',
      author: 'Wema Bank Team',
      publishDate: '28 Nov 2024',
      content: `Welcome to Wema Bank! We're excited to have you join our family of over 4 million customers who trust us with their financial needs.

**Getting Started with Your Account**

Your new Wema Bank account opens doors to a world of financial possibilities. Here's what you can do:

• **Digital Banking**: Access your account 24/7 through our mobile app and internet banking platform
• **Transfer Money**: Send money instantly to any bank in Nigeria using our ALAT platform
• **Bill Payments**: Pay for utilities, airtime, data, and subscriptions with ease
• **Savings Goals**: Set up automated savings to reach your financial targets
• **Investment Options**: Grow your money with our OWealth investment products

**Security First**

Your security is our priority. We use:
• Multi-factor authentication
• 256-bit SSL encryption
• Real-time transaction monitoring
• Instant SMS/email alerts

**24/7 Customer Support**

Need help? We're here for you:
• In-app chat support
• Call center: 0700-WEMA-BANK
• Email: customercare@wemabank.com
• Visit any of our 150+ branches nationwide

**Next Steps**

1. Download the ALAT app for the best mobile banking experience
2. Set up your transaction PIN
3. Link your BVN for enhanced security
4. Explore our savings and investment products

Welcome aboard! Let's build your financial future together.`
    },
    {
      id: 2,
      title: 'Money Lessons From Afrobeats',
      subtitle: 'Are you really listening to what they\'re saying?',
      category: 'Finance',
      gradient: ['#00C4CC', '#0080CC'],
      icon: '🎵',
      image: 'music',
      readTime: '8 min read',
      author: 'Financial Education Team',
      publishDate: '25 Nov 2024',
      content: `Afrobeats isn't just about the rhythm and melody – it's packed with financial wisdom! From Burna Boy to Wizkid, our favorite artists are dropping knowledge about money, success, and financial planning.

**"No go do yahoo yahoo" - Financial Integrity**

Many Afrobeats songs emphasize the importance of legitimate wealth. Artists consistently promote:
• Hard work over shortcuts
• Building sustainable income streams
• Maintaining financial integrity
• Long-term thinking over quick gains

**"Money no be problem" - Abundance Mindset**

Afrobeats teaches us about having an abundance mindset:
• Believe in your ability to create wealth
• Think big and dream bigger
• Multiple streams of income
• Invest in yourself and your skills

**"Save money, spend money" - Balance**

The music industry shows us the importance of balance:
• **Save First**: Build an emergency fund (3-6 months expenses)
• **Invest Wisely**: Don't put all money in one basket
• **Spend Consciously**: Enjoy life but within your means
• **Give Back**: Support your community and family

**Lessons from Top Artists**

**Davido**: "We rise by lifting others" - Shows the importance of community investment and giving back.

**Burna Boy**: "Another story" - Emphasizes creating your own narrative through financial independence.

**Wizkid**: "More love, less ego" - Teaches us to make smart money decisions without ego.

**Apply These Lessons**

1. **Start Small**: Even ₦1,000 monthly savings can grow significantly
2. **Diversify**: Don't rely on one income source
3. **Educate Yourself**: Learn about investments, cryptocurrency, real estate
4. **Network**: Build relationships that can create opportunities
5. **Stay Consistent**: Success comes from daily financial habits

**Wema Bank's OWealth Platform**

Start your investment journey with as little as ₦10,000:
• Treasury bills
• Fixed deposits
• Mutual funds
• Dollar investments

The next time you vibe to Afrobeats, listen closely – your favorite artists might just be giving you the blueprint to financial freedom!`
    },
    {
      id: 3,
      title: 'The Complete Guide To Investment',
      subtitle: 'Everything you need to know about smart investing.',
      category: 'Investment',
      gradient: ['#9966CC', '#6B5B95'],
      icon: '📈',
      image: 'investment',
      readTime: '12 min read',
      author: 'Investment Advisory Team',
      publishDate: '22 Nov 2024',
      content: `Investing can seem intimidating, but it's the most effective way to build long-term wealth. This comprehensive guide will take you from beginner to confident investor.

**Why Invest?**

Inflation in Nigeria averages 15-20% annually. If your money isn't growing faster than inflation, you're actually losing purchasing power. Investing helps you:
• Beat inflation
• Build wealth for the future
• Create passive income streams
• Achieve financial freedom

**Investment Fundamentals**

**1. Risk vs Return**
Higher potential returns usually come with higher risk. Understanding your risk tolerance is crucial:
• **Conservative**: Treasury bills, fixed deposits (8-15% returns)
• **Moderate**: Mutual funds, corporate bonds (12-20% returns)
• **Aggressive**: Stocks, REITs (15-35% returns, high volatility)

**2. Diversification**
Never put all eggs in one basket:
• Mix different asset classes
• Invest across various sectors
• Consider both local and international markets
• Balance short-term and long-term investments

**3. Time Horizon**
Your investment timeline affects your strategy:
• **Short-term (1-3 years)**: Money market funds, treasury bills
• **Medium-term (3-7 years)**: Bonds, balanced mutual funds
• **Long-term (7+ years)**: Stocks, equity funds, real estate

**Investment Options in Nigeria**

**1. Treasury Bills & Bonds**
• Government-backed (safest)
• Current rates: 8-18%
• Minimum: ₦50,000
• Available through Wema Bank

**2. Fixed Deposits**
• Bank-guaranteed returns
• Rates: 8-15% depending on tenure
• Minimum: ₦100,000
• Flexible terms: 30 days to 1 year

**3. Mutual Funds**
• Professionally managed portfolios
• Money market funds: 10-15%
• Equity funds: 15-25%
• Minimum: ₦10,000

**4. Stocks**
• Buy shares in Nigerian companies
• Potential for high returns
• Requires research and monitoring
• Consider blue-chip stocks: Dangote, MTN, GTBank

**5. Real Estate Investment Trusts (REITs)**
• Invest in real estate without buying property
• Dividend yields: 8-15%
• Listed on Nigerian Exchange

**6. Dollar Investments**
• Hedge against Naira devaluation
• USD fixed deposits: 3-6%
• International mutual funds
• Domiciliary account required

**Getting Started: Your Investment Action Plan**

**Step 1: Set Clear Goals**
• Emergency fund (3-6 months expenses)
• Retirement planning
• Children's education
• Home purchase
• Business capital

**Step 2: Determine Your Risk Profile**
Ask yourself:
• How much money can I afford to lose?
• When will I need this money?
• How comfortable am I with market volatility?

**Step 3: Start Small and Consistent**
• Begin with ₦10,000-50,000
• Set up automatic monthly investments
• Increase contributions as income grows
• Reinvest dividends and interest

**Step 4: Educate Yourself**
• Read financial news regularly
• Follow market trends
• Understand basic financial ratios
• Join investment communities

**Common Investment Mistakes to Avoid**

1. **Emotional Investing**: Don't panic sell during market downturns
2. **Trying to Time the Market**: Consistent investing beats market timing
3. **Lack of Diversification**: Spread your investments
4. **Not Starting Early**: Time is your greatest investment asset
5. **Following Hot Tips**: Do your own research
6. **Ignoring Fees**: High fees can eat into returns
7. **Not Having a Plan**: Set clear goals and stick to them

**Wema Bank's OWealth Platform**

Make investing simple with OWealth:
• **Easy Account Opening**: Start in minutes
• **Low Minimum**: Begin with just ₦10,000
• **Multiple Options**: Treasury bills, mutual funds, fixed deposits
• **Real-time Tracking**: Monitor investments 24/7
• **Professional Support**: Dedicated relationship managers
• **Competitive Returns**: Up to 20% annually

**Sample Investment Portfolio for a 30-year-old**

• **40%** - Equity mutual funds (long-term growth)
• **30%** - Treasury bills/bonds (stability)
• **20%** - Fixed deposits (liquidity)
• **10%** - Dollar investments (diversification)

**The Power of Compound Interest**

Investing ₦50,000 monthly at 15% annual return:
• After 5 years: ₦4.3 million
• After 10 years: ₦12.3 million
• After 20 years: ₦63.7 million

Start today – your future self will thank you!

**Next Steps**
1. Open an OWealth account
2. Set up your first investment
3. Schedule monthly contributions
4. Review and rebalance quarterly

Remember: Investing is a marathon, not a sprint. Stay consistent, stay informed, and watch your wealth grow!`
    }
  ],
  accounts: [
    {
      id: 1,
      name: 'Primary Account',
      balance: 2200019.82,
      type: 'Savings',
    },
  ],
};

// Function to process transfer (reduce balance)
export const processTransfer = (amount) => {
  if (amount > demoUser.balance) {
    return {
      success: false,
      message: 'Insufficient balance',
      currentBalance: demoUser.balance,
    };
  }
  
  demoUser.balance -= amount;
  demoUser.transactions.sent += 1;
  
  return {
    success: true,
    message: 'Transfer successful',
    newBalance: demoUser.balance,
    transactionCount: demoUser.transactions.sent,
  };
};

// Function to receive money (increase balance)
export const receiveTransfer = (amount) => {
  demoUser.balance += amount;
  demoUser.transactions.received += 1;
  
  return {
    success: true,
    message: 'Transfer received',
    newBalance: demoUser.balance,
    transactionCount: demoUser.transactions.received,
  };
};

// Function to add new transaction to recent transactions
export const addTransaction = (transactionData) => {
  const newTransaction = {
    id: Date.now(), // Use timestamp as unique ID
    type: 'debit', // Most chatbot transactions are outgoing
    amount: transactionData.amount,
    recipientName: transactionData.recipientName || 'Unknown Recipient',
    time: new Date().toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    date: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }),
    avatar: transactionData.recipientName ? transactionData.recipientName.charAt(0).toUpperCase() : 'U',
    avatarColor: getRandomAvatarColor()
  };
  
  // Add to the beginning of recent transactions
  demoUser.recentTransactions.unshift(newTransaction);
  
  // Keep only the 10 most recent transactions
  if (demoUser.recentTransactions.length > 10) {
    demoUser.recentTransactions = demoUser.recentTransactions.slice(0, 10);
  }
  
  return newTransaction;
};

// Helper function to get random avatar colors
const getRandomAvatarColor = () => {
  const colors = ['#9966CC', '#FF4B6E', '#6B5B95', '#8B0038', '#00C4CC', '#0080CC', '#FF6B35', '#4ECDC4'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Function to process a complete transaction (deduct + add to history)
export const processCompleteTransaction = (transactionData) => {
  const { amount, recipientName, description } = transactionData;
  
  // First, try to process the transfer
  const transferResult = processTransfer(amount);
  
  if (!transferResult.success) {
    return transferResult;
  }
  
  // If transfer successful, add to transaction history
  const newTransaction = addTransaction({
    amount,
    recipientName,
    description
  });
  
  return {
    success: true,
    message: 'Transaction completed successfully',
    newBalance: transferResult.newBalance,
    transaction: newTransaction,
    transactionCount: transferResult.transactionCount
  };
};
