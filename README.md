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
- **Weather API** (Open-Meteo Geocoding & Weather - Free)
- **Currency API** (ExchangeRate-API - Free)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shri-harshini/AI-Travel-Planner.git
   cd AI-Travel-Planner
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**

   **Backend (.env)**:
   ```env
   PORT=3001
   CORS_ORIGIN=http://localhost:5173
   
   # AI API Keys (Optional, fallback to mock if missing)
   OPENAI_API_KEY=your_openai_key
   GEMINI_API_KEY=your_gemini_key
   CLAUDE_API_KEY=your_claude_key
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api/health

## 📁 Project Structure

```
travel-planner/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── utils/            # Utility functions
│   │   ├── App.jsx           # Main app component
│   │   └── index.css         # Tailwind + custom styles
├── backend/                  # Node.js backend
│   ├── services/            # API services
│   ├── server.js            # Express server
└── README.md
```

## 📝 License

This project is licensed under the MIT License.

---

**Built with ❤️ for travelers who love smart, budget-friendly planning**
