# AI-Powered Travel Planner

The **AI-Powered Travel Planner** is a production-ready travel planning application that generates personalized, day-wise itineraries using artificial intelligence. The system is designed to deliver structured, budget-aware travel plans through a clean, modern, and responsive user interface.

This project demonstrates the integration of AI-driven planning logic with a full-stack web application, suitable for real-world use cases.

---

## Features

* AI-generated, personalized travel itineraries based on user preferences
* Budget-aware planning with optimization for Indian Rupee (INR)
* Clean and elegant user interface with a mild color palette and glassmorphism design
* Fully responsive layout compatible with all device sizes
* Real-time weather information for selected destinations
* Multi-currency support with INR as the base currency
* Export generated itineraries as downloadable PDF documents
* Itinerary regeneration using the same user preferences

---

## Tech Stack

### Frontend

* React 18 (Vite)
* Tailwind CSS with a custom mild color palette
* Glassmorphism-based UI components
* jsPDF for PDF generation
* Axios for API communication

### Backend

* Node.js with Express
* CORS enabled for secure cross-origin requests
* Environment variables for configuration and security
* Modular service-based architecture

### AI Integration

* Support for multiple AI providers (OpenAI, Gemini, Claude)
* Mock response fallback for development environments
* Structured JSON-based AI outputs for consistency

### External APIs

* Weather API: Open-Meteo Geocoding & Weather
* Currency API: ExchangeRate-API

---

## Quick Start

### Prerequisites

* Node.js (v16 or higher)
* npm or yarn

### Installation

Clone the repository:

```bash
git clone https://github.com/Shri-harshini/AI-Travel-Planner.git
cd AI-Travel-Planner
```

Install all dependencies:

```bash
npm run install-all
```

---

## Environment Configuration

Create environment variables for the backend in a `.env` file:

```env
PORT=3001
CORS_ORIGIN=http://localhost:5173

# AI API Keys (optional — falls back to mock responses if not provided)
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
CLAUDE_API_KEY=your_claude_key
```

---

## Running the Application

Start the development servers:

```bash
npm run dev
```

Access the application:

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend API Health Check: [http://localhost:3001/api/health](http://localhost:3001/api/health)

---

## Project Structure

```
travel-planner/
├── frontend/                 
│   ├── src/
│   │   ├── components/       
│   │   ├── utils/            
│   │   ├── App.jsx           
│   │   └── index.css         
├── backend/                 
│   ├── services/             
│   ├── server.js            
└── README.md
```
