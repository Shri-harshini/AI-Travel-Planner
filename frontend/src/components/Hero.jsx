import React from 'react';

const Hero = ({ onStartPlanning }) => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-8 animate-float">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-400 to-sky-400 rounded-2xl shadow-large mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
          ✈️ Discover Your Perfect
          <span className="block bg-gradient-to-r from-indigo-600 to-sky-600 bg-clip-text text-transparent">
            Travel Journey
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Create personalized, AI-powered travel itineraries tailored to your budget, interests, and travel style. 
          Experience the world your way.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button 
            onClick={onStartPlanning}
            className="btn-primary text-lg px-8 py-4"
          >
            Start Planning Your Trip
          </button>
          <button className="btn-secondary text-lg px-8 py-4">
            Learn More
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="card-soft text-center group hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse-soft">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Budget-Friendly</h3>
            <p className="text-gray-600 text-sm">Plans that fit your budget in Indian Rupees</p>
          </div>
          
          <div className="card-soft text-center group hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-sky-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse-soft">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">AI-Powered</h3>
            <p className="text-gray-600 text-sm">Smart recommendations based on your interests</p>
          </div>
          
          <div className="card-soft text-center group hover:scale-105 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse-soft">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              ✈️ AI Travel Planner
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Your smart journey companion. Get personalized itineraries with nearby recommendations, cost-saving tips, and interactive maps.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
