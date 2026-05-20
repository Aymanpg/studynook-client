import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Layout from '../components/shared/Layout';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    document.title = 'StudyNook - My Bookings';
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/bookings/my-bookings`, {
        withCredentials: true
      });
      setBookings(res.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    setCancelling(true);
    try {
      await axios.patch(
        `${API_URL}/api/bookings/${bookingId}/cancel`,
        {},
        { withCredentials: true }
      );
      toast.success('Booking cancelled successfully!');
      setBookings(bookings.map(b =>
        b._id === bookingId ? { ...b, status: 'cancelled' } : b
      ));
      setCancelModal(null);
    } catch (error) {
      toast.error('Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const isFutureBooking = (date) => {
    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate >= today;
  };

  const getStatusBadge = (status) => {
    if (status === 'confirmed') {
      return (
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
          Confirmed
        </span>
      );
    }
    return (
      <span className="bg-red-100 text-red-500 px-3 py-1 rounded-full text-xs font-semibold">
        Cancelled
      </span>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-600 py-10 px-4">
        <div className="max-w-5xl mx-auto">

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">My Bookings</h1>
            <p className="text-blue-200 mt-1">Manage all your room bookings</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">
                No Bookings Yet
              </h3>
              <p className="text-gray-500 mb-6">
                You have no bookings yet. Browse rooms and book one!
              </p>
              <Link
                to="/rooms"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition inline-block"
              >
                Browse Rooms
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(booking => (
                <div
                  key={booking._id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">

                    <div className="md:w-48 h-40 md:h-auto flex-shrink-0">
                      <img
                        src={booking.room?.image}
                        alt={booking.room?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-grow p-5">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800 mb-1">
                            {booking.room?.name}
                          </h3>
                          <p className="text-gray-500 text-sm mb-3">
                            {booking.room?.floor}
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div className="bg-gray-50 rounded-lg p-2 text-center">
                              <p className="text-gray-400 text-xs">Date</p>
                              <p className="font-semibold text-gray-700">
                                {new Date(booking.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2 text-center">
                              <p className="text-gray-400 text-xs">Start</p>
                              <p className="font-semibold text-gray-700">
                                {booking.startTime}
                              </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2 text-center">
                              <p className="text-gray-400 text-xs">End</p>
                              <p className="font-semibold text-gray-700">
                                {booking.endTime}
                              </p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-2 text-center">
                              <p className="text-gray-400 text-xs">Total</p>
                              <p className="font-semibold text-blue-600">
                                ${booking.totalCost}
                              </p>
                            </div>
                          </div>

                          {booking.specialNote && (
                            <p className="text-gray-500 text-sm mt-3 italic">
                              Note: {booking.specialNote}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          {getStatusBadge(booking.status)}
                          {booking.status === 'confirmed' && isFutureBooking(booking.date) && (
                            <button
                              onClick={() => setCancelModal(booking._id)}
                              className="text-sm text-red-500 border border-red-200 px-3 py-1 rounded-lg hover:bg-red-50 transition"
                            >
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {cancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Cancel Booking
            </h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setCancelModal(null)}
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Keep Booking
              </button>
              <button
                onClick={() => handleCancel(cancelModal)}
                disabled={cancelling}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MyBookings;