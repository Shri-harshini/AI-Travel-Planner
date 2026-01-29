const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const AIService = require('./services/aiService');
const WeatherService = require('./services/weatherService');
const CurrencyService = require('./services/currencyService');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow all for testing
app.use(express.json());

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('SERVER ERROR:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message,
    stack: err.stack
  });
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Travel Planner API is running' });
});

app.post('/api/itinerary', async (req, res, next) => {
  try {
    const { destination, budget, duration, interests, travelType } = req.body;

    // Validation
    if (!destination || !budget || !duration || !travelType) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['destination', 'budget', 'duration', 'travelType']
      });
    }

    if (budget < 1000) {
      return res.status(400).json({
        error: 'Budget must be at least ₹1000'
      });
    }

    if (duration < 1 || duration > 30) {
      return res.status(400).json({
        error: 'Duration must be between 1 and 30 days'
      });
    }

    // Generate itinerary
    const itinerary = await AIService.generateItinerary({
      destination,
      budget: parseInt(budget),
      duration: parseInt(duration),
      interests: interests || [],
      travelType
    });

    // Get weather information
    const weather = await WeatherService.getWeather(destination);
    itinerary.weather = weather;

    // Get currency conversion
    const currencyConversion = await CurrencyService.convertCurrency(budget, 'INR', 'USD');
    itinerary.currency_conversion = currencyConversion;

    // Normalize response for frontend compatibility
    itinerary.total_estimated_cost = itinerary.total_estimated_cost || itinerary.total_estimated_cost_inr || budget;
    itinerary.total_estimated_cost_inr = itinerary.total_estimated_cost_inr || itinerary.total_estimated_cost;

    res.json(itinerary);
  } catch (error) {
    next(error);
  }
});

app.get('/api/weather/:destination', async (req, res, next) => {
  try {
    const { destination } = req.params;
    const weather = await WeatherService.getWeather(destination);
    res.json(weather);
  } catch (error) {
    next(error);
  }
});

app.get('/api/currency/:amount', async (req, res, next) => {
  try {
    const { amount } = req.params;
    const conversion = await CurrencyService.convertCurrency(parseFloat(amount), 'INR', 'USD');
    res.json(conversion);
  } catch (error) {
    next(error);
  }
});

app.get('/api/currency/multiple/:amount', async (req, res, next) => {
  try {
    const { amount } = req.params;
    const conversions = await CurrencyService.getMultipleConversions(parseFloat(amount), 'INR');
    res.json(conversions);
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use(errorHandler);

// Keep server running
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Travel Planner API server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
