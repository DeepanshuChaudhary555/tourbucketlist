import React from "react";
import TripItem from "./TripItem";

function TripList({ trips, fetchTrips }) {
  if (!trips.length) return <p>No trips yet!</p>;

  return (
    <div>
      {trips.map((trip) => (
        <TripItem key={trip._id} trip={trip} fetchTrips={fetchTrips} />
      ))}
    </div>
  );
}

export default TripList;
