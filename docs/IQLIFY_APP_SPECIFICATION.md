# IQlify - Mobile Interview Platform Specification

## 📋 **Project Overview**

**Mission**: Create a mobile-first interview platform where users master interview skills while earning real money through CELO payments via MiniPay integration.

**Target Market**: Job seekers in emerging markets who need both skill development AND immediate income.

**Unique Value Proposition**: "Master interviews while earning real money" - The only platform where interview skills literally pay for themselves.

---

## 🎯 **Core Features & Implementation Status**

### **✅ COMPLETED**
- [x] **MiniPay Integration**: Wallet connection and user authentication
- [x] **UI/UX Design**: Gold theme with dark background matching logo
- [x] **Responsive Design**: Mobile-first approach optimized for MiniPay
- [x] **Wallet Provider**: Wagmi + RainbowKit with custom gold theming
- [x] **User Balance Display**: Shows wallet address, phone number, token balances
- [x] **Navigation**: Top navbar with logo and connect wallet functionality

### **🚧 IN PROGRESS**
- [ ] **Bottom Tab Navigation**: 5-tab mobile interface
- [ ] **User Registration**: Profile creation with skill assessment

### **📋 TODO - Phase 1 (MVP)**
- [ ] **Home/Dashboard Tab**: User stats, recent activity, quick actions
- [ ] **Challenges Tab**: Daily skill challenges and competitions
- [ ] **Interview Tab**: AI-powered interview simulations using VAPI
- [ ] **Wallet/Earn Tab**: Earnings dashboard and transaction history
- [ ] **Leaderboard Tab**: Rankings and social features

---

## 📱 **Bottom Tab Navigation Structure**

### **1. 🏠 Home/Dashboard**
**Purpose**: Central hub with personalized content and quick actions

**Features**:
- [ ] User earnings summary (total earned, this week, this month)
- [ ] Recent activity feed (last interviews, achievements)
- [ ] Quick stats (interviews completed, current rank, streak count)
- [ ] "Start Interview" prominent CTA button
- [ ] Daily/weekly challenges preview
- [ ] Skill level progress indicators

**Status**: ⏳ Pending

### **2. 🎯 Challenges**
**Purpose**: Gamified skill development through competitions

**Features**:
- [ ] Daily skill challenges (React, Node.js, JavaScript, etc.)
- [ ] Time-limited competitions
- [ ] Challenge leaderboards
- [ ] Entry fee system (1-10 CELO based on skill level)
- [ ] Prize pool distribution
- [ ] Challenge history and performance analytics

**Status**: ⏳ Pending

### **3. 🎤 Interview**
**Purpose**: Core interview functionality using AI

**Features**:
- [ ] AI-powered mock interviews (VAPI integration)
- [ ] Interview history and analytics
- [ ] Skill assessments
- [ ] Interview preparation tools
- [ ] Performance scoring system
- [ ] Interview recording and playback

**Status**: ⏳ Pending

### **4. 💰 Wallet/Earn**
**Purpose**: Financial dashboard and earnings management

**Features**:
- [ ] Earnings dashboard (total, weekly, monthly)
- [ ] Transaction history
- [ ] Withdrawal options (MiniPay integration)
- [ ] Referral rewards system
- [ ] Achievement badges with rewards
- [ ] Earnings goals and progress tracking

**Status**: ⏳ Pending

### **5. 🏆 Leaderboard**
**Purpose**: Social competition and community features

**Features**:
- [ ] Global rankings
- [ ] Skill-specific leaderboards
- [ ] Weekly/monthly competitions
- [ ] Social features (follow other users)
- [ ] Achievement showcase
- [ ] Community challenges

**Status**: ⏳ Pending

---

## 💰 **Monetization Model**

### **Revenue Streams**

**1. Registration Fees (Primary)**
- **Amount**: 3 CELO per user registration
- **Purpose**: Entry into daily prize pools
- **Platform Fee**: 20% of all registration fees

**2. Challenge Entry Fees**
- **Beginner**: 1 CELO entry fees
- **Intermediate**: 3 CELO entry fees  
- **Advanced**: 10 CELO entry fees
- **Platform Fee**: 20% of all entry fees

**3. Premium Features (Future)**
- Advanced analytics
- AI feedback reports
- Priority challenge access
- Custom interview scenarios

### **Money Flow**
```
Registration/Entry Fees → Daily Pool → Performance Rewards → Platform Fee (20%)
```

### **Example Daily Economics**
- 100 users register @ 3 CELO = 300 CELO pool
- Platform keeps 60 CELO (20%)
- 240 CELO distributed to top performers
- Top 20 users get rewards (10-50 CELO each)

---

## 🎮 **User Engagement Strategy**

### **Daily Engagement Loop**
1. **Morning**: User pays 3 CELO registration fee
2. **Day**: Multiple interview challenges available
3. **Evening**: Top performers split the daily pool
4. **Night**: Results and rankings update

### **Streak System**
- **7-day streak**: 2x earnings multiplier
- **30-day streak**: 5x earnings multiplier
- **Streak notifications**: "Your streak will break!" reminders
- **Social pressure**: Friends can see streak status

### **Skill Progression**
- **Beginner Level**: Access to 1 CELO challenges
- **Intermediate Level**: Access to 3 CELO challenges
- **Advanced Level**: Access to 10 CELO challenges
- **Skill Certification**: Verified badges for completed skill tracks

---

## 🔧 **Technical Implementation**

### **Frontend Stack**
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom IQlify theme
- **UI Components**: Custom components with gold branding
- **State Management**: React hooks and context

### **Blockchain Integration**
- **Wallet**: MiniPay integration via Wagmi
- **Network**: Celo blockchain
- **Tokens**: CELO, cUSD, USDC, USDT support
- **Transactions**: MiniPay's sub-cent fees

### **AI Integration**
- **VAPI**: Voice AI for interview simulations
- **Gemini**: AI for question generation and evaluation
- **Real-time**: Live interview assessment and scoring

### **Database Requirements**
- **User Profiles**: Wallet address, skills, performance history
- **Interview Data**: Questions, answers, scores, feedback
- **Financial Data**: Earnings, transactions, prize distributions
- **Leaderboards**: Rankings, achievements, social connections

---

## 📊 **Success Metrics**

### **User Engagement**
- Daily active users (DAU)
- Average session duration
- Challenge completion rate
- Streak maintenance rate

### **Financial Metrics**
- Total registration fees collected
- Average earnings per user
- Platform revenue (20% fees)
- User retention rate

### **Skill Development**
- Interview performance improvement over time
- Skill level progression rate
- Certification completion rate
- User satisfaction scores

---

## 🚀 **Development Roadmap**

### **Phase 1: MVP (Hackathon)**
- [ ] Bottom tab navigation implementation
- [ ] Basic interview functionality with VAPI
- [ ] Simple challenge system
- [ ] Wallet integration and basic earnings
- [ ] Leaderboard system

### **Phase 2: Enhancement**
- [ ] Advanced AI features
- [ ] Social features and community
- [ ] Premium subscription model
- [ ] Mobile app optimization

### **Phase 3: Scale**
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Enterprise features
- [ ] Global expansion

---

## 📝 **Notes & Decisions**

### **Key Design Decisions**
1. **Single User Type**: Only candidates, no company accounts (simplified)
2. **Performance-Based Rewards**: Top performers earn more
3. **Daily Competition Model**: Creates daily engagement
4. **MiniPay-First**: Optimized for mobile and emerging markets
5. **Gold Theme**: Professional yet engaging visual identity

### **Technical Considerations**
- VAPI integration for realistic interview simulations
- Real-time scoring and feedback system
- Secure financial transactions via MiniPay
- Scalable database design for user and financial data

---

**Last Updated**: December 2024
**Version**: 1.0
**Status**: Development Phase
