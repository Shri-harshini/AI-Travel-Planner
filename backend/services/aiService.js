const axios = require('axios');

class AIService {
  static async generateItinerary(formData) {
    const { destination, budget, duration, interests, travelType } = formData;

    // AI Prompt Engineering - Structured for consistent JSON output
    const prompt = `You are an expert travel planner specializing in creating personalized, budget-conscious itineraries for Indian travelers. 

Create a detailed day-wise travel itinerary for ${destination} with the following specifications:
- Budget: ₹${budget} (Indian Rupees)
- Duration: ${duration} days
- Interests: ${interests.join(', ') || 'General exploration'}
- Travel Type: ${travelType}

IMPORTANT GUIDELINES:
1. Stay strictly within the budget - total cost should not exceed ₹${budget}
2. Distribute costs evenly across all days
3. Focus on authentic local experiences and value for money
4. Include practical, actionable advice
5. Consider Indian travel preferences and cultural context

RESPONSE FORMAT (Strict JSON):
{
  "destination": "${destination}",
  "duration": ${duration},
  "total_estimated_cost": number,
  "days": [
    {
      "day": number,
      "theme": "string",
      "activities": ["string", "string", "string"],
      "attractions": ["string", "string", "string"],
      "estimated_cost": number,
      "travel_tips": ["string", "string"]
    }
  ],
  "general_tips": ["string", "string", "string"]
}

Generate realistic, practical, and inspiring travel plans that provide excellent value within the specified budget.`;

    try {
      // Try different AI services based on available API keys
      if (process.env.OPENAI_API_KEY) {
        return await this.callOpenAI(prompt);
      } else if (process.env.GEMINI_API_KEY) {
        return await this.callGemini(prompt);
      } else if (process.env.CLAUDE_API_KEY) {
        return await this.callClaude(prompt);
      } else {
        // Fallback to mock response if no AI API is configured
        return this.generateMockItinerary(formData);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      // Fallback to mock response on any error
      return this.generateMockItinerary(formData);
    }
  }

  static async callOpenAI(prompt) {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional travel planner. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  }

  static async callGemini(prompt) {
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      contents: [{
        parts: [{
          text: prompt + '\n\nRespond with valid JSON only.'
        }]
      }]
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const content = response.data.candidates[0].content.parts[0].text;
    return JSON.parse(content);
  }

  static async callClaude(prompt) {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-haiku-20240307',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt + '\n\nRespond with valid JSON only.'
        }
      ]
    }, {
      headers: {
        'x-api-key': process.env.CLAUDE_API_KEY,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      }
    });

    const content = response.data.content[0].text;
    return JSON.parse(content);
  }

  static generateMockItinerary(formData) {
    const { destination, budget, duration, interests, travelType } = formData;

    const mockResponse = {
      destination,
      duration: parseInt(duration),
      total_estimated_cost: Math.floor(budget * 0.85),
      days: [],
      general_tips: [
        'Book accommodations in advance for better rates',
        'Try local street food for authentic and budget-friendly meals',
        'Use public transportation to save on travel costs',
        'Carry a water bottle to stay hydrated',
        'Learn a few basic phrases in the local language'
      ]
    };

    // Theme and activity templates based on interests
    const themes = {
      nature: ['Nature Exploration', 'Wildlife & Parks', 'Scenic Beauty', 'Eco Adventures'],
      adventure: ['Adventure Day', 'Thrill Seeking', 'Outdoor Sports', 'Extreme Activities'],
      culture: ['Cultural Immersion', 'Heritage Walk', 'Local Traditions', 'Art & History'],
      food: ['Food Journey', 'Culinary Tour', 'Local Cuisine', 'Street Food Safari'],
      nightlife: ['Nightlife Experience', 'Evening Entertainment', 'City Lights', 'Social Scene'],
      relaxation: ['Relaxation Day', 'Wellness & Spa', 'Peaceful Retreat', 'Leisure Time'],
      shopping: ['Shopping Tour', 'Local Markets', 'Souvenir Hunt', 'Retail Therapy'],
      photography: ['Photography Day', 'Scenic Shots', 'Local Life', 'Instagram Spots']
    };

    const activities = {
      nature: ['Morning nature walk', 'Visit botanical garden', 'Wildlife sanctuary tour', 'Sunset photography'],
      adventure: ['Hiking adventure', 'Water sports activities', 'Rock climbing', 'Zip-lining experience'],
      culture: ['Museum visit', 'Historical site tour', 'Cultural performance', 'Art gallery exploration'],
      food: ['Food market tour', 'Cooking class', 'Local restaurant hopping', 'Street food tasting'],
      nightlife: ['Rooftop bar visit', 'Live music venue', 'Night market exploration', 'Club experience'],
      relaxation: ['Spa treatment', 'Beach relaxation', 'Meditation session', 'Sunset yoga'],
      shopping: ['Local market shopping', 'Souvenir hunting', 'Mall exploration', 'Boutique visits'],
      photography: ['Golden hour shoot', 'Street photography', 'Architecture tour', 'Portrait session']
    };

    const attractions = {
      nature: ['National Park', 'Nature Reserve', 'Botanical Garden', 'Scenic Viewpoint'],
      adventure: ['Adventure Park', 'Mountain Peak', 'Waterfall', 'Adventure Center'],
      culture: ['Historical Monument', 'Museum', 'Cultural Center', 'Heritage Site'],
      food: ['Food Market', 'Local Restaurant', 'Cooking School', 'Winery'],
      nightlife: ['Popular Bar', 'Night Club', 'Entertainment District', 'Live Music Venue'],
      relaxation: ['Spa Center', 'Beach Resort', 'Wellness Retreat', 'Peaceful Garden'],
      shopping: ['Shopping Mall', 'Local Market', 'Boutique District', 'Craft Market'],
      photography: ['Scenic Overlook', 'Historic District', 'Art Installation', 'City Skyline']
    };

    // Generate days based on interests
    for (let i = 0; i < parseInt(duration); i++) {
      const primaryInterest = interests[i % interests.length] || 'culture';
      const dayThemes = themes[primaryInterest] || themes.culture;
      const dayActivities = activities[primaryInterest] || activities.culture;
      const dayAttractions = attractions[primaryInterest] || attractions.culture;

      mockResponse.days.push({
        day: i + 1,
        theme: dayThemes[i % dayThemes.length],
        schedule: {
          morning: {
            activities: [dayActivities[0], dayActivities[1]],
            attractions: [dayAttractions[0], dayAttractions[1]]
          },
          afternoon: {
            activities: [dayActivities[2] || dayActivities[0]],
            attractions: [dayAttractions[2] || dayAttractions[0]]
          },
          evening: {
            activities: [dayActivities[3] || dayActivities[1]],
            attractions: [dayAttractions[3] || dayAttractions[1]]
          }
        },
        estimated_cost: Math.floor((budget * 0.85) / duration),
        travel_tips: [
          'Start early to avoid crowds',
          'Carry water and stay hydrated',
          'Wear comfortable walking shoes',
          'Keep some local currency handy'
        ]
      });
    }

    return mockResponse;
  }
}

module.exports = AIService;
