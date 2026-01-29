const axios = require('axios');

class WeatherService {
  static async getWeather(destination) {
    try {
      return await this.callWeatherAPI(destination);
    } catch (error) {
      console.error('Weather Service Error:', error.message);
      return this.getMockWeather(destination);
    }
  }

  static async callWeatherAPI(destination) {
    // 1. Get coordinates using Open-Meteo Geocoding API (Free, no key)
    const geoResponse = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: {
        name: destination,
        count: 1,
        language: 'en',
        format: 'json'
      }
    });

    if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
      throw new Error('Location not found');
    }

    const { latitude, longitude, name, country } = geoResponse.data.results[0];

    // 2. Get weather using Open-Meteo Weather API (Free, no key)
    const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
        wind_speed_unit: 'kmh'
      }
    });

    const current = weatherResponse.data.current;

    // Map WMO weather codes to descriptions
    const condition = this.getWeatherDescription(current.weather_code);

    return {
      temperature: Math.round(current.temperature_2m),
      condition: condition,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      location: `${name}, ${country}`,
      icon: this.getWeatherIcon(current.weather_code)
    };
  }

  static getWeatherDescription(code) {
    // WMO Weather interpretation codes (http://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM)
    const codes = {
      0: 'Clear sky',
      1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
      45: 'Fog', 48: 'Depositing rime fog',
      51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
      61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
      71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight showers', 81: 'Moderate showers', 82: 'Violent showers',
      95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Ugly thunderstorm'
    };
    return codes[code] || 'Unknown';
  }

  static getWeatherIcon(code) {
    // Simple mapping to OpenWeatherMap style icon codes for compatibility
    if (code === 0) return '01d';
    if (code >= 1 && code <= 3) return '02d';
    if (code >= 45 && code <= 48) return '50d';
    if (code >= 51 && code <= 67) return '09d';
    if (code >= 71 && code <= 77) return '13d';
    if (code >= 80 && code <= 82) return '09d';
    if (code >= 95 && code <= 99) return '11d';
    return '01d';
  }

  static getMockWeather(destination) {
    // Mock weather data based on destination name patterns
    const weatherPatterns = {
      beach: { temperature: 28, condition: 'Sunny', humidity: 70, windSpeed: 15 },
      mountain: { temperature: 18, condition: 'Partly Cloudy', humidity: 55, windSpeed: 20 },
      city: { temperature: 25, condition: 'Clear', humidity: 60, windSpeed: 10 },
      desert: { temperature: 35, condition: 'Hot and Sunny', humidity: 25, windSpeed: 8 },
      tropical: { temperature: 30, condition: 'Humid', humidity: 80, windSpeed: 12 },
      default: { temperature: 22, condition: 'Pleasant', humidity: 65, windSpeed: 10 }
    };

    const destinationLower = destination.toLowerCase();
    let weather = weatherPatterns.default;

    if (destinationLower.includes('beach') || destinationLower.includes('coast') || destinationLower.includes('sea')) {
      weather = weatherPatterns.beach;
    } else if (destinationLower.includes('mountain') || destinationLower.includes('hill') || destinationLower.includes('peak')) {
      weather = weatherPatterns.mountain;
    } else if (destinationLower.includes('desert') || destinationLower.includes('sahara') || destinationLower.includes('arabian')) {
      weather = weatherPatterns.desert;
    } else if (destinationLower.includes('tropical') || destinationLower.includes('amazon') || destinationLower.includes('bali')) {
      weather = weatherPatterns.tropical;
    } else if (destinationLower.includes('city') || destinationLower.includes('urban') || destinationLower.includes('metropolitan')) {
      weather = weatherPatterns.city;
    }

    return {
      ...weather,
      location: destination,
      icon: '01d' // Default sunny icon
    };
  }
}

module.exports = WeatherService;
