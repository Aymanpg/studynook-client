import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/shared/Layout';

const NotFound = () => {
  useEffect(() => {
    document.title = 'StudyNook – Page Not Found';
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-lg mx-auto">

          {/* 404 Number */}
          <div className="relative mb-8">
            <h1 className="text-9xl font-black text-blue-100 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl">😕</span>
            </div>
          </div>

          {/* Message */}
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            Oops! The page you are looking for does not exist.
            It might have been moved or deleted.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="bg-gradient-to-br from-gray-900 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:to-blue-800 transition"
            >
              Back to Home
            </Link>
            <Link
              to="/rooms"
              className="bg-gradient-to-br from-gray-900 to-blue-600 text-white  px-8 py-3 rounded-full font-semibold hover:to-blue-800 transition"
            >
              Browse Rooms
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;