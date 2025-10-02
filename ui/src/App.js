import React, { useState, useEffect } from "react";
import TripList from "./components/TripList";
import AddTrip from "./components/AddTrip";
import "./App.css";

function App() {
  const [trips, setTrips] = useState([]);

  const fetchTrips = async () => {
    try {
      const res = await fetch("http://localhost:5038/tourbucketlist");
      const data = await res.json();
      setTrips(data);
    } catch (err) {
      console.error("Failed to fetch trips:", err);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div className="App">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="main-title">
            <span className="travel-icon">✈️</span>
            Travel Bucket List
            <span className="travel-icon">🗺️</span>
          </h1>
          <p className="subtitle">Discover. Dream. Explore. Your adventure awaits!</p>
        </div>
      </div>
      
      <div className="container">
        <AddTrip fetchTrips={fetchTrips} />
        <TripList trips={trips} fetchTrips={fetchTrips} />
      </div>
      
      <footer className="footer">
        <p>Made with ❤️ for wanderlust souls</p>
      </footer>
    </div>
  );
}

export default App;
