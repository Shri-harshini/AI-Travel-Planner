import React, { useState } from 'react';

const NearbyRecommendations = ({ recommendations, dayNumber }) => {
  const [activeTab, setActiveTab] = useState('hotels');
  
  if (!recommendations) return null;

  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      return '₹0';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount);
  };

  const getCategoryColor = (category) => {
    const colors = {
      budget: 'bg-green-100 text-green-800 border-green-200',
      mid_range: 'bg-blue-100 text-blue-800 border-blue-200',
      luxury: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        ))}
        {hasHalfStar && (
          <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        )}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  return (
    <div className="card-soft mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <svg className="w-6 h-6 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Nearby Recommendations - Day {dayNumber}
        </h3>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
        {['hotels', 'food', 'shopping', 'optional', 'savings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
              activeTab === tab
                ? 'bg-indigo-500 text-white border-b-2 border-indigo-500'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {tab === 'hotels' && '🏨 Hotels'}
            {tab === 'food' && '🍽️ Food & Cafés'}
            {tab === 'shopping' && '🛍️ Shopping'}
            {tab === 'optional' && '📍 Optional Places'}
            {tab === 'savings' && '💰 Cost Savings'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {/* Hotels Tab */}
        {activeTab === 'hotels' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.hotels_nearby?.map((hotel, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-medium transition-shadow" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-semibold text-gray-800">{hotel.name}</h5>
                  <span className="text-sm text-gray-500 capitalize">{hotel.category.replace('_', ' ')}</span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <span className="text-gray-800">{getRatingStars(hotel.rating_out_of_5)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Distance:</span>
                    <span className="text-gray-800">{hotel.approx_distance_km_from_attractions} km</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Price/Night:</span>
                    <span className="font-semibold text-indigo-600">{formatCurrency(hotel.average_price_per_night_inr)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Food Tab */}
        {activeTab === 'food' && (
          <div className="space-y-6">
            {['morning', 'afternoon', 'evening'].map((timeSlot) => (
              <div key={timeSlot}>
                <h4 className="font-semibold text-gray-700 mb-3 capitalize flex items-center">
                  {timeSlot === 'morning' && <span className="mr-2">🌅</span>}
                  {timeSlot === 'afternoon' && <span className="mr-2">☀️</span>}
                  {timeSlot === 'evening' && <span className="mr-2">🌙</span>}
                  {timeSlot === 'morning' && 'Morning Cafés & Breakfast'}
                  {timeSlot === 'afternoon' && 'Afternoon Restaurants'}
                  {timeSlot === 'evening' && 'Evening Dining & Night Markets'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.food_nearby?.[timeSlot]?.map((place, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-medium transition-shadow" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-semibold text-gray-800">{place.name}</h5>
                        <span className="text-sm text-gray-500 capitalize">{place.type.replace('_', ' ')}</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Cuisine:</span>
                          <span className="text-gray-800">{place.cuisine}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Avg. Price:</span>
                          <span className="font-semibold text-indigo-600">{formatCurrency(place.average_price_inr)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Shopping Tab */}
        {activeTab === 'shopping' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.shopping_spots?.map((spot, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-medium transition-shadow" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{spot.name}</h4>
                  <span className="text-sm text-gray-500 capitalize">{spot.type.replace('_', ' ')}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{spot.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Price Range:</span>
                  <span className="font-semibold text-indigo-600">{spot.price_range}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Optional Places Tab */}
        {activeTab === 'optional' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.optional_places?.map((place, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-medium transition-shadow" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{place.name}</h4>
                  <span className="text-sm text-gray-500 capitalize">{place.type.replace('_', ' ')}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{place.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Entry Fee:</span>
                  <span className="font-semibold text-green-600">
                    {place.entry_fee_inr === 0 ? 'FREE' : formatCurrency(place.entry_fee_inr)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cost Savings Tab */}
        {activeTab === 'savings' && (
          <div className="space-y-4">
            {recommendations.cost_saving_alternatives?.map((saving, idx) => (
              <div key={idx} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-800">{saving.name}</h4>
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full capitalize">
                        {saving.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{saving.explanation}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm text-gray-600">Savings</div>
                    <div className="text-lg font-bold text-green-600">{formatCurrency(saving.approx_savings_in_inr)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyRecommendations;
