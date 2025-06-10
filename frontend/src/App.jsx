import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Nav from './components/Nav';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import AdminLogin from './pages/admin-login';
import RegisterAdmin from './pages/register-admin';
import Admin from './pages/admin';
import Profile from './pages/profile';
import Players from './pages/players';
import Fixtures from './pages/fixtures';
import News from './pages/news';
import Fans from './pages/fans';
import { useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  console.log('AdminRoute - Current user:', user); // Debug log
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (user.role !== 'admin') {
    return <Navigate to="/login" />;
  }
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Nav />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/register-admin" element={<RegisterAdmin />} />
              <Route path="/fixtures" element={<Fixtures />} />
              <Route path="/news" element={<News />} />

              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
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
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
