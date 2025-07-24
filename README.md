# 🔋 PowerTracker - Smart Energy Management Dashboard

A modern, intelligent energy consumption tracking and management system built with Next.js, MongoDB, and AI-powered insights.

![PowerTracker Dashboard](https://img.shields.io/badge/PowerTracker-Energy%20Management-blue?style=for-the-badge&logo=lightning)

## ✨ Features

### 🏠 **Landing Page**
- Beautiful, responsive landing page
- Feature showcase and benefits
- Call-to-action sections
- Modern UI design

### 📊 **Real-time Dashboard**
- Live energy consumption monitoring
- Interactive charts and visualizations
- Monthly usage trends
- Cost analysis and breakdowns
- Usage breakdown by appliance categories

### 💰 **Smart Bill Calculator**
- Accurate electricity bill calculations
- Slab-based pricing structure
- Detailed bill breakdown
- Historical calculation storage
- Tax and fixed charges inclusion

### 🤖 **AI-Powered Predictions**
- Machine learning-based usage forecasting
- Next month consumption predictions
- Cost estimation and trends
- Energy efficiency scoring
- Personalized insights and recommendations

### 💡 **Smart Energy Tips**
- Categorized energy-saving advice
- Appliance-specific recommendations
- Monthly savings potential calculations
- Practical implementation guides

### 🗨️ **Intelligent Chatbot**
- AI assistant with access to real user data
- Natural language processing
- Contextual responses based on usage patterns
- Persistent conversation history
- Real-time energy advice and support

### 📱 **Responsive Design**
- Mobile-first approach
- Cross-device compatibility
- Modern, clean interface
- Intuitive navigation

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: MongoDB with native driver
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB installed locally or MongoDB Atlas account (optional - app works without database)

### Installation

1. **Clone the repository**
\`\`\`bash
git clone https://github.com/Pranuu07/Power-Predictor.git
cd Power-Predictor
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
# or
pnpm install
\`\`\`

3. **Set up environment variables (Optional)**
Create a `.env.local` file in the root directory:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/powertracker
\`\`\`

For MongoDB Atlas:
\`\`\`env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/powertracker
\`\`\`

**Note**: The app works without MongoDB using mock data for demonstration purposes.

4. **Start MongoDB (Optional - if using local installation)**
\`\`\`bash
mongod
\`\`\`

5. **Run the development server**
\`\`\`bash
npm run dev
# or
pnpm dev
\`\`\`

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
power-consumption-dashboard/
├── app/
│   ├── api/                    # API routes
│   │   ├── chatbot/           # Chatbot endpoints
│   │   ├── dashboard/         # Dashboard data
│   │   ├── calculate-bill/    # Bill calculator
│   │   ├── predictions/       # AI predictions
│   │   └── tips/             # Energy tips
│   ├── dashboard/             # Dashboard page
│   ├── calculator/            # Bill calculator page
│   ├── predictions/           # AI predictions page
│   ├── tips/                  # Energy tips page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── chatbot.tsx           # AI chatbot component
│   ├── navigation.tsx        # Navigation component
│   ├── usage-chart.tsx       # Usage visualization
│   ├── cost-chart.tsx        # Cost visualization
│   └── usage-breakdown.tsx   # Usage breakdown chart
├── lib/
│   └── mongodb.ts            # MongoDB connection
└── README.md
\`\`\`

## 🗄️ Database Collections

The application automatically creates the following MongoDB collections:

- **dashboard**: Main dashboard data and statistics
- **chatMessages**: Chatbot conversation history
- **billCalculations**: Bill calculation history
- **predictions**: AI predictions and insights
- **energyTips**: Energy-saving tips and recommendations

## 🔧 Configuration

### MongoDB Setup (Optional)
1. **Local MongoDB**: Install MongoDB Community Edition
2. **MongoDB Atlas**: Create a free cluster at [mongodb.com](https://www.mongodb.com/)
3. **Connection String**: Update `MONGODB_URI` in `.env.local`

### Environment Variables
\`\`\`env
# Optional - app works without database
MONGODB_URI=your_mongodb_connection_string

# For production deployment
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=your_domain_url
\`\`\`

## 🚀 Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard (optional)
4. Deploy automatically

The app is designed to work without environment variables for easy deployment.

### Manual Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## 📊 Key Features Explained

### Smart Bill Calculator
- **Slab-based Calculation**: Implements tiered pricing structure
- **Real-time Processing**: Instant bill calculations
- **Historical Data**: Stores all calculations for analysis (when database is available)
- **Detailed Breakdown**: Shows energy charges, taxes, and fixed costs

### AI Chatbot
- **Data Integration**: Accesses real user consumption data
- **Contextual Responses**: Provides personalized advice
- **Natural Language**: Understands various query formats
- **Persistent Memory**: Maintains conversation history (when database is available)

### Energy Predictions
- **Usage Forecasting**: Predicts next month's consumption
- **Cost Estimation**: Calculates expected bills
- **Efficiency Scoring**: Rates energy usage efficiency
- **Trend Analysis**: Identifies consumption patterns

## 🔄 Fallback Mode

The application is designed to work seamlessly with or without MongoDB:

- **With Database**: Full functionality with data persistence
- **Without Database**: Uses mock data for demonstration
- **Hybrid Mode**: Gracefully falls back to mock data if database is unavailable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Future Enhancements

- [ ] Real smart meter integration
- [ ] Mobile app development
- [ ] Advanced ML models for predictions
- [ ] Social energy comparison features
- [ ] IoT device integration
- [ ] Energy audit reports
- [ ] Notification system
- [ ] Multi-language support

---

**PowerTracker** - Making energy management simple, smart, and sustainable! ⚡🌱

## 🚀 Live Demo

The application is deployed and ready to use at: [Your Vercel URL]

No setup required - just visit the link and start exploring your energy dashboard!
