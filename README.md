# 🔋 PowerTracker - Smart Energy Management Dashboard

A modern, intelligent energy consumption tracking and management system built with Next.js, MongoDB, and Gemini AI.

![PowerTracker Dashboard](https://img.shields.io/badge/PowerTracker-Energy%20Management-blue?style=for-the-badge&logo=lightning)

## ✨ Features

### 🏠 **Landing Page**
- Beautiful, responsive landing page
- Feature showcase and benefits
- Call-to-action sections
- Modern UI design

### 📊 **Real-time Dashboard**
- Live energy consumption monitoring (starts at 0, grows with usage)
- Interactive charts and visualizations
- Monthly usage trends
- Cost analysis and breakdowns
- Dynamic usage breakdown by appliance categories

### 💰 **Smart Bill Calculator**
- Accurate electricity bill calculations with Indian slab rates
- Slab-based pricing structure (₹3, ₹4.5, ₹6, ₹7.5 per unit)
- Detailed bill breakdown with taxes and fixed charges
- Automatic dashboard updates with new calculations
- Historical calculation storage

### 🤖 **Gemini AI-Powered Chatbot**
- Google Gemini AI integration for intelligent responses
- Real-time access to your energy data
- Personalized advice based on actual usage patterns
- Natural language processing
- Persistent conversation history
- Context-aware recommendations

### 🔮 **AI Predictions**
- Smart usage forecasting based on your data
- Next month consumption predictions
- Cost estimation and trends
- Energy efficiency scoring
- Personalized recommendations

### 💡 **Smart Energy Tips**
- Dynamic tips based on your actual usage
- Categorized energy-saving advice
- Personalized recommendations
- Potential savings calculations

### 📱 **Responsive Design**
- Mobile-first approach
- Cross-device compatibility
- Modern, clean interface
- Intuitive navigation

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: MongoDB Atlas
- **AI**: Google Gemini AI API
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (provided)
- Google Gemini API key (provided)

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

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
\`\`\`env
MONGODB_URI=mongodb+srv://vishwateja319:vishwa24680@studymteai.a2fbihx.mongodb.net/?retryWrites=true&w=majority
GEMINI_API_KEY=AIzaSyDu7ZifPirrJbD0GDRTFbzTGD5dtci5T-Q
\`\`\`

4. **Run the development server**
\`\`\`bash
npm run dev
# or
pnpm dev
\`\`\`

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 How It Works

### 🔄 **Dynamic Data System**
- **Fresh Start**: All values begin at 0
- **Bill Calculator**: Enter meter readings to populate dashboard
- **Real-time Updates**: Dashboard updates automatically with new data
- **AI Learning**: Chatbot learns from your actual usage patterns

### 🤖 **Gemini AI Integration**
- **Smart Responses**: AI understands context from your real data
- **Personalized Advice**: Recommendations based on your usage patterns
- **Natural Conversation**: Ask questions in plain English
- **Continuous Learning**: Gets smarter with more data

### 📈 **Data Flow**
1. **Start**: Dashboard shows 0 values
2. **Calculate**: Use Bill Calculator with meter readings
3. **Update**: Dashboard populates with real data
4. **Predict**: AI generates forecasts based on usage
5. **Optimize**: Get personalized energy-saving tips

## 🗄️ Database Collections

The application automatically creates and manages:

- **dashboard**: Main dashboard data (starts empty, grows with usage)
- **chatMessages**: AI conversation history with Gemini
- **billCalculations**: All bill calculation records
- **predictions**: AI-generated usage forecasts
- **energyTips**: Personalized energy-saving recommendations

## 🔧 Configuration

### Environment Variables
\`\`\`env
# MongoDB Atlas Connection (Provided)
MONGODB_URI=mongodb+srv://vishwateja319:vishwa24680@studymteai.a2fbihx.mongodb.net/?retryWrites=true&w=majority

# Google Gemini AI API Key (Provided)
GEMINI_API_KEY=AIzaSyDu7ZifPirrJbD0GDRTFbzTGD5dtci5T-Q
\`\`\`

## 🚀 Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `GEMINI_API_KEY`: Your Gemini API key
4. Deploy automatically

## 📊 Key Features Explained

### Smart Bill Calculator
- **Indian Electricity Tariff**: Implements 4-slab pricing structure
- **Automatic Updates**: Dashboard reflects new calculations instantly
- **Detailed Breakdown**: Shows energy charges, fixed charges, and taxes
- **Historical Tracking**: Stores all calculations for trend analysis

### Gemini AI Chatbot
- **Real Data Access**: AI knows your actual usage and bills
- **Context Awareness**: Understands your energy patterns
- **Personalized Advice**: Recommendations based on your specific situation
- **Natural Language**: Ask questions conversationally

### Dynamic Dashboard
- **Starts Fresh**: All metrics begin at 0
- **Grows Organically**: Populates as you use the calculator
- **Real-time Updates**: Reflects your actual energy consumption
- **Visual Analytics**: Charts and graphs show your patterns

## 🎯 Usage Guide

### Getting Started
1. **Visit the Landing Page**: Overview of features
2. **Go to Dashboard**: See your current status (initially all zeros)
3. **Use Bill Calculator**: Enter your meter readings
4. **Watch Dashboard Update**: See your data populate in real-time
5. **Chat with AI**: Ask questions about your usage
6. **Get Predictions**: View AI forecasts based on your data
7. **Follow Tips**: Implement personalized energy-saving advice

### Sample Interactions with AI
- "What's my current usage?" → AI shows your real data
- "How can I save money?" → Personalized tips based on your consumption
- "Predict my next bill" → AI forecast using your patterns
- "Why is my bill high?" → Analysis of your usage breakdown

## 🔮 Future Enhancements

- [ ] Real smart meter integration
- [ ] Mobile app development
- [ ] Advanced ML models for predictions
- [ ] Social energy comparison features
- [ ] IoT device integration
- [ ] Energy audit reports
- [ ] Push notifications
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**PowerTracker** - Making energy management simple, smart, and sustainable with AI! ⚡🤖🌱

## 🚀 Live Demo

Experience the power of AI-driven energy management at: [Your Vercel URL]

Start with a clean slate and watch your energy data come to life!
