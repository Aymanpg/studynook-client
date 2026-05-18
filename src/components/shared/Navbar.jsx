import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully!');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-blue-600">Study</span>
          <span className="text-2xl font-bold text-gray-800">Nook</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition">Home</Link>
          <Link to="/rooms" className="text-gray-600 hover:text-blue-600 font-medium transition">Rooms</Link>

          {user && (
            <>
              <Link to="/add-room" className="text-gray-600 hover:text-blue-600 font-medium transition">Add Room</Link>
              <Link to="/my-listings" className="text-gray-600 hover:text-blue-600 font-medium transition">My Listings</Link>
              <Link to="/my-bookings" className="text-gray-600 hover:text-blue-600 font-medium transition">My Bookings</Link>
            </>
          )}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition font-medium">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                Register
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <img
                  src={user.photoURL || 'https://i.ibb.co/4pDNDk1/avatar.png'}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-blue-600"
                />
                <span className="text-gray-700 font-medium">{user.name}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/my-listings"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    My Listings
                  </Link>
                  <Link
                    to="/my-bookings"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    My Bookings
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 flex flex-col gap-3 border-t">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600 py-2">Home</Link>
          <Link to="/rooms" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600 py-2">Rooms</Link>

          {user && (
            <>
              <Link to="/add-room" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600 py-2">Add Room</Link>
              <Link to="/my-listings" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600 py-2">My Listings</Link>
              <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-blue-600 py-2">My Bookings</Link>
            </>
          )}

          {!user ? (
            <div className="flex flex-col gap-2 mt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="px-4 py-2 text-center text-blue-600 border border-blue-600 rounded-lg">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="px-4 py-2 text-center bg-blue-600 text-white rounded-lg">Register</Link>
            </div>
          ) : (
            <button onClick={handleLogout} className="text-left text-red-500 py-2">Logout</button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;