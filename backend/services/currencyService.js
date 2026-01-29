const axios = require('axios');

class CurrencyService {
  static async convertCurrency(amount, fromCurrency = 'INR', toCurrency = 'USD') {
    try {
      // Try real API first (no key needed now)
      return await this.callCurrencyAPI(amount, fromCurrency, toCurrency);
    } catch (error) {
      console.error('Currency Service Error:', error);
      return this.getMockConversion(amount, fromCurrency, toCurrency);
    }
  }

  static async callCurrencyAPI(amount, fromCurrency, toCurrency) {
    // Using ExchangeRate-API (OPEN endpoint - no key required)
    // https://open.er-api.com/v6/latest/USD
    const response = await axios.get(`https://open.er-api.com/v6/latest/${fromCurrency}`);

    // Check callback status
    if (response.data.result !== 'success') {
      throw new Error(`Exchange rate API error: ${response.data.error_type}`);
    }

    const rate = response.data.rates[toCurrency];
    if (!rate) {
      throw new Error(`Exchange rate not available for ${toCurrency}`);
    }

    return {
      amount: amount * rate,
      rate: rate,
      from: fromCurrency,
      to: toCurrency,
      lastUpdated: response.data.time_last_update_unix
    };
  }

  static getMockConversion(amount, fromCurrency, toCurrency) {
    // Mock exchange rates (INR base)
    const mockRates = {
      'INR-USD': 0.012,
      'INR-EUR': 0.011,
      'INR-GBP': 0.0095,
      'INR-JPY': 1.82,
      'INR-AUD': 0.018,
      'INR-CAD': 0.016,
      'INR-CHF': 0.0105,
      'INR-CNY': 0.087,
      'INR-SGD': 0.016,
      'INR-AED': 0.044,
      'USD-INR': 83.5,
      'EUR-INR': 91.2,
      'GBP-INR': 105.3,
      'JPY-INR': 0.55,
      'AUD-INR': 55.8,
      'CAD-INR': 62.1,
      'CHF-INR': 95.2,
      'CNY-INR': 11.5,
      'SGD-INR': 62.5,
      'AED-INR': 22.7
    };

    const key = `${fromCurrency}-${toCurrency}`;
    let rate = mockRates[key];

    // If direct rate not found, try reverse calculation
    if (!rate) {
      const reverseKey = `${toCurrency}-${fromCurrency}`;
      const reverseRate = mockRates[reverseKey];
      if (reverseRate) {
        rate = 1 / reverseRate;
      } else {
        // Default fallback rates
        rate = fromCurrency === 'INR' ? 0.012 : 83.5; // Default INR-USD or USD-INR
      }
    }

    return {
      amount: amount * rate,
      rate: rate,
      from: fromCurrency,
      to: toCurrency,
      lastUpdated: Math.floor(Date.now() / 1000),
      note: 'Mock exchange rate - replace with real API for production'
    };
  }

  static async getMultipleConversions(amount, fromCurrency = 'INR') {
    const targetCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];
    const conversions = {};

    for (const currency of targetCurrencies) {
      try {
        conversions[currency] = await this.convertCurrency(amount, fromCurrency, currency);
      } catch (error) {
        console.error(`Failed to convert to ${currency}:`, error);
      }
    }

    return conversions;
  }
}

module.exports = CurrencyService;
