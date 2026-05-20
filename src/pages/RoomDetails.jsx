import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Layout from '../components/shared/Layout';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00'
];

const RoomDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingModal, setBookingModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [booking, setBooking] = useState(false);

  const [bookingData, setBookingData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    specialNote: ''
  });

  const [editData, setEditData] = useState({});

  const amenityOptions = [
    'Whiteboard', 'Projector', 'Wi-Fi',
    'Power Outlets', 'Quiet Zone', 'Air Conditioning'
  ];

  useEffect(() => {
    fetchRoom();
  }, [id]);

  useEffect(() => {
    if (room) {
      document.title = `StudyNook – ${room.name}`;
    }
  }, [room]);

  const fetchRoom = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/rooms/${id}`);
      setRoom(res.data);
      setEditData({
        name: res.data.name,
        description: res.data.description,
        image: res.data.image,
        floor: res.data.floor,
        capacity: res.data.capacity,
        hourlyRate: res.data.hourlyRate,
        amenities: res.data.amenities || []
      });
    } catch (error) {
      toast.error('Failed to load room details');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total cost
  const getTotalCost = () => {
    if (!bookingData.startTime || !bookingData.endTime) return 0;
    const start = parseInt(bookingData.startTime.split(':')[0]);
    const end = parseInt(bookingData.endTime.split(':')[0]);
    const hours = end - start;
    return hours > 0 ? hours * room.hourlyRate : 0;
  };

  // Get available end times based on start time
  const getEndTimes = () => {
    if (!bookingData.startTime) return [];
    const startIndex = timeSlots.indexOf(bookingData.startTime);
    return timeSlots.slice(startIndex + 1);
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'startTime' ? { endTime: '' } : {})
    }));
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (getTotalCost() <= 0) {
      toast.error('Please select valid start and end times');
      return;
    }
    setBooking(true);
    try {
      await axios.post(
        `${API_URL}/api/bookings`,
        {
          roomId: id,
          date: bookingData.date,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
          totalCost: getTotalCost(),
          specialNote: bookingData.specialNote
        },
        { withCredentials: true }
      );
      toast.success('Room booked successfully!');
      setBookingModal(false);
      setBookingData({ date: '', startTime: '', endTime: '', specialNote: '' });
      fetchRoom();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/rooms/${id}`, {
        withCredentials: true
      });
      toast.success('Room deleted successfully!');
      navigate('/my-listings');
    } catch (error) {
      toast.error('Failed to delete room');
    }
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleAmenityChange = (amenity) => {
    setEditData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${API_URL}/api/rooms/${id}`,
        {
          ...editData,
          capacity: Number(editData.capacity),
          hourlyRate: Number(editData.hourlyRate)
        },
        { withCredentials: true }
      );
      toast.success('Room updated successfully!');
      setRoom(res.data.room);
      setEditModal(false);
    } catch (error) {
      toast.error('Failed to update room');
    }
  };

  const isOwner = user && room && room.owner._id === user.id;

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (!room) {
    return (
      <Layout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-700">Room not found</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Room Image */}
          <div className="w-full h-72 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-md">
            <img
              src={room.image}
              alt={room.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left: Room Info */}
            <div className="lg:col-span-2 space-y-6">

              {/* Title & Booking Count */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                      {room.name}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-500 text-sm">
                      <span>🏢 {room.floor}</span>
                      <span>👥 {room.capacity} people</span>
                      <span>📅 {room.bookingCount} bookings</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600">
                      ${room.hourlyRate}
                    </p>
                    <p className="text-gray-400 text-sm">per hour</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  About This Room
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {room.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Amenities
                </h2>
                <div className="flex flex-wrap gap-3">
                  {room.amenities?.map((amenity, i) => (
                    <span
                      key={i}
                      className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      ✓ {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Owner Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  Listed By
                </h2>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {room.owner?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{room.owner?.name}</p>
                    <p className="text-gray-500 text-sm">{room.owner?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-20">
                <p className="text-2xl font-bold text-blue-600 mb-1">
                  ${room.hourlyRate}
                  <span className="text-gray-400 text-base font-normal">/hr</span>
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  📅 {room.bookingCount} total bookings
                </p>

                {/* Book Now Button */}
                {user ? (
                  <button
                    onClick={() => setBookingModal(true)}
                    className="w-full bg-gradient-to-br from-gray-900 to-blue-600 text-white py-3 rounded-lg font-semibold hover:to-blue-800 transition"
                  >
                    Book Now
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-gradient-to-br from-gray-900 to-blue-600 text-white py-3 rounded-lg font-semibold hover:to-blue-800 transition"
                  >
                    Login to Book
                  </button>
                )}

                {/* Owner Controls */}
                {isOwner && (
                  <div className="mt-4 pt-4 border-t space-y-2">
                    <p className="text-xs text-gray-400 text-center mb-2">
                      You own this room
                    </p>
                    <button
                      onClick={() => setEditModal(true)}
                      className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition font-medium"
                    >
                      Edit Room
                    </button>
                    <button
                      onClick={() => setDeleteModal(true)}
                      className="w-full bg-red-50 text-red-500 py-2 rounded-lg hover:bg-red-100 transition font-medium"
                    >
                      Delete Room
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Book This Room</h3>
              <button
                onClick={() => setBookingModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={bookingData.date}
                  onChange={handleBookingChange}
                  min={getTodayDate()}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time *
                </label>
                <select
                  name="startTime"
                  value={bookingData.startTime}
                  onChange={handleBookingChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select start time</option>
                  {timeSlots.slice(0, -1).map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time *
                </label>
                <select
                  name="endTime"
                  value={bookingData.endTime}
                  onChange={handleBookingChange}
                  required
                  disabled={!bookingData.startTime}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <option value="">Select end time</option>
                  {getEndTimes().map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              {/* Total Cost */}
              {getTotalCost() > 0 && (
                <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Total Cost</span>
                  <span className="text-blue-600 font-bold text-lg">
                    ${getTotalCost()}
                  </span>
                </div>
              )}

              {/* Special Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Note (optional)
                </label>
                <textarea
                  name="specialNote"
                  value={bookingData.specialNote}
                  onChange={handleBookingChange}
                  rows={2}
                  placeholder="Any special requests..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setBookingModal(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={booking}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {booking ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Room</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this room? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(false)}
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Edit Room</h3>
              <button
                onClick={() => setEditModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={editData.description}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={editData.image}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                  <input
                    type="text"
                    name="floor"
                    value={editData.floor}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={editData.capacity}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                <input
                  type="number"
                  name="hourlyRate"
                  value={editData.hourlyRate}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="grid grid-cols-2 gap-2">
                  {amenityOptions.map(amenity => (
                    <label
                      key={amenity}
                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm transition ${
                        editData.amenities.includes(amenity)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={editData.amenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                        className="w-4 h-4"
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Update Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default RoomDetails;