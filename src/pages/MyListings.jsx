import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Layout from '../components/shared/Layout';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const amenityOptions = [
  'Whiteboard',
  'Projector',
  'Wi-Fi',
  'Power Outlets',
  'Quiet Zone',
  'Air Conditioning'
];

const MyListings = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [editData, setEditData] = useState({});
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    document.title = 'StudyNook – My Listings';
    fetchMyRooms();
  }, []);

  const fetchMyRooms = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/rooms/my-rooms`, {
        withCredentials: true
      });
      setRooms(res.data);
    } catch (error) {
      toast.error('Failed to load your rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (roomId) => {
    try {
      await axios.delete(`${API_URL}/api/rooms/${roomId}`, {
        withCredentials: true
      });
      toast.success('Room deleted successfully!');
      setRooms(rooms.filter(r => r._id !== roomId));
      setDeleteModal(null);
    } catch (error) {
      toast.error('Failed to delete room');
    }
  };

  const openEditModal = (room) => {
    setEditData({
      name: room.name,
      description: room.description,
      image: room.image,
      floor: room.floor,
      capacity: room.capacity,
      hourlyRate: room.hourlyRate,
      amenities: room.amenities || []
    });
    setEditModal(room._id);
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

  const handleUpdate = async (roomId) => {
    setUpdating(true);
    try {
      const res = await axios.put(
        `${API_URL}/api/rooms/${roomId}`,
        {
          ...editData,
          capacity: Number(editData.capacity),
          hourlyRate: Number(editData.hourlyRate)
        },
        { withCredentials: true }
      );
      toast.success('Room updated successfully!');
      setRooms(rooms.map(r => r._id === roomId ? res.data.room : r));
      setEditModal(null);
    } catch (error) {
      toast.error('Failed to update room');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-600 py-10 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">My Listings</h1>
              <p className="text-blue-200 mt-1">Manage your study rooms</p>
            </div>
            <Link
              to="/add-room"
              className="bg-white text-blue-800 px-5 py-2 rounded-lg hover:bg-black hover:text-white transition font-medium"
            >
              + Add New Room
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Rooms Listed Yet</h3>
              <p className="text-gray-500 mb-6">Start earning by listing your first study room</p>
              <Link
                to="/add-room"
                className="bg-gradient-to-br from-gray-900 to-blue-600 text-white px-6 py-3 rounded-lg hover:to-blue-800 transition"
              >
                Add Your First Room
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map(room => (
                <div key={room._id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="h-44 overflow-hidden">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-800 text-lg mb-1">{room.name}</h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{room.description}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                      <span>🏢 {room.floor}</span>
                      <span>👥 {room.capacity}</span>
                      <span className="text-blue-600 font-semibold">${room.hourlyRate}/hr</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <span>📅 {room.bookingCount || 0} bookings</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(room)}
                        className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition font-medium text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteModal(room._id)}
                        className="flex-1 bg-red-50 text-red-500 py-2 rounded-lg hover:bg-red-100 transition font-medium text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Room</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this room? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal)}
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
            <h3 className="text-xl font-bold text-gray-800 mb-4">Edit Room</h3>

            <div className="space-y-4">
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
                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition text-sm ${
                        editData.amenities.includes(amenity)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={editData.amenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                        className="w-4 h-4 text-blue-600"
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditModal(null)}
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdate(editModal)}
                disabled={updating}
                className="flex-1 bg-gradient-to-br from-gray-900 to-blue-600 text-white py-2 rounded-lg hover:to-blue-800 transition disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Update Room'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MyListings;