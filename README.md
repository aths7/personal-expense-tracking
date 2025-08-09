# 🎮 Personal Expense Tracker with Gamification

A modern, gamified personal expense tracking application built with Next.js 15, React 19, and Supabase. Turn your expense management into an engaging experience with characters, achievements, challenges, and rewards!

## ✨ Features

### 💰 Core Expense Management
- **Expense Tracking**: Add, edit, and categorize your expenses with ease
- **Category Management**: Custom categories with colors and icons
- **Interactive Charts**: Visualize your spending patterns with beautiful charts
- **Budget Goals**: Set and track monthly/weekly/daily budget targets
- **Expense Analytics**: Detailed insights and spending predictions

### 🎯 Gamification System
- **Character System**: Choose and customize your virtual companion
  - Multiple character options with unique personalities
  - Character accessories and customization options
  - Dynamic character moods based on spending behavior
- **Achievement System**: Unlock badges and rewards for good financial habits
  - Budget achievement badges
  - Spending streak rewards
  - Category-specific achievements
- **Challenge System**: Participate in time-limited financial challenges
  - Weekly/monthly spending challenges
  - Category-specific goals
  - Seasonal events and competitions
- **Level & Points**: Earn points and level up based on your financial activities
- **Streaks**: Maintain daily expense logging streaks for bonus rewards

### 🎨 User Experience
- **Modern UI**: Clean, responsive design with smooth animations
- **Dark/Light Mode**: Adaptive theming for comfortable viewing
- **Interactive Elements**: Engaging micro-interactions and feedback
- **Mobile-First**: Fully responsive design for all devices
- **Real-time Updates**: Live updates across all features

### 🎪 Seasonal Features
- **Festival Events**: Special themed events during holidays
- **Seasonal Challenges**: Time-limited challenges with exclusive rewards
- **Dynamic Themes**: Seasonal UI adaptations
- **Special Rewards**: Exclusive badges and accessories during events

## 🚀 Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript 5**: Full type safety throughout the application
- **Tailwind CSS 4**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Radix UI**: Accessible, unstyled UI components
- **Recharts**: Beautiful, responsive charts
- **Zustand**: Lightweight state management

### Backend & Database
- **Supabase**: Backend-as-a-Service with PostgreSQL
- **Row Level Security**: Secure data access patterns
- **Real-time Subscriptions**: Live updates across the application
- **Authentication**: Secure user authentication and authorization

### Development Tools
- **ESLint**: Code linting and formatting
- **React Hook Form**: Efficient form handling
- **Zod**: Schema validation
- **Date-fns**: Date manipulation utilities

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd personal-expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   Run the SQL scripts in your Supabase dashboard:
   ```bash
   # Run these files in order:
   # 1. database.sql - Core tables (categories, expenses)
   # 2. gamification.sql - Gamification features
   # 3. advanced-gamification.sql - Advanced features
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── expenses/          # Expense management
│   ├── categories/        # Category management
│   └── gamification/      # Gamification features
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   ├── charts/           # Chart components
│   ├── animations/       # Animation components
│   ├── gamification/     # Gamification components
│   └── seasonal/         # Seasonal feature components
├── services/             # API and business logic
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
├── lib/                  # Utility libraries
├── constants/            # Application constants
└── stores/               # State management stores
```

## 🎮 How to Use

### Getting Started
1. **Sign Up**: Create an account or sign in with existing credentials
2. **Profile Setup**: Complete your user profile and select your character
3. **Add Categories**: Create expense categories that match your spending habits
4. **Start Tracking**: Begin adding your daily expenses

### Gamification Features
1. **Character Interaction**: Your character's mood changes based on your spending habits
2. **Earn Points**: Get points for logging expenses, staying within budget, and completing challenges
3. **Unlock Achievements**: Complete various financial milestones to earn badges
4. **Join Challenges**: Participate in weekly/monthly challenges for extra rewards
5. **Customize**: Use earned points to unlock character accessories and themes

### Best Practices
- Log expenses daily to maintain your streak
- Set realistic budget goals
- Participate in seasonal challenges
- Check your analytics regularly
- Engage with the gamification features for motivation

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Deploy to Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🔧 Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) for the amazing React framework
- [Supabase](https://supabase.com) for the backend infrastructure
- [Radix UI](https://radix-ui.com) for accessible components
- [Tailwind CSS](https://tailwindcss.com) for the styling system
- [Framer Motion](https://framer.com/motion) for smooth animations

---

Made with ❤️ and ☕ - Happy expense tracking! 🎯
