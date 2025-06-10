// src/App.jsx
import React from 'react';
import SkillForge from './Pages/skillForge';
import { AuthProvider, useAuth } from './context/AuthContext.jsx'; // <--- ADDED useAuth import here
import LoginPage from './components/Auth/LoginPage';
import SignUpPage from "./components/Auth/SignUpPage";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<AuthenticatedApp />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

function AuthenticatedApp() {
  const { currentUser, loading } = useAuth(); // Now useAuth is defined

  if (loading) {
    // A simple loading spinner or message for when Firebase auth state is being determined
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        <p className="ml-3">Loading authentication...</p>
      </div>
    );
  }

  if (!currentUser) {
    // If not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the main SkillForge application
  return <SkillForge />;
}

export default App;
