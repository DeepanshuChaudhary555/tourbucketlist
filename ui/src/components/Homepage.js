import React, { useState, useEffect } from "react";

function Homepage({ onGetStarted }) {
  const [topDestinations, setTopDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopDestinations();
  }, []);

  const fetchTopDestinations = async () => {
    try {
      const response = await fetch("http://localhost:5038/top-destinations");
      if (response.ok) {
        const data = await response.json();
        setTopDestinations(data);
      }
    } catch (err) {
      console.error("Failed to fetch top destinations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    onGetStarted();
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <div className="homepage-hero">
        <div className="hero-content">
          <h1 className="homepage-title">
            <span className="travel-icon">✈️</span>
            Travel Bucket List
            <span className="travel-icon">🌍</span>
          </h1>
          
          <p className="homepage-subtitle">
            <span className="subtitle-phrase phrase-1">Discover.</span>
            <span className="subtitle-phrase phrase-2">Dream.</span>
            <span className="subtitle-phrase phrase-3">Explore.</span>
            <span className="subtitle-phrase phrase-4">Your adventure awaits!</span>
          </p>

          <p className="homepage-description">
            Join thousands of travelers sharing their bucket lists and discovering amazing destinations worldwide. 
            Create your personalized travel wishlist and get inspired by top-rated destinations from our community.
          </p>

          <button className="get-started-btn" onClick={handleGetStarted}>
            🚀 Get Started
          </button>
        </div>
      </div>

      {/* Top Destinations Section */}
      <div className="destinations-section">
        <div className="container">
          <h2 className="section-title">
            <span className="title-icon">🏆</span>
            Top Rated Destinations
          </h2>
          
          {loading ? (
            <div className="loading-destinations">
              <div className="loading-spinner"></div>
              <p>Loading amazing destinations...</p>
            </div>
          ) : (
            <div className="destinations-grid">
              {topDestinations.map((destination, index) => (
                <div key={index} className="destination-card">
                  <div className="destination-image">
                    <img 
                      src={destination.image} 
                      alt={destination.destination}
                      onError={(e) => {
                        e.target.src = `https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&w=400`;
                      }}
                    />
                    <div className="rating-badge">
                      <span className="star">⭐</span>
                      {destination.avgRating}
                    </div>
                  </div>
                  
                  <div className="destination-content">
                    <h3 className="destination-name">{destination.destination}</h3>
                    <p className="destination-country">📍 {destination.country}</p>
                    <p className="destination-description">{destination.description}</p>
                    
                    <div className="destination-stats">
                      <span className="visits-count">👥 {destination.totalVisits} travelers</span>
                    </div>
                    
                    {destination.activities && destination.activities.length > 0 && (
                      <div className="activities">
                        {destination.activities.slice(0, 3).map((activity, actIndex) => (
                          <span key={actIndex} className="activity-tag">{activity}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Start Your Journey?</h2>
            <p className="cta-description">
              Create your account and join our community of passionate travelers. 
              Share your experiences, discover hidden gems, and make your travel dreams come true.
            </p>
            <button className="cta-btn" onClick={handleGetStarted}>
              Join Our Community 🌟
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="homepage-footer">
        <div className="container">
          <p>✨ Made with love for travel lovers ✨</p>
        </div>
      </footer>
    </div>
  );
}

export default Homepage;