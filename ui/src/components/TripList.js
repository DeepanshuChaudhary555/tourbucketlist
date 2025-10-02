import React from "react";
import TripItem from "./TripItem";

function TripList({ trips, fetchTrips }) {
  if (!trips.length) {
    return (
      <div className="no-trips">
        <h3>🗺️ Your adventure awaits!</h3>
        <p>Start building your travel bucket list by adding your dream destinations above.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: 'white', fontSize: '2.2rem', fontWeight: '600', marginBottom: '10px' }}>
          🌟 Your Travel Dreams
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
          {trips.length} amazing {trips.length === 1 ? 'destination' : 'destinations'} waiting to be explored
        </p>
      </div>
      
      <div className="trips-container">
        {trips.map((trip) => (
          <TripItem key={trip._id} trip={trip} fetchTrips={fetchTrips} />
        ))}
      </div>
    </div>
  );
}

export default TripList;
