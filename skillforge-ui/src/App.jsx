// src/App.jsx
import React from 'react';
import SkillForge from './Pages/skillForge';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import LoginPage from './components/Auth/LoginPage';
import SignUpPage from './components/Auth/SignUpPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

function AppRoutes() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        <p className="ml-3">Loading authentication...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes - only accessible when NOT logged in */}
      <Route 
        path="/login" 
        element={currentUser ? <Navigate to="/app" replace /> : <LoginPage />} 
      />
      <Route 
        path="/signup" 
        element={currentUser ? <Navigate to="/app" replace /> : <SignUpPage />} 
      />
      
      {/* Protected routes - only accessible when logged in */}
      <Route 
        path="/app/*" 
        element={currentUser ? <SkillForge /> : <Navigate to="/login" replace />} 
      />
      
      {/* Root redirect */}
      <Route 
        path="/" 
        element={<Navigate to={currentUser ? "/app" : "/login"} replace />} 
      />
      
      {/* Catch all - redirect to appropriate page */}
      <Route 
        path="*" 
        element={<Navigate to={currentUser ? "/app" : "/login"} replace />} 
      />
    </Routes>
  );
}

export default App;
