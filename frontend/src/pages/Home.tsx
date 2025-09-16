import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import PWAPopup from "../components/PWAPopup";
import QuickAccessCard from "../components/Home/QuickAccessCard";
import TripCard from "../components/Home/TripCard";
import ShareCard from "../components/Home/ShareCard";
import ServiceModal from "../components/Home/ServiceModal";

export default function Home() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"sightseeing" | "daytrips">("sightseeing");

  function getGreeting(): string {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset);
    const hour = istTime.getUTCHours();

    if (hour >= 0 && hour < 12) return "Good Morning!";
    if (hour >= 12 && hour < 16) return "Good Afternoon!";
    return "Good Evening!";
  }

  const handleCitySightseeingClick = () => {
    setModalType("sightseeing");
    setModalOpen(true);
  };

  const handleSameDayTripsClick = () => {
    setModalType("daytrips");
    setModalOpen(true);
  };

  const handleViewAllClick = () => {
    navigate(`/${hotelId}/explore?tab=all`);
  };

  const handleModalContinue = (type: "sightseeing" | "daytrips") => {
    setModalOpen(false);
    if (type === "sightseeing") {
      navigate(`/${hotelId}/explore?tab=tours`);
    }
    else {
      navigate(`/${hotelId}/explore?tab=sameday`);
    }
  };

  const quickAccessItems = [
    {
      title: "City Sightseeing",
      description: "Explore iconic sights, culture, and history",
      imageUrl: "https://readdy.ai/api/search-image?query=icon%2C%20Realistic%20city%20landmarks%2C%20photorealistic%20Bangalore%20cityscape%20with%20historic%20buildings%20and%20modern%20skyscrapers%2C%20high-detail%203D%20rendering%2C%20prominent%20main%20subjects%2C%20clear%20and%20sharp%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting%2C%20subtle%20shadows&width=100&height=100&seq=city1&orientation=squarish",
      onClick: handleCitySightseeingClick,
      available: true
    },
    {
      title: "Same-Day Trips",
      description: "Curated day escapes around Bangalore",
      imageUrl: "https://readdy.ai/api/search-image?query=icon%2C%20Realistic%20mountain%20landscape%2C%20photorealistic%20scenic%20hills%20and%20valleys%20near%20Bangalore%2C%20lush%20green%20nature%2C%20peaceful%20countryside%2C%20high-detail%203D%20rendering%2C%20prominent%20main%20subjects%2C%20clear%20and%20sharp%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting&width=100&height=100&seq=day1&orientation=squarish",
      onClick: handleSameDayTripsClick,
      available: true
    },
    {
      title: "Overnight Trips",
      description: "Weekend getaways & staycations",
      imageUrl: "https://readdy.ai/api/search-image?query=icon%2C%20Realistic%20resort%20building%2C%20photorealistic%20luxury%20resort%20with%20beautiful%20architecture%2C%20vacation%20destination%2C%20peaceful%20retreat%2C%20high-detail%203D%20rendering%2C%20prominent%20main%20subjects%2C%20clear%20and%20sharp%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting&width=100&height=100&seq=overnight1&orientation=squarish",
      href: "overnight-trips",
      available: false
    },
    {
      title: "Local Experiences",
      description: "Short, curated tours and things worth doing",
      imageUrl: "https://readdy.ai/api/search-image?query=icon%2C%20Realistic%20cultural%20activities%2C%20photorealistic%20traditional%20Indian%20cultural%20experience%2C%20local%20crafts%20and%20activities%2C%20authentic%20heritage%2C%20high-detail%203D%20rendering%2C%20prominent%20main%20subjects%2C%20clear%20and%20sharp%2C%20the%20icon%20should%20take%20up%2070%25%20of%20the%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting&width=100&height=100&seq=local1&orientation=squarish",
      href: "local-experiences",
      available: false
    }
  ];

  const allTrips = [
    {
      id: "heritage-tour-8hr",
      title: "Bangalore Heritage City Tour",
      description: "Explore Tipu Sultan Palace, Bangalore Fort & Bull Temple",
      imageUrl: "https://readdy.ai/api/search-image?query=Beautiful%20historic%20Tipu%20Sultan%20Palace%20in%20Bangalore%20with%20Indo-Islamic%20architecture%2C%20ornate%20wooden%20pillars%20and%20arches%2C%20golden%20sunlight%20filtering%20through%2C%20traditional%20Indian%20heritage%20building%2C%20detailed%20craftsmanship%2C%20warm%20ambient%20lighting%2C%20tourism%20photography%20style%2C%20clear%20blue%20sky%2C%20lush%20gardens&width=400&height=300&seq=heritage1&orientation=landscape",
      price: 3200,
      duration: "8 hours",
      pickup: true,
      chauffeur: "Hindi, English, Kannada",
      tag: {
        text: "Highlights",
        color: "orange" as const
      }
    },
    {
      id: "heritage-tour-12hr",
      title: "Extended Bangalore Heritage Tour",
      description: "Complete city tour including Lalbagh, ISKCON & Cubbon Park",
      imageUrl: "https://readdy.ai/api/search-image?query=Lalbagh%20Botanical%20Garden%20Bangalore%20with%20beautiful%20glass%20house%20and%20colorful%20flowers%2C%20botanical%20photography%2C%20serene%20garden%20landscape%2C%20Indian%20heritage%20garden%2C%20vibrant%20flora%2C%20peaceful%20atmosphere%2C%20tourism%20photography%20style%2C%20natural%20lighting&width=400&height=300&seq=lalbagh1&orientation=landscape",
      price: 4200,
      duration: "12 hours",
      pickup: true,
      chauffeur: "Hindi, English, Kannada",
      tag: {
        text: "Extended",
        color: "blue" as const
      }
    },
    {
      id: "nandi-sunrise",
      title: "Nandi Hills Sunrise Trek",
      description: "Watch the spectacular sunrise from 4,851 feet above sea level",
      imageUrl: "https://readdy.ai/api/search-image?query=Spectacular%20sunrise%20view%20from%20Nandi%20Hills%20with%20golden%20orange%20sky%2C%20silhouette%20of%20hills%20and%20valleys%2C%20misty%20morning%20landscape%2C%20peaceful%20nature%20scene%2C%20dramatic%20lighting%2C%20photography%20masterpiece%2C%20vibrant%20colors%2C%20serene%20atmosphere%2C%20Karnataka%20tourism%2C%20breathtaking%20vista&width=400&height=300&seq=nandi1&orientation=landscape",
      price: 3200,
      duration: "Full-Day",
      pickup: true,
      chauffeur: "Hindi, English, Kannada",
      tag: {
        text: "Nature",
        color: "green" as const
      }
    },
    {
      id: "mysore-palace",
      title: "Mysore Palace & Gardens",
      description: "Royal heritage tour with magnificent palace architecture",
      imageUrl: "https://readdy.ai/api/search-image?query=Mysore%20Palace%20with%20beautiful%20gardens%2C%20golden%20architecture%20and%20royal%20heritage%20building%2C%20Indian%20palace%20photography%2C%20majestic%20historical%20monument%20with%20intricate%20details%2C%20bright%20daylight%2C%20clear%20blue%20sky%2C%20professional%20travel%20photography%2C%20vibrant%20colors%2C%20detailed%20architecture&width=400&height=300&seq=mysore1&orientation=landscape",
      price: 4999,
      duration: "Full-Day",
      pickup: true,
      chauffeur: "Hindi, English, Kannada",
      tag: {
        text: "Popular",
        color: "red" as const
      }
    }
  ];

  return (
    <div className="min-h-[100svh] bg-gray-50 pb-20">
      <PWAPopup
        bottom={81}
        timeout={1000}
      />

      {/* Header - Reduced top padding */}
      <div className="bg-white px-4 py-4 mb-4 shadow-sm shadow-gray-100">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            {getGreeting()}
          </h1>
          <p className="text-sm text-gray-600">
            Find your next experience in Bangalore
          </p>
        </div>
      </div>

      {/* Quick Access */}
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Access
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickAccessItems.map((item, index) => (
            <QuickAccessCard
              key={index}
              title={item.title}
              description={item.description}
              imageUrl={item.imageUrl}
              href={item.href}
              onClick={item.onClick}
              comingSoon={!item.available}
            />
          ))}
        </div>
      </div>

      {/* Perfect for Today */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Perfect for Today
          </h2>
          <button
            onClick={handleViewAllClick}
            className="text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors cursor-pointer"
          >
            View all
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {allTrips.map(trip => (
            <Link
              id="trip"
              key={trip.id}
              to={`/${hotelId}/trip/${trip.id}`}
              className="block"
            >
              <TripCard
                key={trip.id}
                id={trip.id}
                title={trip.title}
                description={trip.description}
                imageUrl={trip.imageUrl}
                price={trip.price}
                duration={trip.duration}
                pickup={trip.pickup}
                chauffeur={trip.chauffeur}
                tag={trip.tag}
              />
            </Link>
          ))}
        </div>
      </div>

      {/* Share Card */}
      <div className="px-4">
        <ShareCard />
      </div>

      {/* Service Modal */}
      <ServiceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        type={modalType}
        onContinue={handleModalContinue}
      />
    </div>
  )
}