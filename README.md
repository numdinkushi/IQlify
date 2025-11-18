# IQlify

<div align="center">

![IQlify Logo](https://iqlify.vercel.app/logo.png)

**Master interviews while earning real money**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-iqlify.vercel.app-brightgreen)](https://iqlify.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/numdinkushi/IQlify)
[![Built on Celo](https://img.shields.io/badge/Built%20on-Celo-35D07F)](https://celo.org/)

⚡ AI-powered interview practice platform with cryptocurrency rewards

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Key Features Breakdown](#key-features-breakdown)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Resources](#resources)

---

## 🎯 Overview

IQlify is a cutting-edge, AI-powered interview practice platform that helps users master technical and behavioral interviews while earning real cryptocurrency rewards. Built on the Celo blockchain, IQlify combines gamified learning with instant CELO token payments, making interview preparation both engaging and rewarding.

### What Makes IQlify Unique?

- 🤖 **AI-Powered Interviews**: Real-time conversations with advanced AI interviewers powered by VAPI and Google Gemini
- 💰 **Earn While Learning**: Get paid in CELO tokens for completing interviews and challenges
- 🌍 **Global Accessibility**: Full support for 10 languages (English, Spanish, French, Italian, Portuguese, German, Japanese, Korean, Chinese, Arabic)
- 📊 **Intelligent Grading**: Comprehensive AI-based evaluation with detailed feedback and recommendations
- 🎮 **Gamified Experience**: Streaks, leaderboards, and challenges to keep you motivated
- 🔒 **Web3 Native**: Built on Celo blockchain with wallet integration via RainbowKit

---

## ✨ Features

### 🌐 Multi-Language Support
- **10 Languages**: English, Spanish, French, Italian, Portuguese, German, Japanese, Korean, Chinese, Arabic
- **Full UI Translation**: Every interface element is translated
- **Dynamic Language Switching**: Change language on-the-fly without page reload
- **Localized Content**: Interview questions and feedback adapt to selected language

### 💼 Profile Management
- **Complete Profile Setup**: First name, last name, email, phone number
- **Profile Picture Upload**: Cloudinary integration for image management
- **Skill Level Selection**: Beginner, Intermediate, or Advanced
- **Wallet Integration**: Automatic wallet address linking
- **Profile Customization**: Update profile information anytime

### 🔗 Wallet Connection & Blockchain Integration
- **RainbowKit Integration**: Seamless wallet connection
- **CELO Blockchain**: Native support for CELO network
- **Real-time Balance**: Display wallet balance and transaction history
- **Secure Transactions**: Web3 wallet security standards

### 📊 Home Dashboard
- **Total Earnings Display**: Track your CELO rewards
- **Current Streak Counter**: Daily practice tracking
- **Recent Activity Feed**: View your latest interviews and achievements
- **Quick Actions**: One-click access to start interviews
- **Performance Metrics**: Visual progress indicators

### 🎤 AI-Powered Interview System

#### 5-Step Interview Setup Flow

1. **Skill Level Selection**
   - Choose from Beginner, Intermediate, or Advanced
   - See reward ranges for each level
   - Difficulty indicators and recommendations

2. **Interview Type Selection**
   - **Technical Skills**: Coding challenges, algorithms, problem-solving
   - **Soft Skills**: Communication, teamwork, leadership
   - **Behavioral**: Past experiences, decision-making, situational questions
   - **System Design**: Architecture, scalability, system design challenges
   - View skills covered and estimated duration
   - See base rewards for each type

3. **Duration Selection**
   - **Quick (5 min)**: Perfect for quick skill assessment
   - **Standard (10 min)**: Balanced interview with comprehensive questions
   - **Extended (15 min)**: In-depth technical and behavioral assessment
   - Recommended durations highlighted based on skill level
   - Preparation time included in total session

4. **Equipment Check**
   - Real-time microphone verification
   - Audio output testing
   - Internet connection stability check
   - Browser compatibility verification
   - Automatic issue detection and recommendations

5. **Configuration Summary**
   - Review all selected settings
   - View potential reward calculation
   - Final confirmation before starting

### 🤖 Live Interview Experience
- **Real-time AI Conversation**: Natural, flowing interview experience
- **VAPI Integration**: High-quality voice AI interaction
- **Progress Indicators**: Visual feedback during the interview
- **Session Management**: Pause, resume, and end interview controls

### 📈 Intelligent AI Grading System
- **Comprehensive Scoring**: 0-100 point scale with detailed breakdown
- **Multi-Dimensional Evaluation**:
  - Technical Skills
  - Communication
  - Problem Solving
  - Experience Relevance
  - Cultural Fit
- **AI-Powered Analysis**: Google Gemini integration for deep transcript analysis
- **Detailed Feedback**:
  - Strengths identification
  - Areas for improvement
  - Specific recommendations
  - Hiring recommendation badge (Strong Hire/Hire/Maybe/No Hire)
- **Dynamic Scoring**: Adapts to interview duration, content quality, and participation level
- **Reward Calculation**: CELO token rewards based on performance

### 📚 Interview History
- **Complete Interview Log**: View all past interviews
- **Filter Options**: Filter by status (Completed, In Progress, Cancelled)
- **Quick Access**: One-click access to detailed results
- **Performance Trends**: Track improvement over time
- **Export Options**: Download interview reports

### 💰 Wallet & Earnings Dashboard
- **Total Earnings Summary**: Lifetime CELO earnings
- **Time-based Breakdown**: Today, This Week, This Month earnings
- **Transaction History**: Complete record of all transactions
- **Withdrawal Options**: Easy token withdrawal to wallet
- **Earnings Analytics**: Visual charts and statistics

### 🏆 Leaderboard System
- **Global Rankings**: See where you stand worldwide
- **Current Rank Display**: Your position in real-time
- **Top Performers**: View leaderboard champions
- **Interview Points System**: Earn points for interviews
- **Streak Bonuses**: Extra points for maintaining streaks
- **Share Functionality**: Share achievements on social media

### 🎯 Challenges System
- **Daily Challenges**: New challenges every day
- **Weekly Challenges**: Extended competitions
- **Skill-Specific Challenges**: Targeted practice opportunities
- **Entry Fees & Prize Pools**: Compete for larger rewards
- **Participation Tracking**: Monitor your challenge progress
- **Leaderboard Integration**: See how you rank in challenges

### ⚙️ Settings & Customization
- **Theme Selector**: Switch between Dark and Light modes
- **Language Preferences**: Set default language
- **Account Management**: Update profile and preferences
- **Notification Settings**: Control app notifications (Version 2)
- **Security Settings**: Two-factor authentication (Version 2)

### 🔥 Streak System & Gamification
- **Current Streak Display**: Track consecutive days
- **Streak Bonuses**: Earn extra rewards for maintaining streaks
- **Daily Practice Incentives**: Motivation to practice every day
- **Achievement Tracking**: Unlock achievements and badges
- **Milestone Rewards**: Special rewards for streak milestones

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Internationalization**: next-intl
- **State Management**: React Query (TanStack Query)

### Blockchain & Web3
- **Blockchain**: Celo
- **Wallet Integration**: RainbowKit
- **Web3 Library**: Wagmi & Viem
- **Smart Contracts**: Hardhat

### AI & Voice
- **Voice AI**: VAPI
- **AI Analysis**: Google Gemini (Generative AI)
- **Real-time Processing**: WebSocket connections

### Backend & Database
- **Backend**: Next.js API Routes
- **Database**: Convex
- **File Storage**: Cloudinary

### Development Tools
- **Monorepo**: Turborepo
- **Package Manager**: PNPM
- **Type Checking**: TypeScript
- **Linting**: ESLint

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: >= 18.0.0
- **PNPM**: >= 8.0.0
- **Git**: Latest version

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/numdinkushi/IQlify.git
   cd IQlify
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables** (see [Environment Variables](#environment-variables) section)

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file in the `apps/web` directory with the following variables:

```env
# VAPI Configuration
VAPI_API_KEY=your_vapi_api_key_here
VAPI_TECHNICAL_ASSISTANT_ID=your_technical_assistant_id
VAPI_SOFT_SKILLS_ASSISTANT_ID=your_soft_skills_assistant_id
VAPI_BEHAVIORAL_ASSISTANT_ID=your_behavioral_assistant_id
VAPI_SYSTEM_DESIGN_ASSISTANT_ID=your_system_design_assistant_id
VAPI_WEBHOOK_SECRET=your_webhook_secret_here

# Google Gemini AI Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WEBHOOK_URL=https://your-ngrok-url.ngrok.io

# Convex Configuration
NEXT_PUBLIC_CONVEX_URL=your_convex_url_here
CONVEX_DEPLOY_KEY=your_convex_deploy_key_here

# Cloudinary Configuration (for profile images)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

#### How to Get API Keys

1. **VAPI API Key & Assistant IDs**
   - Sign up at [VAPI Dashboard](https://dashboard.vapi.ai)
   - Navigate to Account Settings to get your API key
   - Go to Assistants section to create or select assistants
   - Copy the Assistant IDs for each interview type

2. **Google Gemini API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy and add to your `.env.local`

3. **Convex Setup**
   - Sign up at [Convex](https://www.convex.dev)
   - Create a new project
   - Copy the deployment URL and deploy key

4. **Cloudinary Setup**
   - Sign up at [Cloudinary](https://cloudinary.com)
   - Get your Cloud Name, API Key, and API Secret from the dashboard

5. **Webhook URL (for local development)**
   - Use [ngrok](https://ngrok.com) or [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/)
   - Run: `ngrok http 3000`
   - Copy the HTTPS URL to `NEXT_PUBLIC_WEBHOOK_URL`

### Running the Application

#### Development Mode

```bash
# Start all services
pnpm dev

# Or start with webhook updates (for VAPI integration)
cd apps/web
pnpm dev:webhook
```

#### Production Build

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

---

## 📁 Project Structure

```
IQlify/
├── apps/
│   ├── web/                    # Next.js web application
│   │   ├── src/
│   │   │   ├── app/            # Next.js app router pages
│   │   │   ├── components/     # React components
│   │   │   ├── lib/            # Utility functions and services
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── providers/      # Context providers
│   │   │   └── messages/      # i18n translation files
│   │   ├── public/             # Static assets
│   │   └── package.json
│   └── contracts/              # Hardhat smart contracts
│       ├── contracts/         # Solidity contracts
│       ├── scripts/           # Deployment scripts
│       └── test/              # Contract tests
├── convex/                     # Convex backend
│   └── users.ts               # User database functions
├── docs/                       # Documentation
├── package.json               # Root package.json
└── turbo.json                 # Turborepo configuration
```

---

## 📜 Available Scripts

### Root Level Scripts

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all packages and apps
- `pnpm lint` - Lint all packages and apps
- `pnpm type-check` - Run TypeScript type checking
- `pnpm clean` - Clean all build artifacts

### Smart Contract Scripts

- `pnpm contracts:compile` - Compile smart contracts
- `pnpm contracts:test` - Run smart contract tests
- `pnpm contracts:deploy` - Deploy contracts to local network
- `pnpm contracts:deploy:alfajores` - Deploy to Celo Alfajores testnet
- `pnpm contracts:deploy:celo` - Deploy to Celo mainnet

### Web App Scripts (in `apps/web`)

- `pnpm dev` - Start Next.js development server
- `pnpm dev:webhook` - Start dev server with webhook updates
- `pnpm build` - Build Next.js application
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking

---

## 🔑 Key Features Breakdown

### AI-Powered Interview Flow

1. **User selects interview parameters** (skill level, type, duration)
2. **Equipment check** ensures microphone and audio are working
3. **VAPI initiates call** with appropriate AI assistant
4. **Real-time conversation** between user and AI interviewer
5. **Transcript captured** during the interview
6. **Gemini AI analyzes** the transcript for comprehensive evaluation
7. **Intelligent grading system** calculates final score (0-100)
8. **Detailed feedback** provided with strengths and improvements
9. **CELO rewards** calculated and distributed based on performance

### Intelligent Grading System

The grading system combines multiple factors:

- **AI Analysis (30%)**: Google Gemini's deep transcript analysis
- **Duration Completion (30%)**: How much of the expected duration was completed
- **Content Quality (40%)**: Word count, message frequency, engagement level
- **Participation Quality**: Response quality, engagement metrics
- **Completion Multiplier**: Bonus for completing full interviews

### Multi-Language Support

- All UI elements are translated
- Interview questions adapt to selected language
- Feedback and recommendations are localized
- Language switching is instant and seamless

---

## 🔌 API Integration

### VAPI Integration

IQlify uses VAPI for real-time voice AI interviews. The integration includes:

- **Assistant Management**: Different assistants for each interview type
- **Webhook Handling**: Real-time event processing
- **Call Management**: Start, monitor, and end interview calls
- **Transcript Processing**: Automatic transcript capture and analysis

### Google Gemini Integration

Gemini AI powers the intelligent grading system:

- **Transcript Analysis**: Deep analysis of interview conversations
- **Skill Assessment**: Evaluation across multiple dimensions
- **Feedback Generation**: Detailed, actionable feedback
- **Score Calculation**: AI-powered scoring with explanations

### Convex Database

Convex provides the backend database:

- **User Management**: Profile, earnings, streaks
- **Interview Records**: Complete interview history
- **Leaderboard**: Real-time rankings
- **Challenges**: Challenge data and participation

---

## 🚢 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add all environment variables
   - Deploy

3. **Update Webhook URL**
   - Update `NEXT_PUBLIC_WEBHOOK_URL` in Vercel environment variables
   - Use your Vercel deployment URL

### Manual Deployment

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📚 Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Celo Documentation](https://docs.celo.org/)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [VAPI Documentation](https://docs.vapi.ai/)
- [Google Gemini Documentation](https://ai.google.dev/docs)
- [Convex Documentation](https://docs.convex.dev/)

### Links
- **Live Demo**: [https://iqlify.vercel.app/](https://iqlify.vercel.app/)
- **GitHub Repository**: [https://github.com/numdinkushi/IQlify](https://github.com/numdinkushi/IQlify)
- **Celo Network**: [https://celo.org/](https://celo.org/)

### Support
- **Issues**: [GitHub Issues](https://github.com/numdinkushi/IQlify/issues)
- **Discussions**: [GitHub Discussions](https://github.com/numdinkushi/IQlify/discussions)

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with ❤️ on Celo**

[⭐ Star on GitHub](https://github.com/numdinkushi/IQlify) | [🌐 Live Demo](https://iqlify.vercel.app/) | [📖 Documentation](./docs)

</div>
