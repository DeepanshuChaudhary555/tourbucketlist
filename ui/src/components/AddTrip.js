import React, { useState } from "react";

function AddTrip({ fetchTrips }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5038/tourbucketlist", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title, 
          description, 
          location: location || "Not specified",
          budget: budget || "Not specified",
          rating: rating
        }),
      });
      setTitle("");
      setDescription("");
      setLocation("");
      setBudget("");
      setRating(0);
      fetchTrips();
    } catch (err) {
      console.error("Failed to add trip:", err);
    }
  };

  return (
    <div className="add-trip-form">
      <h2 className="form-title">✨ Add Your Dream Destination</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <input
              className="form-input"
              type="text"
              placeholder="🏝️ Destination (e.g., Bali, Indonesia)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              className="form-input"
              type="text"
              placeholder="📍 Specific Location (e.g., Ubud, Canggu)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <input
              className="form-input"
              type="text"
              placeholder="💰 Budget (e.g., $2000, ₹50000)"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label className="rating-label">⭐ How excited are you about this destination?</label>
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
            <span className="rating-text">
              {rating === 0 && "Click to rate"}
              {rating === 1 && "Mildly interested"}
              {rating === 2 && "Somewhat excited"}
              {rating === 3 && "Very excited"}
              {rating === 4 && "Extremely excited"}
              {rating === 5 && "Dream destination!"}
            </span>
          </div>
        </div>
        
        <div className="form-group">
          <textarea
            className="form-textarea"
            placeholder="📝 Describe your dream experience... What makes this destination special? What activities do you want to do?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        
        <button className="btn-primary" type="submit">
          🚀 Add to Bucket List
        </button>
      </form>
    </div>
  );
}

export default AddTrip;
