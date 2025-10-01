import { formatPrice } from "../../utils/formatPrice";

interface TripCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  duration: string;
  pickup: boolean;
  chauffeur: string;
  tag?: {
    text: string;
    color: "orange" | "red" | "green" | "blue";
  };
}

const TripCard = ({
  // id,
  title,
  description,
  imageUrl,
  price,
  duration,
  pickup,
  tag,
}: TripCardProps) => {
  const tagColors = {
    orange: "bg-orange-500 text-white",
    red: "bg-red-500 text-white",
    green: "bg-green-500 text-white",
    blue: "bg-blue-500 text-white",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        {tag && (
          <div
            className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium z-10 ${
              tagColors[tag.color]
            }`}
          >
            {tag.text}
          </div>
        )}
        <img
          src={imageUrl}
          alt=""
          className="w-full h-full object-cover object-center"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4 overflow-hidden">
        <h3 className="font-semibold text-gray-900 text-base mb-2 leading-tight">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* Trip Details */}
        <div className="flex items-center gap-4  flex-wrap text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <i className="ri-car-line w-4 h-4 flex items-center justify-center" />
            <span>Private Car</span>
          </div>
          {pickup && (
            <div className="flex items-center gap-1">
              <i className="ri-map-pin-line w-4 h-4 flex items-center justify-center" />
              <span>Pickup & Drop</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <i className="ri-time-line w-4 h-4 flex items-center justify-center" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
              <i className="ri-temp-cold-line w-4 h-4 flex items-center justify-center" />
              <span>Air-Conditioned</span>
            </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">Starts at </span>
            <span className="font-semibold text-gray-900">
              {formatPrice(price)}
            </span>
          </div>
          <div className="bg-gray-800 text-white px-4 py-2 rounded-xl text-sm font-medium">
            View Details
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
