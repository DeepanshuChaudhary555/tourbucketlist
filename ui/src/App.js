import React, { useState, useEffect, useCallback } from "react";
import TripList from "./components/TripList";
import AddTrip from "./components/AddTrip";
import Login from "./components/Login";
import "./App.css";

function App() {
  const [trips, setTrips] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTrips = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5038/tourbucketlist", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setTrips(data);
      } else if (res.status === 401) {
        // Token is invalid, logout user
        handleLogout();
      }
    } catch (err) {
      console.error("Failed to fetch trips:", err);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    // Token is already set in Login component, but let's ensure it's set
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
    fetchTrips();
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setTrips([]);
  };

  useEffect(() => {
    const initializeApp = async () => {
      // Check if user is already logged in
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      
      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
        await fetchTrips();
      }
      setLoading(false);
    };
    
    initializeApp();
  }, [fetchTrips]);

  if (loading) {
    return (
      <div className="App">
        <div className="loading-container">
          <div className="loading-spinner">🌍</div>
          <p>Loading your adventures...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="App">
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="App">
      <div className="hero-section">
        <div className="user-header">
          <div className="user-info">
            <span className="welcome-text">Welcome back, {user.username}! 👋</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
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
        <p>Made with for wanderlust souls</p>
      </footer>
    </div>
  );
}

export default App;
