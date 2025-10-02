import React, { useState } from "react";

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/login" : "/signup";
      const response = await fetch(`http://localhost:5038${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data and token in localStorage
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        onLogin({ ...data.user, token: data.token });
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Auth error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({ username: "", email: "", password: "" });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">
          {isLogin ? "🌍 Welcome Back, Traveler!" : "🎒 Start Your Journey"}
        </h2>
        <p className="auth-subtitle">
          {isLogin 
            ? "Sign in to access your personal bucket list" 
            : "Create an account to save your dream destinations"
          }
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <input
                className="form-input"
                type="text"
                name="username"
                placeholder="👤 Username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="📧 Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="🔒 Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength="6"
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "⏳ Processing..." : (isLogin ? "🚀 Sign In" : "✨ Create Account")}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? "New to our platform? " : "Already have an account? "}
            <button 
              type="button" 
              className="switch-btn"
              onClick={toggleMode}
            >
              {isLogin ? "Create Account" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;