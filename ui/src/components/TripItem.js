import React, { useState } from "react";

function TripItem({ trip, fetchTrips }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(trip.title);
  const [description, setDescription] = useState(trip.description);
  const [location, setLocation] = useState(trip.location || "");
  const [budget, setBudget] = useState(trip.budget || "");
  const [rating, setRating] = useState(trip.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove "${trip.title}" from your bucket list?`)) {
      try {
        await fetch(`http://localhost:5038/tourbucketlist/${trip._id}`, {
          method: "DELETE",
        });
        fetchTrips();
      } catch (err) {
        console.error("Failed to delete trip:", err);
      }
    }
  };

  const handleUpdate = async () => {
    try {
      await fetch(`http://localhost:5038/tourbucketlist/${trip._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          description, 
          location: location || "Not specified",
          budget: budget || "Not specified",
          rating: rating
        }),
      });
      setIsEditing(false);
      fetchTrips();
    } catch (err) {
      console.error("Failed to update trip:", err);
    }
  };

  const handleCancel = () => {
    setTitle(trip.title);
    setDescription(trip.description);
    setLocation(trip.location || "");
    setBudget(trip.budget || "");
    setRating(trip.rating || 0);
    setIsEditing(false);
  };

  return (
    <div className="trip-item">
      {isEditing ? (
        <div className="edit-form">
          <input
            className="edit-input"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="🏝️ Destination"
          />
          <input
            className="edit-input"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="📍 Specific Location"
          />
          <input
            className="edit-input"
            type="text"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="💰 Budget"
          />
          <textarea
            className="edit-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="📝 Description"
            rows="4"
          />
          <div className="edit-rating">
            <label className="rating-label">⭐ Excitement Level:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>
          <div className="trip-actions">
            <button className="btn btn-save" onClick={handleUpdate}>
              ✅ Save Changes
            </button>
            <button className="btn btn-cancel" onClick={handleCancel}>
              ❌ Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h3 className="trip-title">{trip.title}</h3>
          
          {trip.location && trip.location !== "Not specified" && (
            <div style={{ marginBottom: '10px', color: '#666', fontSize: '0.9rem' }}>
              📍 <strong>Location:</strong> {trip.location}
            </div>
          )}
          
          {trip.budget && trip.budget !== "Not specified" && (
            <div style={{ marginBottom: '15px', color: '#666', fontSize: '0.9rem' }}>
              💰 <strong>Budget:</strong> {trip.budget}
            </div>
          )}
          
          {trip.rating && trip.rating > 0 && (
            <div className="trip-rating" style={{ marginBottom: '15px' }}>
              <span className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`star ${star <= trip.rating ? 'filled' : 'empty'}`}>
                    {star <= trip.rating ? '⭐' : '☆'}
                  </span>
                ))}
              </span>
              <span className="rating-text">
                {trip.rating === 1 && " - Mildly interested"}
                {trip.rating === 2 && " - Somewhat excited"}
                {trip.rating === 3 && " - Very excited"}
                {trip.rating === 4 && " - Extremely excited"}
                {trip.rating === 5 && " - Dream destination!"}
              </span>
            </div>
          )}
          
          <p className="trip-description">{trip.description}</p>
          
          <div className="trip-actions">
            <button className="btn btn-edit" onClick={() => setIsEditing(true)}>
              ✏️ Edit
            </button>
            <button className="btn btn-delete" onClick={handleDelete}>
              🗑️ Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TripItem;