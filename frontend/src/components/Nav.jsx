import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Nav = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-[#1B365D] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="../assets/mug2.webp"
                alt="Mugher Cement Logo"
                className="h-12 w-auto"
              />
              <span className="ml-3 text-white text-xl font-bold hidden sm:block">
                Mugher Cement Volleyball
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/players"
              className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Players
            </Link>
            <Link
              to="/fixtures"
              className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Fixtures
            </Link>
            <Link
              to="/fans"
              className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Fans
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <div className="h-8 w-8 rounded-full bg-[#E31837] flex items-center justify-center text-white font-bold mr-2">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="bg-[#E31837] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#C41530] transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#E31837] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#C41530] transition-colors duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-200 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/players"
                className="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Players
              </Link>
              <Link
                to="/fixtures"
                className="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Fixtures
              </Link>
              <Link
                to="/fans"
                className="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Fans
              </Link>
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="h-8 w-8 rounded-full bg-[#E31837] flex items-center justify-center text-white font-bold mr-2">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span>Profile</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav; 