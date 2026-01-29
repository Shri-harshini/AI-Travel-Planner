import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import MapComponent from './MapComponent';
import NearbyRecommendations from './NearbyRecommendations';

const ItineraryDisplay = ({ itinerary, onRegenerate }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const mapRef = useRef(null);

  console.log('ItineraryDisplay - Component rendered');
  console.log('ItineraryDisplay - SelectedDay:', selectedDay);

  if (!itinerary) return null;

  const handleExportPDF = async () => {
    try {
      console.log('Starting PDF export...');
      console.log('Itinerary data:', itinerary);

      // Simple test - create a basic PDF
      const pdf = new jsPDF();
      pdf.setFontSize(20);
      pdf.text('Travel Itinerary', 20, 20);
      pdf.setFontSize(14);
      pdf.text(`Destination: ${itinerary.destination || 'Unknown'}`, 20, 40);
      pdf.text(`Duration: ${itinerary.duration || 'N/A'} days`, 20, 50);
      pdf.text(`Budget: ₹${itinerary.total_estimated_cost_inr || 0}`, 20, 60);

      // Add days
      if (itinerary.days && itinerary.days.length > 0) {
        let y = 80;
        itinerary.days.forEach((day) => {
          pdf.setFontSize(12);
          pdf.text(`Day ${day.day}: ${day.theme}`, 20, y);
          y += 10;
        });
      }

      const fileName = `${itinerary.destination || 'travel'}-itinerary.pdf`;
      pdf.save(fileName);

      console.log('PDF saved successfully!');
      alert('PDF exported successfully!');
      return true;

    } catch (error) {
      console.error('PDF export error:', error);
      alert('PDF export failed: ' + error.message);
      return false;
    }
  };

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

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Your Personalized Itinerary
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            {itinerary.destination} • {itinerary.duration} days • {formatCurrency(itinerary.total_estimated_cost)}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRegenerate}
              className="btn-secondary"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Regenerate
            </button>
            <button
              onClick={handleExportPDF}
              className="btn-secondary"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export PDF
            </button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Interactive Map Section */}
          <div ref={mapRef} className="card-soft">
            <MapComponent
              destination={itinerary.destination || 'Your Destination'}
              dayData={selectedDay || itinerary.days?.[0]}
            />
            {console.log('MapComponent rendered with dayData:', selectedDay || itinerary.days?.[0])}
            {console.log('Current selectedDay:', selectedDay)}
          </div>

          {/* Day Cards */}
          {itinerary.days.map((day, index) => (
            <div
              key={day.day}
              className={`card-soft group hover:shadow-large transition-all duration-300 cursor-pointer ${selectedDay?.day === day.day ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
                }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('=== DAY CLICKED ===');
                console.log('Day clicked:', day.day);
                console.log('Day data:', day);
                console.log('Previous selectedDay:', selectedDay);
                setSelectedDay(day);
                console.log('Set selectedDay to:', day);
                console.log('Map should update now!');

                // Scroll map into view
                if (mapRef.current) {
                  mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

                setTimeout(() => {
                  console.log('SelectedDay after timeout:', selectedDay);
                }, 100);
              }}
              style={{ pointerEvents: 'auto', cursor: 'pointer' }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Day {day.day}: {day.theme}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Daily Budget: {formatCurrency(day.estimated_cost)}
                    </span>
                    <span className="flex items-center text-xs text-gray-500">
                      <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Click to view map
                    </span>
                  </div>
                </div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-indigo-400 to-sky-400 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-soft group-hover:scale-110 transition-transform">
                  {day.day}
                  {selectedDay?.day === day.day && (
                    <svg className="w-4 h-4 absolute -top-1 -right-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Time-based Schedule Display */}
              <div className="space-y-6">
                {/* Morning */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-100">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Morning (6:00 AM - 12:00 PM)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">Activities</h5>
                      <ul className="space-y-1">
                        {day.schedule?.morning?.activities?.map((activity, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">Attractions & Landmarks</h5>
                      <ul className="space-y-1">
                        {day.schedule?.morning?.attractions?.map((attraction, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            {attraction}
                          </li>
                        ))}
                        {day.schedule?.morning?.landmarks?.map((landmark, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            {landmark}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Afternoon */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Afternoon (12:00 PM - 6:00 PM)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">Activities</h5>
                      <ul className="space-y-1">
                        {day.schedule?.afternoon?.activities?.map((activity, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">Attractions & Landmarks</h5>
                      <ul className="space-y-1">
                        {day.schedule?.afternoon?.attractions?.map((attraction, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            {attraction}
                          </li>
                        ))}
                        {day.schedule?.afternoon?.landmarks?.map((landmark, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            {landmark}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Evening */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    Evening (6:00 PM - 11:00 PM)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">Activities</h5>
                      <ul className="space-y-1">
                        {day.schedule?.evening?.activities?.map((activity, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-600 mb-2">Attractions & Landmarks</h5>
                      <ul className="space-y-1">
                        {day.schedule?.evening?.attractions?.map((attraction, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <span className="w-1.5 h-1.5 bg-pink-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            {attraction}
                          </li>
                        ))}
                        {day.schedule?.evening?.landmarks?.map((landmark, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            {landmark}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {day.travel_tips && day.travel_tips.length > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-sky-50 rounded-xl border border-indigo-100">
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Travel Tips
                  </h4>
                  <ul className="space-y-1">
                    {day.travel_tips.map((tip, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start">
                        <span className="text-indigo-400 mr-2">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Nearby Recommendations */}
              {day.nearby_recommendations && (
                <NearbyRecommendations
                  recommendations={day.nearby_recommendations}
                  dayNumber={day.day}
                />
              )}
            </div>
          ))}
        </div>

        {/* Country-Specific Travel Tips */}
        {itinerary.country_specific_tips && itinerary.country_specific_tips.length > 0 && (
          <div className="mt-12 card-soft bg-gradient-to-br from-teal-50 to-indigo-50">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Country-Specific Travel Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {itinerary.country_specific_tips.map((tip, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="w-2 h-2 bg-teal-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-sky-500 text-white rounded-2xl shadow-large">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">Total Estimated Cost: {formatCurrency(itinerary.total_estimated_cost_inr || 0)}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ItineraryDisplay;
