import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  FaHome, FaInfoCircle, FaFileAlt, FaStethoscope,
  FaEnvelope, FaSignInAlt, FaUser, FaComments,
  FaSignOutAlt, FaUserShield, FaBars, FaTimes, FaHeart, FaNewspaper, FaUserCircle
} from 'react-icons/fa';
// import logo from '../assets/cafye-logo.png';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    setIsLoggedIn(!!token);
    setUserRole(role || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserRole('');
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 shadow-xl border-b border-white border-opacity-20 py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center border-2 border-white border-opacity-30">
            <FaHeart className="text-white text-lg" />
          </div>
          <span className="text-2xl font-bold text-white">CAAFIYE</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="flex items-center gap-1 text-white hover:text-yellow-200 transition duration-200">
            <FaHome /> Home
          </Link>
          <Link to="/about" className="flex items-center gap-1 text-white hover:text-yellow-200 transition duration-200">
            <FaInfoCircle /> About
          </Link>
          <Link to="/articles" className="flex items-center gap-1 text-white hover:text-yellow-200 transition duration-200">
            <FaNewspaper /> Articles
          </Link>
          <Link to="/doctors" className="flex items-center gap-1 text-white hover:text-yellow-200 transition duration-200">
            <FaStethoscope /> Doctors
          </Link>
          <Link to="/ask-doctor" className="flex items-center gap-1 text-white hover:text-yellow-200 transition duration-200">
            <FaComments /> AI Chat
          </Link>
          <Link to="/contact" className="flex items-center gap-1 text-white hover:text-yellow-200 transition duration-200">
            <FaEnvelope /> Contact
          </Link>
          
          {/* Conditional rendering based on login status */}
          {isLoggedIn ? (
            <>
              {userRole === 'admin' && (
                <Link to="/admindashboard" className="flex items-center gap-1 text-white hover:text-yellow-200 transition duration-200">
                  <FaUserShield /> Admin
                </Link>
              )}
              {userRole === 'user' && (
                <Link to="/userdashboard" className="flex items-center gap-1 text-white hover:text-yellow-200 transition duration-200">
                  <FaUserCircle /> Dashboard
                </Link>
              )}
              <Link to="/profile" className="flex items-center gap-1 text-white hover:text-yellow-200 transition duration-200">
                <FaUser /> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-white hover:text-red-200 transition duration-200"
              >
                <FaSignOutAlt /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="flex items-center gap-1 text-white hover:text-yellow-200 transition duration-200">
              <FaSignInAlt /> Login
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-white text-2xl"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4">
          <div className="flex flex-col gap-4 text-white">
            <Link 
              to="/" 
              className="flex items-center gap-2 hover:text-yellow-200 transition duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaHome /> Home
            </Link>
            <Link 
              to="/about" 
              className="flex items-center gap-2 hover:text-yellow-200 transition duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaInfoCircle /> About
            </Link>
            <Link 
              to="/articles" 
              className="flex items-center gap-2 hover:text-yellow-200 transition duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaNewspaper /> Articles
            </Link>
            <Link 
              to="/doctors" 
              className="flex items-center gap-2 hover:text-yellow-200 transition duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaStethoscope /> Doctors
            </Link>
            <Link 
              to="/ask-doctor" 
              className="flex items-center gap-2 hover:text-yellow-200 transition duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaComments /> AI Chat
            </Link>
            <Link 
              to="/contact" 
              className="flex items-center gap-2 hover:text-yellow-200 transition duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FaEnvelope /> Contact
            </Link>
            
            {isLoggedIn ? (
              <>
                {userRole === 'admin' && (
                  <Link 
                    to="/admindashboard" 
                    className="flex items-center gap-2 hover:text-yellow-200 transition duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaUserShield /> Admin Dashboard
                  </Link>
                )}
                {userRole === 'user' && (
                  <Link 
                    to="/userdashboard" 
                    className="flex items-center gap-2 hover:text-yellow-200 transition duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaUserCircle /> Dashboard
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 hover:text-yellow-200 transition duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUser /> Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 hover:text-red-200 transition duration-200 text-left"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-2 hover:text-yellow-200 transition duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FaSignInAlt /> Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
