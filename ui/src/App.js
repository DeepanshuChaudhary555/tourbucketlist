import React, { useState, useEffect, useCallback } from "react";
import TripList from "./components/TripList";
import AddTrip from "./components/AddTrip";
import Login from "./components/Login"; // Assuming this handles both login/signup
import Homepage from "./components/Homepage";
import "./App.css";

function App() {
  const [trips, setTrips] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  const fetchTrips = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setTrips([]);
        return;
      }
      
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
    if (userData.token) {
      localStorage.setItem("token", userData.token);
      // Assuming you store the username/user data as well
      localStorage.setItem("user", JSON.stringify(userData)); 
    }
    // Remove auth-mode class when login succeeds
    document.body.classList.remove('auth-mode');
    setShowLogin(false);
    fetchTrips();
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setTrips([]);
    setShowLogin(false);
    // Don't add auth-mode class, let homepage handle its own styling
    document.body.classList.remove('auth-mode');
  };

  useEffect(() => {
    const initializeApp = async () => {
      // Check if user is already logged in
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      
      if (savedUser && token) {
        setUser(JSON.parse(savedUser));
        document.body.classList.remove('auth-mode');
        await fetchTrips();
      } else {
        // Don't add auth-mode class here, let the component decide
        document.body.classList.remove('auth-mode');
      }
      setLoading(false);
    };
    
    initializeApp();
  }, [fetchTrips]); // Run only on mount and when fetchTrips dependency changes

  if (loading) {
    return (
      <div className="App">
        <div className="loading-container">
          <div className="loading-spinner"></div> 
          <p>Loading your adventures...</p>
        </div>
      </div>
    );
  }

  const handleGetStarted = () => {
    setShowLogin(true);
    document.body.classList.add('auth-mode');
  };

  const handleBackToHome = () => {
    setShowLogin(false);
    document.body.classList.remove('auth-mode');
  };

  if (!user) {
    if (showLogin) {
      return (
        <div className="App">
          <div className="auth-navigation">
            <button className="back-to-home-btn" onClick={handleBackToHome}>
              ← Back to Home
            </button>
          </div>
          <Login onLogin={handleLogin} />
        </div>
      );
    } else {
      return (
        <div className="App">
          <Homepage onGetStarted={handleGetStarted} />
        </div>
      );
    }
  }

  return (
    <div className="App">
      <div className="hero-section">
        <div className="user-header">
          <div className="user-info">
            <span className="welcome-text">Welcome back, {user.username}!</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
        
        <div className="hero-content">
          <h1 className="main-title">
            {/* ADDED EMOJIS back to the travel-icon spans */}
            <span className="travel-icon"></span>
            Travel Bucket List
            <span className="travel-icon"></span>
          </h1>
          
          {/* --- UPDATED SUBTITLE FOR SEQUENTIAL ANIMATION --- */}
          <p className="subtitle">
            <span className="subtitle-phrase phrase-1">Discover.</span>
            <span className="subtitle-phrase phrase-2">Dream.</span>
            <span className="subtitle-phrase phrase-3">Explore.</span>
            <span className="subtitle-phrase phrase-4">Your adventure awaits!</span>
          </p>
          
        </div>
      </div>
      
      <div className="container">
        <AddTrip fetchTrips={fetchTrips} />
        <TripList trips={trips} fetchTrips={fetchTrips} />
      </div>
      
      <footer className="footer">
        <p>Made with love for travel lovers</p>
      </footer>
    </div>
  );
}

export default App;