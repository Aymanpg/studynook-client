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
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-1">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-gray-900 bg-clip-text text-transparent">Study</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-gray-900 bg-clip-text text-transparent">Nook</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition">
            Home
          </Link>
          <Link to="/rooms" className="text-gray-600 hover:text-blue-600 font-medium transition">
            Rooms
          </Link>
          {user && (
            <>
              <Link to="/add-room" className="text-gray-600 hover:text-blue-600 font-medium transition">
                Add Room
              </Link>
              <Link to="/my-listings" className="text-gray-600 hover:text-blue-600 font-medium transition">
                My Listings
              </Link>
              <Link to="/my-bookings" className="text-gray-600 hover:text-blue-600 font-medium transition">
                My Bookings
              </Link>
            </>
          )}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-blue-600"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm border-2 border-blue-600"
                  style={{ display: user.photoURL ? 'none' : 'flex' }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-700 font-medium">{user.name}</span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                    <p className="text-gray-400 text-xs truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/my-listings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-sm"
                  >
                    🏠 My Listings
                  </Link>
                  <Link
                    to="/my-bookings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-sm"
                  >
                    📅 My Bookings
                  </Link>
                  <Link
                    to="/add-room"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-sm"
                  >
                    ➕ Add Room
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 text-sm"
          >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
               </button>
             </div>
          )}
         </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
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
        <div className="md:hidden bg-white px-4 pb-4 flex flex-col gap-2 border-t">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-gray-700 hover:text-blue-600 py-2 border-b border-gray-100"
          >
            Home
          </Link>
          <Link
            to="/rooms"
            onClick={() => setMenuOpen(false)}
            className="text-gray-700 hover:text-blue-600 py-2 border-b border-gray-100"
          >
            Rooms
          </Link>
          {user && (
            <>
              <Link
                to="/add-room"
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 py-2 border-b border-gray-100"
              >
                Add Room
              </Link>
              <Link
                to="/my-listings"
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 py-2 border-b border-gray-100"
              >
                My Listings
              </Link>
              <Link
                to="/my-bookings"
                onClick={() => setMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 py-2 border-b border-gray-100"
              >
                My Bookings
              </Link>
            </>
          )}
          {!user ? (
            <div className="flex flex-col gap-2 mt-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 text-center text-blue-600 border border-blue-600 rounded-lg"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 text-center bg-blue-600 text-white rounded-lg"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="mt-2">
              <div className="flex items-center gap-2 py-2 border-b border-gray-100">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                  <p className="text-gray-400 text-xs">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => { handleLogout(); setMenuOpen(false); }}
                className="w-full text-left text-red-500 py-2 mt-2"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;