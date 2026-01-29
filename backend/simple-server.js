const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002; // Use different port to avoid conflicts

// Middleware
app.use(cors());
app.use(express.json());

// Basic routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Simple Travel Planner API is running' });
});

app.post('/api/itinerary', async (req, res) => {
  try {
    const { destination, budget, duration, interests, travelType } = req.body;

    // Validation
    if (!destination || !budget || !duration || !travelType) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['destination', 'budget', 'duration', 'travelType']
      });
    }

    // Generate structured response with time-based planning
    const days = [];
    const totalBudget = parseFloat(budget);
    const daysCount = parseInt(duration);
    const dailyBudget = Math.floor(totalBudget / daysCount);

    for (let i = 0; i < daysCount; i++) {
      const dayData = {
        day: i + 1,
        theme: `Day ${i + 1} - ${getDayTheme(i, destination, travelType)}`,
        schedule: {
          morning: {
            activities: [`Morning city tour ${i + 1}`, `Breakfast at local cafe ${i + 1}`, `Visit morning market ${i + 1}`],
            attractions: [`Morning attraction ${i + 1}`, `Sunrise viewpoint ${i + 1}`],
            landmarks: [`Historic landmark ${i + 1}`, `Cultural monument ${i + 1}`],
            points_of_interest: [`Local neighborhood ${i + 1}`, `Scenic spot ${i + 1}`]
          },
          afternoon: {
            activities: [`Museum visit ${i + 1}`, `Lunch at specialty restaurant ${i + 1}`, `Shopping tour ${i + 1}`],
            attractions: [`Main attraction ${i + 1}`, `Art gallery ${i + 1}`],
            landmarks: [`Famous building ${i + 1}`, `Memorial site ${i + 1}`],
            points_of_interest: [`Shopping district ${i + 1}`, `Cultural center ${i + 1}`]
          },
          evening: {
            activities: [`Dinner experience ${i + 1}`, `Evening entertainment ${i + 1}`, `Night walk ${i + 1}`],
            attractions: [`Evening attraction ${i + 1}`, `Night market ${i + 1}`],
            landmarks: [`Illuminated landmark ${i + 1}`, `Night monument ${i + 1}`],
            points_of_interest: [`Entertainment district ${i + 1}`, `Rooftop bar ${i + 1}`]
          }
        },
        estimated_cost_inr: dailyBudget,
        travel_tips: [`Day ${i + 1} tip: Stay hydrated`, `Day ${i + 1} tip: Keep local currency handy`, `Day ${i + 1} tip: Wear comfortable shoes`],
        nearby_recommendations: getNearbyRecommendations(i + 1, destination, travelType)
      };
      days.push(dayData);
    }

    const response = {
      days,
      total_estimated_cost_inr: totalBudget,
      country_specific_tips: getCountrySpecificTips(destination)
    };

    res.json(response);
  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({ 
      error: 'Failed to generate itinerary', 
      message: error.message 
    });
  }
});

function getNearbyRecommendations(day, destination, travelType) {
  const baseLat = getDestinationLat(destination);
  const baseLng = getDestinationLng(destination);
  
  // Real hotel names based on destination
  const realHotels = getRealHotels(destination, day);
  const realShoppingSpots = getRealShoppingSpots(destination, day);
  const realFoodPlaces = getRealFoodPlaces(destination, day);
  const realOptionalPlaces = getRealOptionalPlaces(destination, day);
  
  return {
    hotels_nearby: realHotels,
    food_nearby: realFoodPlaces,
    shopping_spots: realShoppingSpots,
    optional_places: realOptionalPlaces,
    cost_saving_alternatives: [
      {
        name: `Public Transport Day Pass ${day}`,
        type: "transport",
        approx_savings_in_inr: 800,
        explanation: "Unlimited travel on buses and metro instead of taxis",
        latitude: baseLat,
        longitude: baseLng
      },
      {
        name: `Free Walking Tour ${day}`,
        type: "experience",
        approx_savings_in_inr: 1500,
        explanation: "Guided tour with tips-based payment instead of paid tours",
        latitude: baseLat + (Math.random() - 0.5) * 0.02,
        longitude: baseLng + (Math.random() - 0.5) * 0.02
      },
      {
        name: `Local Eatery ${day}`,
        type: "food",
        approx_savings_in_inr: 600,
        explanation: "Authentic local restaurant instead of tourist places",
        latitude: baseLat + (Math.random() - 0.5) * 0.02,
        longitude: baseLng + (Math.random() - 0.5) * 0.02
      },
      {
        name: `Free Museum Entry ${day}`,
        type: "attraction",
        approx_savings_in_inr: 500,
        explanation: "Visit during free entry hours or days",
        latitude: baseLat + (Math.random() - 0.5) * 0.02,
        longitude: baseLng + (Math.random() - 0.5) * 0.02
      }
    ]
  };
}

function getRealHotels(destination, day) {
  const hotelData = {
    'paris': [
      { name: 'Four Seasons Hotel George V', category: 'luxury', price: 35000, rating: 4.9, distance: 0.3 },
      { name: 'The Peninsula Paris', category: 'luxury', price: 32000, rating: 4.8, distance: 0.5 },
      { name: 'Le Bristol Paris', category: 'luxury', price: 30000, rating: 4.9, distance: 0.4 },
      { name: 'Hotel Le Meurice', category: 'luxury', price: 28000, rating: 4.8, distance: 0.3 },
      { name: 'Hotel Plaza Athénée', category: 'luxury', price: 26000, rating: 4.8, distance: 0.5 },
      { name: 'Shangri-La Hotel Paris', category: 'luxury', price: 25000, rating: 4.7, distance: 0.6 },
      { name: 'Mandarin Oriental Paris', category: 'luxury', price: 24000, rating: 4.8, distance: 0.7 },
      { name: 'Hotel de Crillon', category: 'luxury', price: 23000, rating: 4.8, distance: 0.4 },
      { name: 'The Westin Paris - Vendôme', category: 'mid_range', price: 12000, rating: 4.3, distance: 0.8 },
      { name: 'Pullman Paris Tour Eiffel', category: 'mid_range', price: 10000, rating: 4.2, distance: 1.0 },
      { name: 'Novotel Paris Centre Tour Eiffel', category: 'mid_range', price: 9000, rating: 4.1, distance: 1.2 },
      { name: 'Hotel Mercure Paris Centre Tour Eiffel', category: 'mid_range', price: 8500, rating: 4.0, distance: 1.4 },
      { name: 'Ibis Paris Tour Eiffel', category: 'budget', price: 4500, rating: 3.8, distance: 1.8 },
      { name: 'Hotel Adèle & Jules', category: 'budget', price: 4000, rating: 4.1, distance: 2.0 },
      { name: 'Hotel Le Marais', category: 'budget', price: 3800, rating: 3.9, distance: 2.5 },
      { name: 'Generator Paris', category: 'budget', price: 3200, rating: 4.0, distance: 2.2 }
    ],
    'tokyo': [
      { name: 'Aman Tokyo', category: 'luxury', price: 45000, rating: 4.9, distance: 0.4 },
      { name: 'The Ritz-Carlton Tokyo', category: 'luxury', price: 42000, rating: 4.9, distance: 0.4 },
      { name: 'Mandarin Oriental Tokyo', category: 'luxury', price: 40000, rating: 4.8, distance: 0.6 },
      { name: 'Four Seasons Hotel Tokyo at Otemachi', category: 'luxury', price: 38000, rating: 4.8, distance: 0.5 },
      { name: 'Imperial Hotel Tokyo', category: 'luxury', price: 35000, rating: 4.7, distance: 0.7 },
      { name: 'Park Hyatt Tokyo', category: 'luxury', price: 32000, rating: 4.8, distance: 0.8 },
      { name: 'Hotel Gracery Shinjuku', category: 'mid_range', price: 9000, rating: 4.2, distance: 1.2 },
      { name: 'Shibuya Excel Hotel Tokyu', category: 'mid_range', price: 8500, rating: 4.1, distance: 1.0 },
      { name: 'APA Hotel Shinjuku Kabukicho', category: 'mid_range', price: 7000, rating: 4.0, distance: 1.8 },
      { name: 'Hotel Sunroute Plaza Shinjuku', category: 'mid_range', price: 6500, rating: 3.8, distance: 2.2 },
      { name: 'Khaosan Tokyo Kabuki', category: 'budget', price: 3500, rating: 3.7, distance: 2.8 },
      { name: 'Capsule Hotel Anshin Oyado Shinjuku', category: 'budget', price: 2800, rating: 3.6, distance: 2.5 },
      { name: 'Sakura Hotel Jimbocho', category: 'budget', price: 2500, rating: 3.8, distance: 3.0 }
    ],
    'new york': [
      { name: 'The St. Regis New York', category: 'luxury', price: 45000, rating: 4.9, distance: 0.4 },
      { name: 'The Plaza Hotel', category: 'luxury', price: 42000, rating: 4.8, distance: 0.2 },
      { name: 'Four Seasons Hotel New York Downtown', category: 'luxury', price: 40000, rating: 4.8, distance: 0.6 },
      { name: 'Mandarin Oriental New York', category: 'luxury', price: 38000, rating: 4.9, distance: 0.5 },
      { name: 'The Peninsula New York', category: 'luxury', price: 35000, rating: 4.8, distance: 0.3 },
      { name: 'The Carlyle', category: 'luxury', price: 32000, rating: 4.7, distance: 0.7 },
      { name: 'Waldorf Astoria New York', category: 'luxury', price: 30000, rating: 4.6, distance: 0.8 },
      { name: 'Park Hyatt New York', category: 'luxury', price: 28000, rating: 4.8, distance: 0.9 },
      { name: 'Hyatt Centric Times Square', category: 'mid_range', price: 12000, rating: 4.3, distance: 0.8 },
      { name: 'New York Marriott Marquis', category: 'mid_range', price: 11000, rating: 4.2, distance: 0.6 },
      { name: 'Hotel Pennsylvania', category: 'mid_range', price: 8500, rating: 4.1, distance: 1.2 },
      { name: 'Row NYC', category: 'mid_range', price: 7500, rating: 4.0, distance: 1.0 },
      { name: 'Pod Times Square', category: 'budget', price: 4500, rating: 3.9, distance: 1.8 },
      { name: 'The Jane Hotel', category: 'budget', price: 3200, rating: 3.6, distance: 2.5 },
      { name: 'HI New York City Hostel', category: 'budget', price: 2800, rating: 4.0, distance: 3.0 }
    ],
    'london': [
      { name: 'The Savoy', category: 'luxury', price: 40000, rating: 4.9, distance: 0.3 },
      { name: 'Claridge\'s', category: 'luxury', price: 38000, rating: 4.8, distance: 0.5 },
      { name: 'The Ritz London', category: 'luxury', price: 35000, rating: 4.9, distance: 0.3 },
      { name: 'The Langham London', category: 'luxury', price: 32000, rating: 4.7, distance: 0.6 },
      { name: 'Four Seasons Hotel London at Park Lane', category: 'luxury', price: 30000, rating: 4.8, distance: 0.4 },
      { name: 'Mandarin Oriental Hyde Park', category: 'luxury', price: 28000, rating: 4.8, distance: 0.7 },
      { name: 'The Connaught', category: 'luxury', price: 26000, rating: 4.8, distance: 0.5 },
      { name: 'Hotel Café Royal', category: 'luxury', price: 24000, rating: 4.6, distance: 0.4 },
      { name: 'The Hoxton Holborn', category: 'mid_range', price: 10000, rating: 4.2, distance: 1.0 },
      { name: 'CitizenM Bankside', category: 'mid_range', price: 9000, rating: 4.1, distance: 1.4 },
      { name: 'The Z Hotel Piccadilly', category: 'mid_range', price: 8500, rating: 4.0, distance: 0.8 },
      { name: 'Premier Inn London County Hall', category: 'mid_range', price: 7500, rating: 4.0, distance: 2.0 },
      { name: 'Travelodge London Central', category: 'budget', price: 4500, rating: 3.7, distance: 2.6 },
      { name: 'Ibis London Euston', category: 'budget', price: 3800, rating: 3.8, distance: 2.2 },
      { name: 'Generator London', category: 'budget', price: 3200, rating: 4.0, distance: 2.8 }
    ],
    'dubai': [
      { name: 'Burj Al Arab', category: 'luxury', price: 60000, rating: 4.9, distance: 0.5 },
      { name: 'Atlantis The Palm', category: 'luxury', price: 45000, rating: 4.8, distance: 0.8 },
      { name: 'Four Seasons Resort Dubai at Jumeirah Beach', category: 'luxury', price: 40000, rating: 4.8, distance: 1.0 },
      { name: 'Mandarin Oriental Jumeira', category: 'luxury', price: 38000, rating: 4.7, distance: 1.2 },
      { name: 'The Address Downtown', category: 'luxury', price: 35000, rating: 4.6, distance: 0.6 },
      { name: 'Palazzo Versace Dubai', category: 'luxury', price: 32000, rating: 4.7, distance: 1.5 },
      { name: 'JW Marriott Marquis Dubai', category: 'mid_range', price: 12000, rating: 4.3, distance: 1.2 },
      { name: 'Hyatt Regency Dubai', category: 'mid_range', price: 10000, rating: 4.2, distance: 1.6 },
      { name: 'Dubai Marriott Harbour Hotel', category: 'mid_range', price: 9000, rating: 4.1, distance: 2.0 },
      { name: 'Rove Downtown Dubai', category: 'mid_range', price: 7500, rating: 3.9, distance: 2.8 },
      { name: 'Ibis Dubai Al Barsha', category: 'budget', price: 4500, rating: 3.8, distance: 2.2 },
      { name: 'Holiday Inn Express Dubai Airport', category: 'budget', price: 3800, rating: 3.9, distance: 3.5 },
      { name: 'Rove City Centre', category: 'budget', price: 3200, rating: 3.7, distance: 2.5 }
    ],
    'singapore': [
      { name: 'Marina Bay Sands', category: 'luxury', price: 35000, rating: 4.8, distance: 0.3 },
      { name: 'Raffles Hotel Singapore', category: 'luxury', price: 32000, rating: 4.9, distance: 0.5 },
      { name: 'The Fullerton Hotel Singapore', category: 'luxury', price: 28000, rating: 4.7, distance: 0.6 },
      { name: 'Four Seasons Hotel Singapore', category: 'luxury', price: 26000, rating: 4.8, distance: 0.7 },
      { name: 'Mandarin Oriental Singapore', category: 'luxury', price: 24000, rating: 4.7, distance: 0.8 },
      { name: 'Pan Pacific Singapore', category: 'mid_range', price: 10000, rating: 4.2, distance: 1.0 },
      { name: 'Swissôtel The Stamford', category: 'mid_range', price: 9000, rating: 4.1, distance: 1.2 },
      { name: 'Holiday Inn Singapore Orchard City Centre', category: 'mid_range', price: 8500, rating: 4.0, distance: 0.8 },
      { name: 'Ibis Singapore on Bencoolen', category: 'budget', price: 4500, rating: 3.8, distance: 1.5 },
      { name: 'Fragrance Hotel - Pearl', category: 'budget', price: 3800, rating: 3.7, distance: 2.0 },
      { name: 'Budget Hostel @ Jalan Besar', category: 'budget', price: 2800, rating: 3.6, distance: 2.5 }
    ],
    'rome': [
      { name: 'Hotel de Russie', category: 'luxury', price: 30000, rating: 4.8, distance: 0.3 },
      { name: 'The St. Regis Rome', category: 'luxury', price: 28000, rating: 4.7, distance: 0.5 },
      { name: 'Hotel Hassler', category: 'luxury', price: 26000, rating: 4.8, distance: 0.4 },
      { name: 'Rome Cavalieri Waldorf Astoria', category: 'luxury', price: 24000, rating: 4.6, distance: 1.0 },
      { name: 'J.K. Place Roma', category: 'luxury', price: 22000, rating: 4.7, distance: 0.6 },
      { name: 'Grand Hotel de la Minerve', category: 'mid_range', price: 10000, rating: 4.2, distance: 0.8 },
      { name: 'Hotel Artemide', category: 'mid_range', price: 8500, rating: 4.1, distance: 1.2 },
      { name: 'NH Collection Roma Palazzo Cinquecento', category: 'mid_range', price: 7500, rating: 4.0, distance: 1.0 },
      { name: 'Hotel Sonya', category: 'budget', price: 4500, rating: 3.8, distance: 1.5 },
      { name: 'Hotel Giorgina', category: 'budget', price: 3800, rating: 3.7, distance: 2.0 },
      { name: 'The RomeHello Hostel', category: 'budget', price: 2800, rating: 4.0, distance: 2.5 }
    ],
    'barcelona': [
      { name: 'Hotel Arts Barcelona', category: 'luxury', price: 28000, rating: 4.8, distance: 0.3 },
      { name: 'Mandarin Oriental Barcelona', category: 'luxury', price: 25000, rating: 4.7, distance: 0.5 },
      { name: 'W Barcelona', category: 'luxury', price: 22000, rating: 4.6, distance: 0.4 },
      { name: 'Hotel Casa Fuster', category: 'luxury', price: 20000, rating: 4.7, distance: 0.8 },
      { name: 'Eurostars Grand Marina', category: 'luxury', price: 18000, rating: 4.5, distance: 0.6 },
      { name: 'Catalonia Park Güell', category: 'mid_range', price: 9000, rating: 4.2, distance: 1.2 },
      { name: 'Hotel Barcelona Center', category: 'mid_range', price: 8000, rating: 4.1, distance: 1.0 },
      { name: 'NH Collection Barcelona Podium', category: 'mid_range', price: 7500, rating: 4.0, distance: 0.8 },
      { name: 'Hostel One Sants', category: 'budget', price: 3500, rating: 4.0, distance: 1.8 },
      { name: 'Sant Jordi Hostel Sagrada Familia', category: 'budget', price: 2800, rating: 3.8, distance: 2.2 },
      { name: 'Generator Barcelona', category: 'budget', price: 2500, rating: 3.9, distance: 2.5 }
    ],
    'amsterdam': [
      { name: 'Waldorf Astoria Amsterdam', category: 'luxury', price: 30000, rating: 4.8, distance: 0.4 },
      { name: 'The Dylan Amsterdam', category: 'luxury', price: 28000, rating: 4.7, distance: 0.5 },
      { name: 'Hotel Okura Amsterdam', category: 'luxury', price: 25000, rating: 4.6, distance: 0.6 },
      { name: 'Conservatorium Hotel', category: 'luxury', price: 22000, rating: 4.7, distance: 0.7 },
      { name: 'Pulitzer Amsterdam', category: 'luxury', price: 20000, rating: 4.5, distance: 0.8 },
      { name: 'Mövenpick Hotel Amsterdam City Centre', category: 'mid_range', price: 10000, rating: 4.2, distance: 1.0 },
      { name: 'NH Collection Barbizon Palace', category: 'mid_range', price: 9000, rating: 4.1, distance: 0.8 },
      { name: 'Van der Valk Hotel Amsterdam-Amstel', category: 'mid_range', price: 8500, rating: 4.0, distance: 1.5 },
      { name: 'ClinkNOORD Hostel', category: 'budget', price: 4000, rating: 4.0, distance: 2.0 },
      { name: 'Hostel The Globe', category: 'budget', price: 3200, rating: 3.8, distance: 2.5 },
      { name: 'Flying Pig Downtown Hostel', category: 'budget', price: 2800, rating: 3.7, distance: 1.8 }
    ]
  };

  const destLower = destination.toLowerCase();
  let hotels = hotelData['new york']; // default
  
  for (const [city, data] of Object.entries(hotelData)) {
    if (destLower.includes(city)) {
      hotels = data;
      break;
    }
  }

  const baseLat = getDestinationLat(destination);
  const baseLng = getDestinationLng(destination);

  return hotels.map((hotel, idx) => ({
    name: `${hotel.name} - Day ${day}`,
    category: hotel.category,
    approx_distance_km_from_attractions: hotel.distance,
    rating_out_of_5: hotel.rating,
    average_price_per_night_inr: hotel.price,
    latitude: baseLat + (Math.random() - 0.5) * 0.02,
    longitude: baseLng + (Math.random() - 0.5) * 0.02
  }));
}

function getRealShoppingSpots(destination, day) {
  const shoppingData = {
    'paris': [
      { name: 'Champs-Élysées', type: 'luxury_shopping', description: 'Famous avenue with high-end boutiques', price_range: '€€€€' },
      { name: 'Galeries Lafayette', type: 'department_store', description: 'Iconic French department store', price_range: '€€€' },
      { name: 'Le Marais', type: 'boutique_district', description: 'Trendy boutiques and vintage shops', price_range: '€€' },
      { name: 'Saint-Germain-des-Prés', type: 'luxury_boutiques', description: 'Designer stores and art galleries', price_range: '€€€€' },
      { name: 'Rue Cler', type: 'market_street', description: 'Charming street with local shops', price_range: '€' }
    ],
    'tokyo': [
      { name: 'Ginza', type: 'luxury_shopping', description: 'Upscale shopping district', price_range: '¥¥¥¥' },
      { name: 'Shibuya', type: 'fashion_district', description: 'Trendy fashion and electronics', price_range: '¥¥¥' },
      { name: 'Harajuku', type: 'street_fashion', description: 'Youth fashion and unique boutiques', price_range: '¥¥' },
      { name: 'Akihabara', type: 'electronics', description: 'Electronics and anime goods', price_range: '¥¥' },
      { name: 'Tsukiji Outer Market', type: 'market', description: 'Food and traditional crafts', price_range: '¥' }
    ],
    'new york': [
      { name: 'Fifth Avenue', type: 'luxury_shopping', description: 'World-famous shopping street', price_range: '$$$$' },
      { name: 'Times Square', type: 'entertainment_shopping', description: 'Stores and entertainment complex', price_range: '$$$' },
      { name: 'SoHo', type: 'boutique_district', description: 'Art galleries and designer boutiques', price_range: '$$$' },
      { name: 'Brooklyn Flea Market', type: 'market', description: 'Vintage and artisan goods', price_range: '$$' },
      { name: 'Chelsea Market', type: 'food_market', description: 'Gourmet food and specialty shops', price_range: '$$' }
    ],
    'london': [
      { name: 'Oxford Street', type: 'main_shopping', description: 'Major shopping street with flagship stores', price_range: '£££' },
      { name: 'Regent Street', type: 'luxury_shopping', description: 'High-end brands and historic architecture', price_range: '££££' },
      { name: 'Camden Market', type: 'alternative_market', description: 'Alternative fashion and crafts', price_range: '££' },
      { name: 'Portobello Road Market', type: 'vintage_market', description: 'Antiques and vintage goods', price_range: '££' },
      { name: 'Covent Garden', type: 'boutique_shopping', description: 'Unique shops and street performers', price_range: '£££' }
    ],
    'dubai': [
      { name: 'Dubai Mall', type: 'luxury_mall', description: 'World\'s largest shopping mall', price_range: 'AED AED AED AED' },
      { name: 'Mall of the Emirates', type: 'premium_mall', description: 'Ski Dubai and luxury brands', price_range: 'AED AED AED' },
      { name: 'Gold Souk', type: 'traditional_market', description: 'Traditional gold and spice market', price_range: 'AED AED' },
      { name: 'Global Village', type: 'international_market', description: 'International pavilions and shopping', price_range: 'AED' },
      { name: 'City Walk', type: 'lifestyle_shopping', description: 'Outdoor shopping and dining', price_range: 'AED AED AED' }
    ]
  };

  const destLower = destination.toLowerCase();
  let spots = shoppingData['new york']; // default
  
  for (const [city, data] of Object.entries(shoppingData)) {
    if (destLower.includes(city)) {
      spots = data;
      break;
    }
  }

  const baseLat = getDestinationLat(destination);
  const baseLng = getDestinationLng(destination);

  return spots.map((spot, idx) => ({
    name: `${spot.name} - Day ${day}`,
    type: spot.type,
    description: spot.description,
    price_range: spot.price_range,
    latitude: baseLat + (Math.random() - 0.5) * 0.03,
    longitude: baseLng + (Math.random() - 0.5) * 0.03
  }));
}

function getRealFoodPlaces(destination, day) {
  const foodData = {
    'paris': {
      morning: [
        { name: 'Café de Flore', type: 'cafe', cuisine: 'French Café', price: 400 },
        { name: 'Le Comptoir du Relais', type: 'bistro', cuisine: 'Traditional French', price: 350 }
      ],
      afternoon: [
        { name: 'L\'As du Fallafel', type: 'street_food', cuisine: 'Middle Eastern', price: 200 },
        { name: 'Breizh Café', type: 'crêperie', cuisine: 'French Crêpes', price: 450 }
      ],
      evening: [
        { name: 'Le Jules Verne', type: 'fine_dining', cuisine: 'French Gastronomy', price: 3000 },
        { name: 'Bouillon Chartier', type: 'traditional', cuisine: 'Classic French', price: 600 }
      ]
    },
    'tokyo': {
      morning: [
        { name: 'Tsukiji Sushi Dai', type: 'sushi', cuisine: 'Japanese Sushi', price: 500 },
        { name: 'Kagura', type: 'cafe', cuisine: 'Japanese Breakfast', price: 350 }
      ],
      afternoon: [
        { name: 'Ichiran Ramen', type: 'ramen', cuisine: 'Japanese Ramen', price: 250 },
        { name: 'Gonpachi', type: 'izakaya', cuisine: 'Japanese Pub Food', price: 450 }
      ],
      evening: [
        { name: 'Narisawa', type: 'fine_dining', cuisine: 'Innovative Japanese', price: 2500 },
        { name: 'Omoide Yokocho', type: 'street_food', cuisine: 'Yakitori & Sake', price: 400 }
      ]
    },
    'new york': {
      morning: [
        { name: 'Ess-a-Bagel', type: 'bagel_shop', cuisine: 'New York Bagels', price: 300 },
        { name: 'Balthazar', type: 'brasserie', cuisine: 'French-American', price: 500 }
      ],
      afternoon: [
        { name: 'Katz\'s Delicatessen', type: 'deli', cuisine: 'Jewish Deli', price: 450 },
        { name: 'Joe\'s Pizza', type: 'pizza', cuisine: 'New York Pizza', price: 250 }
      ],
      evening: [
        { name: 'Le Bernardin', type: 'fine_dining', cuisine: 'French Seafood', price: 2800 },
        { name: 'Shake Shack', type: 'fast_casual', cuisine: 'American Burgers', price: 350 }
      ]
    },
    'london': {
      morning: [
        { name: 'The Breakfast Club', type: 'cafe', cuisine: 'British Breakfast', price: 350 },
        { name: 'Pret A Manger', type: 'cafe', cuisine: 'British Café', price: 250 }
      ],
      afternoon: [
        { name: 'Borough Market', type: 'market_food', cuisine: 'International Street Food', price: 300 },
        { name: 'Dishoom', type: 'indian', cuisine: 'Indian-British', price: 450 }
      ],
      evening: [
        { name: 'Restaurant Gordon Ramsay', type: 'fine_dining', cuisine: 'Modern British', price: 2500 },
        { name: 'Ye Olde Cheshire Cheese', type: 'pub', cuisine: 'British Pub Food', price: 400 }
      ]
    },
    'dubai': {
      morning: [
        { name: 'Arabian Tea House', type: 'cafe', cuisine: 'Emirati Breakfast', price: 400 },
        { name: 'Tom & Serg', type: 'cafe', cuisine: 'Australian-Emirati', price: 350 }
      ],
      afternoon: [
        { name: 'Al Mallah', type: 'street_food', cuisine: 'Middle Eastern', price: 200 },
        { name: 'Bu Qtair', type: 'seafood', cuisine: 'Emirati Seafood', price: 350 }
      ],
      evening: [
        { name: 'Zuma', type: 'fine_dining', cuisine: 'Japanese Contemporary', price: 2200 },
        { name: 'Ravi Restaurant', type: 'pakistani', cuisine: 'Pakistani-Emirati', price: 250 }
      ]
    }
  };

  const destLower = destination.toLowerCase();
  let food = foodData['new york']; // default
  
  for (const [city, data] of Object.entries(foodData)) {
    if (destLower.includes(city)) {
      food = data;
      break;
    }
  }

  const baseLat = getDestinationLat(destination);
  const baseLng = getDestinationLng(destination);

  return {
    morning: food.morning.map((place, idx) => ({
      name: `${place.name} - Day ${day}`,
      type: place.type,
      cuisine: place.cuisine,
      average_price_inr: place.price,
      latitude: baseLat + (Math.random() - 0.5) * 0.01,
      longitude: baseLng + (Math.random() - 0.5) * 0.01
    })),
    afternoon: food.afternoon.map((place, idx) => ({
      name: `${place.name} - Day ${day}`,
      type: place.type,
      cuisine: place.cuisine,
      average_price_inr: place.price,
      latitude: baseLat + (Math.random() - 0.5) * 0.01,
      longitude: baseLng + (Math.random() - 0.5) * 0.01
    })),
    evening: food.evening.map((place, idx) => ({
      name: `${place.name} - Day ${day}`,
      type: place.type,
      cuisine: place.cuisine,
      average_price_inr: place.price,
      latitude: baseLat + (Math.random() - 0.5) * 0.01,
      longitude: baseLng + (Math.random() - 0.5) * 0.01
    }))
  };
}

function getRealOptionalPlaces(destination, day) {
  const placesData = {
    'paris': [
      { name: 'Montmartre Hill', type: 'viewpoint', description: 'Artistic neighborhood with Sacré-Cœur' },
      { name: 'Sainte-Chapelle', type: 'historical', description: 'Stunning stained glass chapel' },
      { name: 'Luxembourg Gardens', type: 'park', description: 'Beautiful formal gardens' },
      { name: 'Musée Rodin', type: 'museum', description: 'Sculpture museum with The Thinker' }
    ],
    'tokyo': [
      { name: 'Senso-ji Temple', type: 'temple', description: 'Tokyo\'s oldest temple' },
      { name: 'Meiji Shrine', type: 'shrine', description: 'Peaceful Shinto shrine' },
      { name: 'Ueno Park', type: 'park', description: 'Large park with museums' },
      { name: 'Tokyo Skytree', type: 'observation', description: 'Tallest structure in Japan' }
    ],
    'new york': [
      { name: 'Brooklyn Bridge', type: 'landmark', description: 'Iconic suspension bridge' },
      { name: 'Central Park', type: 'park', description: 'Famous urban park' },
      { name: 'High Line', type: 'park', description: 'Elevated linear park' },
      { name: '9/11 Memorial', type: 'memorial', description: 'Memorial and museum' }
    ],
    'london': [
      { name: 'Hyde Park', type: 'park', description: 'Royal park with Serpentine Lake' },
      { name: 'Tower Bridge', type: 'landmark', description: 'Iconic Victorian bridge' },
      { name: 'British Museum', type: 'museum', description: 'World history and artifacts' },
      { name: 'Camden Lock', type: 'market', description: 'Alternative market and canal' }
    ],
    'dubai': [
      { name: 'Dubai Marina Walk', type: 'waterfront', description: 'Scenic waterfront promenade' },
      { name: 'Jumeirah Beach', type: 'beach', description: 'Public beach with Burj Al Arab view' },
      { name: 'Dubai Frame', type: 'landmark', description: 'Picture frame-shaped structure' },
      { name: 'Al Fahidi Historical District', type: 'historical', description: 'Traditional Emirati architecture' }
    ]
  };

  const destLower = destination.toLowerCase();
  let places = placesData['new york']; // default
  
  for (const [city, data] of Object.entries(placesData)) {
    if (destLower.includes(city)) {
      places = data;
      break;
    }
  }

  const baseLat = getDestinationLat(destination);
  const baseLng = getDestinationLng(destination);

  return places.map((place, idx) => ({
    name: `${place.name} - Day ${day}`,
    type: place.type,
    description: place.description,
    entry_fee_inr: Math.random() > 0.5 ? Math.floor(Math.random() * 1000) + 200 : 0,
    latitude: baseLat + (Math.random() - 0.5) * 0.03,
    longitude: baseLng + (Math.random() - 0.5) * 0.03
  }));
}

function getDestinationLat(destination) {
  const coords = {
    'paris': 48.8566,
    'tokyo': 35.6762,
    'new york': 40.7128,
    'london': 51.5074,
    'dubai': 25.2048,
    'singapore': 1.3521,
    'sydney': -33.8688,
    'rome': 41.9028,
    'barcelona': 41.3851,
    'amsterdam': 52.3676
  };
  
  const destLower = destination.toLowerCase();
  for (const [city, lat] of Object.entries(coords)) {
    if (destLower.includes(city)) {
      return lat;
    }
  }
  return 40.7128; // Default to New York
}

function getDestinationLng(destination) {
  const coords = {
    'paris': 2.3522,
    'tokyo': 139.6503,
    'new york': -74.0060,
    'london': -0.1278,
    'dubai': 55.2708,
    'singapore': 103.8198,
    'sydney': 151.2093,
    'rome': 12.4964,
    'barcelona': 2.1734,
    'amsterdam': 4.9041
  };
  
  const destLower = destination.toLowerCase();
  for (const [city, lng] of Object.entries(coords)) {
    if (destLower.includes(city)) {
      return lng;
    }
  }
  return -74.0060; // Default to New York
}

function getDayTheme(dayIndex, destination, travelType) {
  const themes = {
    adventure: ['Adventure Exploration', 'Thrill Seeking', 'Outdoor Discovery'],
    cultural: ['Cultural Immersion', 'Heritage Discovery', 'Local Experience'],
    relaxation: ['Relaxation & Wellness', 'Peaceful Journey', 'Serene Exploration'],
    food: ['Culinary Journey', 'Food Discovery', 'Gastronomic Adventure']
  };
  
  const typeThemes = themes[travelType] || themes.cultural;
  return typeThemes[dayIndex % typeThemes.length];
}

function getCountrySpecificTips(destination) {
  const tips = {
    'paris': [
      'Greet with "Bonjour" when entering shops',
      'Tipping 10% is standard at restaurants',
      'Museums are often closed on Mondays',
      'Metro day passes are cost-effective'
    ],
    'tokyo': [
      'Bow when greeting locals',
      'Remove shoes before entering homes',
      'Cash is preferred over cards',
      'Train etiquette is very important'
    ],
    'new york': [
      'Tipping 15-20% is expected',
      'Walking is the best way to explore',
      'Subway is fastest for long distances',
      'Street food is safe and delicious'
    ],
    'london': [
      'Stand on the right on escalators',
      'Tipping 10-12% is standard',
      'Oyster card saves money on transport',
      'Many museums are free entry'
    ]
  };
  
  const destLower = destination.toLowerCase();
  for (const [city, cityTips] of Object.entries(tips)) {
    if (destLower.includes(city)) {
      return cityTips;
    }
  }
  
  return [
    'Research local customs before visiting',
    'Keep emergency contacts handy',
    'Learn basic local phrases',
    'Respect local dress codes',
    'Be aware of local laws and regulations'
  ];
}

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`🚀 Simple Travel Planner API running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    console.log('💡 Try using a different port or kill the existing process');
  } else {
    console.error('❌ Server error:', err);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
