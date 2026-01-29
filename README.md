# 🌍 AI-Powered Travel Planner

A beautiful, production-ready travel planning application that generates personalized, day-wise travel itineraries using AI. Built with React, Node.js, and featuring an elegant, mild-color UI design.

## ✨ Features

- 🤖 **AI-Powered Itineraries**: Smart travel plans based on your preferences
- 💰 **Budget-Conscious**: Plans optimized for Indian Rupee (INR) budgets
- 🎨 **Elegant UI**: Soft, calm color palette with glassmorphism effects
- 📱 **Responsive Design**: Works seamlessly on all devices
- 🌤️ **Weather Integration**: Real-time weather information for destinations
- 💱 **Currency Conversion**: Multi-currency support with INR as base
- 📄 **PDF Export**: Download your itinerary as a PDF document
- 🔄 **Regeneration**: Generate new itineraries with the same preferences

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** with custom mild color palette
- **Glassmorphism UI** components
- **jsPDF** for PDF generation
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **CORS** enabled for cross-origin requests
- **Environment variables** for security
- **Modular service architecture**

### AI Integration
- **Multiple AI providers** supported (OpenAI, Gemini, Claude)
- **Fallback mock responses** for development
- **Structured JSON output** for consistency

### External APIs
- **Weather API** (OpenWeatherMap)
- **Currency API** (ExchangeRate-API)
- **Places API** (Google Places - optional)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd travel-planner
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Set up environment variables**

   **Backend (.env)**:
   ```env
   PORT=3001
   CORS_ORIGIN=http://localhost:5173
   
   # AI API Keys (choose one or more)
   OPENAI_API_KEY=your_openai_key
   GEMINI_API_KEY=your_gemini_key
   CLAUDE_API_KEY=your_claude_key
   
   # External API Keys (optional)
   WEATHER_API_KEY=your_weather_key
   CURRENCY_API_KEY=your_currency_key
   ```

   **Frontend (.env)**:
   ```env
   VITE_API_URL=http://localhost:3001
   ```

5. **Start the development servers**

   **Backend** (in `backend/` directory):
   ```bash
   npm run dev
   ```

   **Frontend** (in `frontend/` directory):
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api/health

## 📁 Project Structure

```
travel-planner/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Hero.jsx      # Landing page hero
│   │   │   ├── TravelForm.jsx # Input form
│   │   │   └── ItineraryDisplay.jsx # Results display
│   │   ├── utils/            # Utility functions
│   │   │   └── pdfExport.js  # PDF generation
│   │   ├── App.jsx           # Main app component
│   │   └── index.css         # Tailwind + custom styles
│   ├── public/               # Static assets
│   ├── package.json
│   ├── tailwind.config.js    # Custom color palette
│   └── vercel.json          # Deployment config
├── backend/                  # Node.js backend
│   ├── services/            # API services
│   │   ├── aiService.js     # AI integration
│   │   ├── weatherService.js # Weather API
│   │   └── currencyService.js # Currency API
│   ├── server.js            # Express server
│   ├── package.json
│   ├── render.yaml          # Render deployment
│   └── .env.example         # Environment template
└── README.md
```

## 🎨 Design System

### Color Palette
- **Soft Indigo**: `#E0E7FF` to `#6366F1`
- **Soft Sky**: `#E0F2FE` to `#0EA5E9`
- **Soft Teal**: `#CCFBF1` to `#14B8A6`
- **Soft Coral**: `#FFE4E6` to `#EF4444`
- **Warm White**: `#FFFEF7` to `#FAFAFA`

### UI Components
- **Glassmorphism**: Backdrop blur with transparency
- **Soft Shadows**: Subtle, layered shadows
- **Rounded Corners**: Consistent border radius
- **Smooth Animations**: Hover effects and transitions

## 🔧 API Endpoints

### Main Endpoints
- `POST /api/itinerary` - Generate travel itinerary
- `GET /api/weather/:destination` - Get weather information
- `GET /api/currency/:amount` - Currency conversion
- `GET /api/health` - Health check

### Request Format (POST /api/itinerary)
```json
{
  "destination": "Paris",
  "budget": "50000",
  "duration": "5",
  "interests": ["culture", "food", "photography"],
  "travelType": "couple"
}
```

### Response Format
```json
{
  "destination": "Paris",
  "duration": 5,
  "total_estimated_cost": 42500,
  "days": [
    {
      "day": 1,
      "theme": "Cultural Immersion",
      "activities": ["Morning museum visit", "Local food tasting"],
      "attractions": ["Louvre Museum", "Eiffel Tower"],
      "estimated_cost": 8500,
      "travel_tips": ["Book tickets in advance", "Try local cuisine"]
    }
  ],
  "weather": {
    "temperature": 18,
    "condition": "Partly Cloudy",
    "humidity": 65
  },
  "currency_conversion": {
    "amount": 510.00,
    "rate": 0.012,
    "from": "INR",
    "to": "USD"
  }
}
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variable: `VITE_API_URL` (your backend URL)
3. Deploy automatically on push to main branch

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
# Frontend build
cd frontend
npm run build

# Backend production
cd backend
npm start
```

## 🔐 Environment Variables

### Required for Production
- `VITE_API_URL` (Frontend): Backend API URL
- `PORT` (Backend): Server port (default: 3001)
- `CORS_ORIGIN` (Backend): Frontend URL

### Optional AI Services
- `OPENAI_API_KEY`: OpenAI GPT API key
- `GEMINI_API_KEY`: Google Gemini API key
- `CLAUDE_API_KEY`: Anthropic Claude API key

### Optional External APIs
- `WEATHER_API_KEY`: OpenWeatherMap API key
- `CURRENCY_API_KEY`: ExchangeRate-API key
- `PLACES_API_KEY`: Google Places API key

## 🧪 Testing

### Manual Testing
1. **Form Validation**: Test empty fields and invalid inputs
2. **Budget Testing**: Try different budget ranges (₹1,000 - ₹100,000+)
3. **Duration Testing**: Test 1-30 day trips
4. **Interest Combinations**: Test various interest selections
5. **PDF Export**: Verify PDF generation and content

### API Testing
```bash
# Health check
curl http://localhost:3001/api/health

# Generate itinerary
curl -X POST http://localhost:3001/api/itinerary \
  -H "Content-Type: application/json" \
  -d '{"destination":"Paris","budget":"50000","duration":"5","interests":["culture"],"travelType":"solo"}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add feature description"`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **React & Vite** for the frontend framework
- **Tailwind CSS** for the utility-first CSS framework
- **OpenAI, Google, Anthropic** for AI services
- **OpenWeatherMap** for weather data
- **ExchangeRate-API** for currency conversion

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation above
- Review the API endpoints section

---

**Built with ❤️ for travelers who love smart, budget-friendly planning**
