import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/shared/Layout';
import RoomCard from '../components/rooms/RoomCard';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'StudyNook – Home';
    fetchLatestRooms();
  }, []);

  const fetchLatestRooms = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/rooms/latest`);
      setRooms(res.data);
    } catch (error) {
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-blue-600 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your Perfect <span className="text-gray-900">Study Room</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Browse and book quiet, private study rooms in your library. List your own room and earn.
          </p>
          <Link
            to="/rooms"
            className="inline-block bg-white text-gray-900 font-bold px-8 py-4 rounded-full hover:bg-gray-900 hover:text-white transition text-lg shadow-lg"
          >
            Explore Rooms →
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 px-4 border-b">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { number: '500+', label: 'Study Rooms' },
            { number: '2000+', label: 'Happy Students' },
            { number: '50+', label: 'Libraries' },
            { number: '98%', label: 'Satisfaction Rate' },
          ].map((stat, i) => (
            <div key={i} className="p-4">
              <p className="text-3xl font-bold text-blue-600">{stat.number}</p>
              <p className="text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Rooms Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-900 to-blue-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Available Study Rooms
            </h2>
            <p className="text-gray-300 mt-3 text-lg">
              Browse our latest study rooms and book instantly
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl">No rooms available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map(room => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/rooms"
              className="inline-block bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-blue-800 hover:text-white transition"
            >
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              How It Works
            </h2>
            <p className="text-gray-500 mt-3 text-lg">
              Book your study room in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Browse Rooms',
                description: 'Search and filter study rooms based on your needs, location, and budget.',
                icon: '🔍'
              },
              {
                step: '02',
                title: 'Book Instantly',
                description: 'Select your date and time slot, confirm your booking in seconds.',
                icon: '📅'
              },
              {
                step: '03',
                title: 'Start Studying',
                description: 'Show up at your booked room and enjoy a productive study session.',
                icon: '📚'
              }
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-900 to-blue-600 text-center p-8 rounded-2xl border border-gray-100 hover:to-blue-800 transition">
                <div className="text-5xl mb-4">{item.icon}</div>
                <div className="text-blue-200 font-bold text-sm mb-2">STEP {item.step}</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-100">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-900 to-blue-600 text-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl text-white md:text-4xl font-bold">
              Why Choose StudyNook?
            </h2>
            <p className="text-white mt-3 text-lg">
              Everything you need for a perfect study session
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🔒', title: 'Secure Booking', desc: 'Your bookings are protected with JWT authentication' },
              { icon: '⚡', title: 'Instant Confirmation', desc: 'Get instant booking confirmation with no waiting' },
              { icon: '💰', title: 'Best Rates', desc: 'Find affordable study rooms that fit your budget' },
              { icon: '🌟', title: 'Top Rated Rooms', desc: 'All rooms are verified and highly rated by students' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center hover:bg-gradient-to-br from-gray-900 to-blue-600 hover:text-white transition">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-black text-sm hover:text-white">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Home;