import { Routes, Route } from 'react-router-dom'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Rooms from './pages/Rooms'
import RoomDetails from './pages/RoomDetails'
import AddRoom from './pages/AddRoom'
import MyListings from './pages/MyListings'
import MyBookings from './pages/MyBookings'
import NotFound from './pages/NotFound'

// Components
import PrivateRoute from './components/shared/PrivateRoute'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/rooms/:id" element={<RoomDetails />} />

      {/* Private Routes */}
      <Route path="/add-room" element={
        <PrivateRoute><AddRoom /></PrivateRoute>
      } />
      <Route path="/my-listings" element={
        <PrivateRoute><MyListings /></PrivateRoute>
      } />
      <Route path="/my-bookings" element={
        <PrivateRoute><MyBookings /></PrivateRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App