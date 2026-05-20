import { Link } from 'react-router-dom';

const RoomCard = ({ room }) => {
  const maxAmenities = 3;
  const visibleAmenities = room.amenities?.slice(0, maxAmenities);
  const extraCount = room.amenities?.length - maxAmenities;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="h-48 overflow-hidden">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover hover:scale-105 transition duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{room.name}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {room.description?.substring(0, 100)}...
        </p>

        {/* Details */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span>🏢 {room.floor}</span>
          <span>👥 {room.capacity} people</span>
          <span className="font-semibold text-blue-600">${room.hourlyRate}/hr</span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {visibleAmenities?.map((amenity, i) => (
            <span
              key={i}
              className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full"
            >
              {amenity}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">
              +{extraCount} more
            </span>
          )}
        </div>

        {/* Button */}
        <div className="mt-auto">
          <Link
            to={`/rooms/${room._id}`}
            className="block text-center bg-gradient-to-br from-gray-900 to-blue-600 text-white py-2 px-4 rounded-lg  hover:to-blue-800 transition font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;