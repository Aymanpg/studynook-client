import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Layout from '../components/shared/Layout';
import RoomCard from '../components/rooms/RoomCard';

const API_URL = import.meta.env.VITE_API_URL;

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const amenityOptions = [
    'Whiteboard',
    'Projector',
    'Wi-Fi',
    'Power Outlets',
    'Quiet Zone',
    'Air Conditioning'
  ];

  useEffect(() => {
    document.title = 'StudyNook – Available Rooms';
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [search, selectedAmenities]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedAmenities.length > 0) {
        params.amenities = selectedAmenities.join(',');
      }

      const res = await axios.get(`${API_URL}/api/rooms`, { params });
      setRooms(res.data);
    } catch (error) {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedAmenities([]);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-600">

        {/* Page Header */}
        <div className="bg-white text-blue-900 py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Available Study Rooms
            </h1>
            <p className="text-blue-700 text-lg">
              Find and book the perfect study room for your needs
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar Filters */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 text-lg">Filters</h3>
                  {(selectedAmenities.length > 0 || search) && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search by Name
                  </label>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search rooms..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                {/* Amenities Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="space-y-2">
                    {amenityOptions.map(amenity => (
                      <label
                        key={amenity}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity)}
                          onChange={() => handleAmenityChange(amenity)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-600">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Rooms Grid */}
            <div className="flex-grow">

              {/* Results Count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-white text-sm">
                  {loading ? 'Loading...' : `${rooms.length} room${rooms.length !== 1 ? 's' : ''} found`}
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : rooms.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">No Rooms Found</h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search or filters
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {rooms.map(room => (
                    <RoomCard key={room._id} room={room} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Rooms;