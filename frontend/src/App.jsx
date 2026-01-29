import React, { useState } from 'react';
import Hero from './components/Hero';
import TravelForm from './components/TravelForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('hero');
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate itinerary');
      }

      const data = await response.json();
      setItinerary(data);
      setCurrentView('itinerary');
    } catch (err) {
      setError(err.message);
      console.error('Error generating itinerary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    setCurrentView('form');
  };



  const handleStartPlanning = () => {
    setCurrentView('form');
  };

  return (
    <div className="min-h-screen">
      {currentView === 'hero' && (
        <Hero onStartPlanning={handleStartPlanning} />
      )}

      {currentView === 'form' && (
        <TravelForm
          onSubmit={handleFormSubmit}
          loading={loading}
        />
      )}

      {currentView === 'itinerary' && (
        <ItineraryDisplay
          itinerary={itinerary}
          onRegenerate={handleRegenerate}

        />
      )}

      {error && (
        <div className="fixed bottom-4 right-4 max-w-md bg-red-50 border border-red-200 rounded-xl p-4 shadow-large">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-red-800 font-medium">Error</h4>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
