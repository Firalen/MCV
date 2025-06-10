import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Nav from './components/Nav';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Profile from './pages/profile';
import Admin from './pages/admin';
import Players from './pages/players';
import Fixtures from './pages/fixtures';
import News from './pages/news';
import Fans from './pages/fans';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/players" element={<Players />} />
            <Route path="/fixtures" element={<Fixtures />} />
            <Route path="/news" element={<News />} />
            <Route path="/fans" element={<Fans />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
