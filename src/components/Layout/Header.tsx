import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import Button from '../UI/Button';
import { useState } from 'react';

const Header = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isDev = import.meta.env.MODE === 'development';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and app name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-2 text-xl font-semibold">Taskflow</span>
            </Link>
            
            {/* Environment indicator */}
            {isDev && (
              <span className="ml-4 px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-md">
                Development
              </span>
            )}
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {authState.isAuthenticated ? (
              <>
                <div className="ml-2 text-sm text-gray-600">
                  {authState.user?.first_name} {authState.user?.last_name}
                </div>
                <Link
                  to="/"
                  className="px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  Home
                </Link>
                <Link
                  to="/schedule"
                  className="px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  Schedule
                </Link>
                <Button variant="secondary" onClick={handleLogout}>
                  Logout
                </Button>
              </>
             ) : ( 
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </>
           )} 
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-600 rounded-md hover:bg-gray-100 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
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

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            {authState.isAuthenticated ? (
              <>
                <div className="mt-2 px-3 py-2 text-sm text-gray-600">
                  {authState.user?.first_name} {authState.user?.last_name}
                </div>
                <Link
                  to="/"
                  className="block px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/schedule"
                  className="block px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Schedule
                </Link>
                <div className="mt-2">
                  <Button variant="secondary" onClick={handleLogout} fullWidth>
                    Logout
                  </Button>
                </div>
              </>
           ) : ( 
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <div className="mt-2">
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button fullWidth>Register</Button>
                  </Link>
                </div>
              </>
          )} 
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;