import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import mug2Logo from '../assets/mug2.webp'

const Nav = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src={mug2Logo} 
                alt="Mugher Logo" 
                className="h-12 w-auto"
              />
              <span className="text-xl font-bold text-gray-900 hidden sm:block">Mugher City FC</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/store" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200">Store</Link>
            <Link to="/fans" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200">Fans</Link>
            <Link to="/fixtures" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200">Fixtures</Link>
            <Link to="/news" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200">News</Link>
            <Link to="/players" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200">Players</Link>
            
            {user ? (
              <div className="flex items-center space-x-4 ml-4">
                <span className="text-sm font-medium text-gray-700">
                  Welcome, {user.name}
                </span>
                {user.role === 'admin' && (
                  <Link to="/admin" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-md text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors duration-200"
                >
                  Sign in
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <Link to="/store" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">Store</Link>
            <Link to="/fans" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">Fans</Link>
            <Link to="/fixtures" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">Fixtures</Link>
            <Link to="/news" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">News</Link>
            <Link to="/players" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">Players</Link>
            
            {user ? (
              <>
                <div className="border-t border-gray-200 pt-4 pb-3">
                  <div className="px-4">
                    <p className="text-base font-medium text-gray-800">Welcome, {user.name}</p>
                  </div>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                  Sign in
                </Link>
                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;