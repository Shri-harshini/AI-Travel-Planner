import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ destination, dayData }) => {
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState([48.8566, 2.3522]); // Default: Paris

  console.log('MapComponent - Destination:', destination);
  console.log('MapComponent - DayData:', dayData);

  // Mock coordinates for major cities
  const cityCoordinates = {
    'paris': [48.8566, 2.3522],
    'tokyo': [35.6762, 139.6503],
    'new york': [40.7128, -74.0060],
    'london': [51.5074, -0.1278],
    'dubai': [25.2048, 55.2708],
    'singapore': [1.3521, 103.8198],
    'sydney': [-33.8688, 151.2093],
    'rome': [41.9028, 12.4964],
    'barcelona': [41.3851, 2.1734],
    'amsterdam': [52.3676, 4.9041],
  };

  useEffect(() => {
    console.log('MapComponent useEffect triggered!');
    console.log('MapComponent useEffect - Center:', center);
    console.log('MapComponent useEffect - DayData:', dayData);
    console.log('MapComponent useEffect - Destination:', destination);
    
    // Set center based on destination
    const destLower = destination.toLowerCase();
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (destLower.includes(city)) {
        console.log('MapComponent - Setting center for', city, coords);
        setCenter(coords);
        break;
      }
    }

    // Generate mock markers for the day
    if (dayData) {
      const dayMarkers = [];
      
      // Add markers for attractions
      if (dayData.schedule?.morning?.attractions) {
        dayData.schedule.morning.attractions.forEach((attraction, idx) => {
          dayMarkers.push({
            id: `morning-attraction-${idx}`,
            name: attraction,
            category: 'Morning Attraction',
            description: `Morning visit to ${attraction}`,
            position: [
              center[0] + (Math.random() - 0.5) * 0.05,
              center[1] + (Math.random() - 0.5) * 0.05
            ],
            color: '#f59e0b' // amber
          });
        });
      }

      if (dayData.schedule?.afternoon?.attractions) {
        dayData.schedule.afternoon.attractions.forEach((attraction, idx) => {
          dayMarkers.push({
            id: `afternoon-attraction-${idx}`,
            name: attraction,
            category: 'Afternoon Attraction',
            description: `Afternoon visit to ${attraction}`,
            position: [
              center[0] + (Math.random() - 0.5) * 0.05,
              center[1] + (Math.random() - 0.5) * 0.05
            ],
            color: '#3b82f6' // blue
          });
        });
      }

      if (dayData.schedule?.evening?.attractions) {
        dayData.schedule.evening.attractions.forEach((attraction, idx) => {
          dayMarkers.push({
            id: `evening-attraction-${idx}`,
            name: attraction,
            category: 'Evening Attraction',
            description: `Evening visit to ${attraction}`,
            position: [
              center[0] + (Math.random() - 0.5) * 0.05,
              center[1] + (Math.random() - 0.5) * 0.05
            ],
            color: '#8b5cf6' // purple
          });
        });
      }

      // Add markers for landmarks
      if (dayData.schedule?.morning?.landmarks) {
        dayData.schedule.morning.landmarks.forEach((landmark, idx) => {
          dayMarkers.push({
            id: `morning-landmark-${idx}`,
            name: landmark,
            category: 'Morning Landmark',
            description: `Historic landmark: ${landmark}`,
            position: [
              center[0] + (Math.random() - 0.5) * 0.05,
              center[1] + (Math.random() - 0.5) * 0.05
            ],
            color: '#ef4444' // red
          });
        });
      }

      if (dayData.schedule?.afternoon?.landmarks) {
        dayData.schedule.afternoon.landmarks.forEach((landmark, idx) => {
          dayMarkers.push({
            id: `afternoon-landmark-${idx}`,
            name: landmark,
            category: 'Afternoon Landmark',
            description: `Historic landmark: ${landmark}`,
            position: [
              center[0] + (Math.random() - 0.5) * 0.05,
              center[1] + (Math.random() - 0.5) * 0.05
            ],
            color: '#ef4444' // red
          });
        });
      }

      if (dayData.schedule?.evening?.landmarks) {
        dayData.schedule.evening.landmarks.forEach((landmark, idx) => {
          dayMarkers.push({
            id: `evening-landmark-${idx}`,
            name: landmark,
            category: 'Evening Landmark',
            description: `Historic landmark: ${landmark}`,
            position: [
              center[0] + (Math.random() - 0.5) * 0.05,
              center[1] + (Math.random() - 0.5) * 0.05
            ],
            color: '#ef4444' // red
          });
        });
      }

      // Add markers for shopping spots
      if (dayData.nearby_recommendations?.shopping_spots) {
        dayData.nearby_recommendations.shopping_spots.forEach((spot, idx) => {
          dayMarkers.push({
            id: `shopping-${idx}`,
            name: spot.name,
            category: `Shopping: ${spot.type.replace('_', ' ')}`,
            description: `${spot.description} • ${spot.price_range}`,
            position: [spot.latitude, spot.longitude],
            color: '#ec4899' // pink
          });
        });
      }

      // Add markers for nearby hotels
      if (dayData.nearby_recommendations?.hotels_nearby) {
        dayData.nearby_recommendations.hotels_nearby.forEach((hotel, idx) => {
          dayMarkers.push({
            id: `hotel-${idx}`,
            name: hotel.name,
            category: `${hotel.category.replace('_', ' ')} Hotel`,
            description: `${hotel.category.replace('_', ' ')} hotel • ${hotel.approx_distance_km_from_attractions}km away • ₹${hotel.average_price_per_night_inr}/night`,
            position: [hotel.latitude, hotel.longitude],
            color: '#10b981' // emerald
          });
        });
      }

      // Add markers for nearby food places
      if (dayData.nearby_recommendations?.food_nearby) {
        ['morning', 'afternoon', 'evening'].forEach(timeSlot => {
          const foodPlaces = dayData.nearby_recommendations.food_nearby[timeSlot] || [];
          foodPlaces.forEach((place, idx) => {
            dayMarkers.push({
              id: `${timeSlot}-food-${idx}`,
              name: place.name,
              category: `${timeSlot} ${place.type.replace('_', ' ')}`,
              description: `${place.cuisine} • ₹${place.average_price_inr} avg`,
              position: [place.latitude, place.longitude],
              color: '#f97316' // orange
            });
          });
        });
      }

      // Add markers for optional places
      if (dayData.nearby_recommendations?.optional_places) {
        dayData.nearby_recommendations.optional_places.forEach((place, idx) => {
          dayMarkers.push({
            id: `optional-${idx}`,
            name: place.name,
            category: `Optional ${place.type.replace('_', ' ')}`,
            description: place.description,
            position: [place.latitude, place.longitude],
            color: '#06b6d4' // cyan
          });
        });
      }

      // Add markers for cost-saving alternatives
      if (dayData.nearby_recommendations?.cost_saving_alternatives) {
        dayData.nearby_recommendations.cost_saving_alternatives.forEach((saving, idx) => {
          if (saving.latitude && saving.longitude) {
            dayMarkers.push({
              id: `saving-${idx}`,
              name: saving.name,
              category: `Cost Saving: ${saving.type}`,
              description: `Save ₹${saving.approx_savings_in_inr}: ${saving.explanation}`,
              position: [saving.latitude, saving.longitude],
              color: '#22c55e' // green
            });
          }
        });
      }

      console.log('Generated markers:', dayMarkers.length, 'markers for day');
      console.log('Marker colors:', dayMarkers.map(m => ({ id: m.id, color: m.color, name: m.name })));
      console.log('MapComponent - Generated markers:', dayMarkers);
      setMarkers(dayMarkers);
    } else {
      console.log('MapComponent - No dayData provided');
      setMarkers([]);
    }
  }, [destination, dayData, center]);

  const createCustomIcon = (color) => {
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.4); z-index: 1000;"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      popupAnchor: [0, -8],
      className: 'custom-marker'
    });
  };

  if (!dayData) {
    return (
      <div className="bg-gray-100 rounded-xl p-8 text-center">
        <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p className="text-gray-600">Map will be available when itinerary is generated</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-soft overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-sky-500 text-white p-4">
        <h3 className="text-lg font-semibold flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Interactive Map - {destination}
        </h3>
      </div>
      
      <div style={{ height: '400px', width: '100%' }}>
        <MapContainer 
          center={center} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {markers.map((marker) => (
            <Marker 
              key={marker.id} 
              position={marker.position}
              icon={createCustomIcon(marker.color)}
              zIndexOffset={1000}
            >
              <Popup>
                <div className="text-sm">
                  <h4 className="font-semibold text-gray-800 mb-1">{marker.name}</h4>
                  <p className="text-xs text-gray-600 mb-1">{marker.category}</p>
                  <p className="text-xs text-gray-500">{marker.description}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      <div className="p-4 bg-gray-50 border-t">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Morning</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Afternoon</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Evening</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Landmarks</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Hotels</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Food</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Shopping</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Optional</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Savings</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
