import React, { useState } from "react";

function TripItem({ trip, fetchTrips }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(trip.title);
  const [description, setDescription] = useState(trip.description);

  // Delete a trip
  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:5038/tourbucketlist/${trip._id}`, {
        method: "DELETE",
      });
      fetchTrips();
    } catch (err) {
      console.error("Failed to delete trip:", err);
    }
  };

  // Update a trip
  const handleUpdate = async () => {
    try {
      await fetch(`http://localhost:5038/tourbucketlist/${trip._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      setIsEditing(false);
      fetchTrips();
    } catch (err) {
      console.error("Failed to update trip:", err);
    }
  };

  return (
    <div className="trip-item">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Trip Title"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <button className="save" onClick={handleUpdate}>
            Save
          </button>
          <button className="cancel" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <div>
          <h3>{trip.title}</h3>
          <p>{trip.description}</p>
          <button className="edit" onClick={() => setIsEditing(true)}>
            Edit
          </button>
          <button className="delete" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default TripItem;