import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Nav from './pages/nav';
import Home from './pages/home';
import Players from './pages/players';
import Fixtures from './pages/fixtures';
import News from './pages/news';
import Store from './pages/store';
import Fans from './pages/fans';
import Login from './pages/login';
import AdminLogin from './pages/admin-login';
import Register from './pages/register';
import RegisterAdmin from './pages/register-admin';
import Admin from './pages/admin';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

// Admin Route component
const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/admin-login', { replace: true });
    } else if (!isAdmin()) {
      navigate('/', { replace: true });
    }
  }, [user, isAdmin, navigate]);
  
  if (!user || !isAdmin()) {
    return null;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Nav />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-admin" element={<RegisterAdmin />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/players"
              element={
                <ProtectedRoute>
                  <Players />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fixtures"
              element={
                <ProtectedRoute>
                  <Fixtures />
                </ProtectedRoute>
              }
            />
            <Route
              path="/news"
              element={
                <ProtectedRoute>
                  <News />
                </ProtectedRoute>
              }
            />
            <Route
              path="/store"
              element={
                <ProtectedRoute>
                  <Store />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fans"
              element={
                <ProtectedRoute>
                  <Fans />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
