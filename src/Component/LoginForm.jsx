import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./Toast";
import { ButtonLoading } from "./Loading";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useActivity } from "../context/ActivityContext";
import { ActivityTypes } from "../utils/activityLogger";

const LoginForm = ({ onLogin }) => {
  const navigate = useNavigate();
  const { logActivity } = useActivity();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { showSuccess, showError, showInfo, ToastContainer } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!email || !password) {
      showError("Please fill in both email and password");
      return;
    }

    setLoading(true);
    console.log("Login attempt with:", { email, password: "***" });
    showInfo("Logging in...");

    try {
      const response = await fetch("https://stechno.up.railway.app/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Response status:", response.status);

      let data;
      try {
        data = await response.json();
        console.log("Response data:", data);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        showError("Invalid response from server");
        return;
      }

      if (!response.ok) {
        const errorMessage = data.message || data.error || `Login failed: ${response.status} ${response.statusText}`;
        showError(errorMessage);
        console.error("Login failed:", data);
      } else {
        // ✅ Login successful
        console.log("Login successful, response data:", data);

        // Check for token in various possible locations
        const token = data.token || data.access_token || data.accessToken;
        const user = data.user || data.data || data;

        if (token) {
          localStorage.setItem("token", token);
          console.log("Token saved to localStorage:", token);
        } else {
          console.warn("No token found in response:", data);
        }

        const username = user.username || user.name || user.email || 'User';
        showSuccess(`Welcome, ${username}!`);

        // Log login activity
        logActivity(ActivityTypes.USER_LOGIN, {
          username: username,
          email: user.email || email,
          loginTime: new Date().toISOString()
        }, user.id);

        // Call onLogin callback with the data
        onLogin(data);

        // Redirect to dashboard after successful login
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000); // Wait 1 second to show success message
      }
    } catch (error) {
      console.error("Network/Fetch error:", error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        showError("Cannot connect to server. Please check your internet connection.");
      } else {
        showError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 px-4">
      <ToastContainer />
      {/* Welcome Section */}
      <div className="mb-8 text-center">
        <div className="mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="text-white font-bold text-2xl">ST</span>
          </div>
        </div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
          Welcome to sTechno
        </h1>
        <p className="text-blue-700 text-lg max-w-md mx-auto">
          Manage your inventory with ease and efficiency. Keep your stock monitored for smooth business operations.
        </p>
      </div>

      {/* Login Form */}
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-blue-200">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-8">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-blue-700 mb-2 text-sm font-medium">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80"
              placeholder="admin@mail.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-blue-700 mb-2 text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/80"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 transition-colors duration-200"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <ButtonLoading
            type="submit"
            loading={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            Sign In
          </ButtonLoading>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-blue-600">
            Demo credentials: admin@mail.com / admin123
          </p>
          <button
            type="button"
            onClick={() => {
              setEmail("admin@mail.com");
              setPassword("admin123");
            }}
            className="mt-2 text-xs text-blue-500 hover:text-blue-700 underline"
          >
            Fill demo credentials
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
