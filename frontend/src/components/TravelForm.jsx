import React, { useState } from 'react';

const TravelForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    destination: '',
    budget: '',
    duration: '',
    interests: [],
    travelType: ''
  });

  const interests = [
    { id: 'nature', label: 'Nature', color: 'bg-green-100 text-green-700 border-green-200' },
    { id: 'adventure', label: 'Adventure', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { id: 'culture', label: 'Culture', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { id: 'food', label: 'Food', color: 'bg-red-100 text-red-700 border-red-200' },
    { id: 'nightlife', label: 'Nightlife', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    { id: 'relaxation', label: 'Relaxation', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'shopping', label: 'Shopping', color: 'bg-pink-100 text-pink-700 border-pink-200' },
    { id: 'photography', label: 'Photography', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' }
  ];

  const travelTypes = [
    { value: 'solo', label: 'Solo Travel' },
    { value: 'couple', label: 'Couple' },
    { value: 'family', label: 'Family' },
    { value: 'friends', label: 'Friends' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleInterest = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Plan Your Perfect Trip
          </h2>
          <p className="text-lg text-gray-600">
            Tell us about your travel preferences and we'll create a personalized itinerary just for you
          </p>
        </div>

        <div className="card-soft">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Where do you want to go?
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                placeholder="e.g., Paris, Bali, New York..."
                className="input-field w-full"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget (₹)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  placeholder="e.g., 50000"
                  min="1000"
                  className="input-field w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (days)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g., 5"
                  min="1"
                  max="30"
                  className="input-field w-full"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What interests you? (Select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {interests.map((interest) => (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggleInterest(interest.id)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                      formData.interests.includes(interest.id)
                        ? `${interest.color} border-opacity-100 shadow-soft`
                        : 'bg-white/50 border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {interest.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Travel Type
              </label>
              <select
                name="travelType"
                value={formData.travelType}
                onChange={handleInputChange}
                className="input-field w-full"
                required
              >
                <option value="">Select travel type</option>
                {travelTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Your Itinerary...
                </span>
              ) : (
                'Generate Itinerary'
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default TravelForm;
