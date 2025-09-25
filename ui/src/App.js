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
      <h1>Travel Bucket List</h1>
      <AddTrip fetchTrips={fetchTrips} />
      <TripList trips={trips} fetchTrips={fetchTrips} />
    </div>
  );
}

export default App;
