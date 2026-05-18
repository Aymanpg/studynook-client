import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-1 mb-3">
            <span className="text-2xl font-bold text-blue-400">Study</span>
            <span className="text-2xl font-bold text-white">Nook</span>
          </Link>
          <p className="text-sm text-gray-400">
            Browse and book quiet, private study rooms in your library. List your own room and earn.
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-3">Useful Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-blue-400 transition">Home</Link></li>
            <li><Link to="/rooms" className="hover:text-blue-400 transition">Rooms</Link></li>
            <li><Link to="/about" className="hover:text-blue-400 transition">About</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-3">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li>📧 support@studynook.com</li>
            <li>📞 +1 (555) 123-4567</li>
          </ul>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4">
            {/* Facebook */}
            <a href="#" className="hover:text-blue-400 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
            </a>
            {/* X (Twitter) */}
            <a href="#" className="hover:text-blue-400 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="hover:text-blue-400 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="#" className="hover:text-blue-400 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} StudyNook. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;