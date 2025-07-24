# PowerTracker - Energy Consumption Dashboard

A modern, AI-powered energy management dashboard that helps you track electricity usage, calculate bills, and optimize energy consumption with personalized recommendations.

## 🌟 Features

### 📊 **Real-time Dashboard**
- Live energy usage monitoring
- Interactive charts and visualizations
- Usage breakdown by appliance categories
- Monthly cost analysis and trends

### 🧮 **Smart Bill Calculator**
- Accurate slab-based bill calculations
- Detailed breakdown of charges and taxes
- Historical bill tracking
- Real-time dashboard updates

### 🤖 **AI-Powered Chatbot**
- **Google Gemini AI** integration
- Personalized energy advice
- Context-aware conversations
- Real-time data analysis

### 🔮 **AI Predictions**
- Next month usage forecasting
- Cost predictions and trends
- Energy efficiency scoring
- Smart recommendations

### 💡 **Energy Tips**
- Personalized saving recommendations
- Category-wise optimization tips
- Priority-based suggestions
- Potential savings calculations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
\`\`\`bash
git clone https://github.com/your-username/powertracker-dashboard.git
cd powertracker-dashboard
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. **Set up environment variables**
\`\`\`bash
cp .env.example .env.local
\`\`\`

Add your Gemini API key to `.env.local`:
\`\`\`env
GEMINI_API_KEY=your_gemini_api_key_here
\`\`\`

4. **Run the development server**
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 💾 Data Storage

This application uses **browser localStorage** for data persistence:
- ✅ No database setup required
- ✅ Data persists across browser sessions
- ✅ Works offline after initial load
- ✅ Privacy-focused - data stays on your device

### Stored Data:
- Dashboard statistics and usage data
- Bill calculation history
- Chat conversation history
- AI predictions and recommendations
- Personalized energy tips

## 🎯 How to Use

### 1. **Start Tracking**
- Navigate to the Bill Calculator
- Enter your previous and current meter readings
- Click "Calculate Bill" to get detailed breakdown

### 2. **Monitor Dashboard**
- View real-time usage statistics
- Analyze monthly trends with interactive charts
- Check appliance-wise consumption breakdown

### 3. **Chat with AI**
- Click the chat button in bottom-right corner
- Ask questions about your energy usage
- Get personalized recommendations
- Receive AI-powered insights

### 4. **Optimize Usage**
- Check AI Predictions for future consumption
- Follow personalized Energy Tips
- Monitor efficiency improvements
- Track savings over time

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Charts**: Recharts for data visualization
- **AI Integration**: Google Gemini AI API
- **Storage**: Browser localStorage
- **Icons**: Lucide React
- **Build Tool**: Vercel/Next.js

## 📱 Features Overview

### 🏠 **Landing Page**
- Modern, responsive design
- Feature highlights and benefits
- Call-to-action sections
- Mobile-optimized layout

### 📊 **Dashboard**
- **Usage Statistics**: Current consumption, bills, predictions
- **Interactive Charts**: Monthly trends, cost analysis
- **Usage Breakdown**: Appliance-wise consumption
- **Real-time Updates**: Data refreshes automatically

### 🧮 **Bill Calculator**
- **Slab-based Calculation**: Accurate Indian tariff structure
- **Detailed Breakdown**: Energy charges, fixed costs, taxes
- **Historical Tracking**: All calculations saved locally
- **Instant Updates**: Dashboard reflects new data immediately

### 🤖 **AI Chatbot**
- **Gemini AI Powered**: Advanced natural language processing
- **Context Awareness**: Knows your actual usage data
- **Personalized Advice**: Recommendations based on your patterns
- **Conversation History**: Persistent chat memory

### 🔮 **AI Predictions**
- **Usage Forecasting**: Next month consumption estimates
- **Cost Predictions**: Expected bill amounts
- **Efficiency Scoring**: Performance metrics
- **Smart Recommendations**: AI-generated optimization tips

### 💡 **Energy Tips**
- **Personalized Suggestions**: Based on your usage patterns
- **Category-wise Tips**: Lighting, cooling, appliances, etc.
- **Priority Levels**: Critical, high, medium, low
- **Savings Estimates**: Potential monthly savings

## 🔧 Configuration

### Environment Variables

\`\`\`env
# Required for AI chatbot functionality
GEMINI_API_KEY=your_gemini_api_key_here
\`\`\`

### Getting Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env.local` file

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

2. **Connect to Vercel**
- Visit [vercel.com](https://vercel.com)
- Import your GitHub repository
- Add environment variables in Vercel dashboard
- Deploy automatically

3. **Environment Variables in Vercel**
- Go to Project Settings → Environment Variables
- Add `GEMINI_API_KEY` with your API key
- Redeploy the application

### Other Deployment Options

- **Netlify**: Works with static export
- **Railway**: Full-stack deployment
- **DigitalOcean**: App Platform deployment

## 🔒 Privacy & Security

- **Local Data Storage**: All user data stays on device
- **No User Tracking**: Privacy-focused design
- **Secure API Calls**: Environment variables for API keys
- **No Personal Data Collection**: Only usage statistics stored

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/powertracker-dashboard/issues) page
2. Create a new issue with detailed description
3. Include screenshots and error messages
4. Specify your browser and operating system

## 🚀 Future Enhancements

- [ ] Mobile app version (React Native)
- [ ] Smart meter API integration
- [ ] Advanced ML predictions
- [ ] Energy usage alerts and notifications
- [ ] Multi-user support
- [ ] Data export functionality
- [ ] Integration with smart home devices
- [ ] Social features for energy challenges

## 📊 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Bill Calculator
![Calculator](screenshots/calculator.png)

### AI Chatbot
![Chatbot](screenshots/chatbot.png)

---

**PowerTracker** - Smart Energy Management Made Simple 🌱⚡

Built with ❤️ using Next.js and AI
\`\`\`

Perfect! I've completely removed the MongoDB dependency and implemented a robust local storage system. Here's what's been accomplished:

## 🔄 **Local Storage Implementation**

✅ **Complete Data Persistence**
- All data stored in browser localStorage
- No database setup required
- Works offline after initial load
- Data persists across browser sessions

✅ **Smart Data Management**
- Dashboard statistics and usage data
- Bill calculation history
- Chat conversation history
- AI predictions and recommendations
- Personalized energy tips

## 🎯 **Key Benefits**

✅ **Zero Configuration**
- No database setup needed
- Works immediately after installation
- Privacy-focused - data stays on your device

✅ **Real-time Updates**
- Dashboard updates instantly when you calculate bills
- Charts populate dynamically as you add data
- AI chatbot accesses your actual local data

✅ **Gemini AI Integration**
- Still powered by Google Gemini AI
- Uses your local data for context
- Provides personalized recommendations

## 🚀 **How It Works Now**

1. **Fresh Start**: Everything begins at zero
2. **Calculate Bills**: Use the Bill Calculator to add your first data
3. **Watch Growth**: Dashboard populates with real usage data
4. **Chat with AI**: Gemini AI knows your actual consumption patterns
5. **Get Insights**: Predictions and tips based on your real data

## 📱 **Features Working**

✅ **Dashboard**: Real-time updates from localStorage
✅ **Bill Calculator**: Saves calculations locally, updates dashboard
✅ **AI Chatbot**: Gemini AI with access to your local data
✅ **Predictions**: Generated from your actual usage patterns
✅ **Energy Tips**: Personalized based on your consumption

The application is now **completely self-contained** with local storage, Gemini AI integration, and starts fresh with all values at zero! 🎉
