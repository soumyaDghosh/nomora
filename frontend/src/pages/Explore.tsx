import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import TripCard from "../components/Home/TripCard";

export default function Explore() {
    const { hotelId } = useParams<{ hotelId: string }>();

    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState("all");

    const tabs = useMemo(() => [
        { id: "all", label: "All" },
        { id: "tours", label: "Tours" },
        { id: "sameday", label: "Same-Day" },
        { id: "overnight", label: "Overnight" },
        { id: "experiences", label: "Experiences" },
    ], []);

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab && tabs.some((t) => t.id === tab)) {
            setActiveTab(tab);
        }
    }, [searchParams, tabs]);

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
            category: "tours",
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
            category: "tours",
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
            category: "sameday",
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
            category: "sameday",
            tag: {
                text: "Popular",
                color: "red" as const
            }
        }
    ];

    const filteredTrips = activeTab === "all"
        ? allTrips
        : allTrips.filter(trip => trip.category === activeTab);

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        const url = new URL(window.location.href);
        url.searchParams.set("tab", tabId);
        window.history.pushState({}, "", url.pathname + url.search);
    };

    return (
        <div className="min-h-[100svh] bg-gray-50 pb-20">
            {/* Header - Match Dashboard spacing: pt-6 pb-4 (slightly reduced bottom for pills) */}
            <div className="bg-white px-4 py-4 sticky top-0 z-40 shadow-sm shadow-gray-100">
                <div className="flex items-center mb-4">
                    <Link
                        to={`/${hotelId}`}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors mr-3"
                    >
                        <i className="ri-arrow-left-line text-xl text-gray-700" />
                    </Link>
                    <h1 className="text-xl font-semibold text-gray-900">
                        Tours and Experiences
                    </h1>
                </div>

                {/* Pills - Hide scrollbar on all devices */}
                <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${activeTab === tab.id
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="px-4 py-6 flex flex-col gap-4">
                {filteredTrips.length > 0 ? (
                    filteredTrips.map((trip) => (
                        <Link
                            id="tripLink"
                            key={trip.id}
                            to={`/${hotelId}/trip/${trip.id}`}
                            className="block"
                        >
                            <TripCard
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
                    ))
                ) : (
                    <EmptyState type={activeTab} />
                )}
            </div>
        </div>
    )
}

interface EmptyStateProps {
    type: string;
}

const EmptyState = ({ type }: EmptyStateProps) => {
    const getEmptyStateContent = () => {
        switch (type) {
            case "overnight":
                return {
                    icon: "ri-hotel-line",
                    title: "Overnight Trips Coming Soon",
                    description:
                        "Weekend getaways and multi-day adventures are being curated for you. Stay tuned for exciting overnight experiences!",
                    imageUrl:
                        "https://readdy.ai/api/search-image?query=Beautiful%20mountain%20resort%20at%20sunset%20with%20cozy%20accommodation%2C%20peaceful%20retreat%20destination%2C%20scenic%20landscape%20with%20hills%20and%20valleys%2C%20warm%20lighting%2C%20vacation%20photography%2C%20serene%20atmosphere%2C%20Karnataka%20hill%20station%2C%20luxury%20getaway%2C%20golden%20hour%20lighting&width=300&height=200&seq=overnight1&orientation=landscape",
                };
            case "experiences":
                return {
                    icon: "ri-camera-line",
                    title: "Local Experiences Coming Soon",
                    description:
                        "Unique cultural activities, food tours, and authentic local experiences are being prepared. Discover hidden gems soon!",
                    imageUrl:
                        "https://readdy.ai/api/search-image?query=Traditional%20Indian%20cultural%20workshop%20with%20artisan%20crafting%20pottery%2C%20authentic%20local%20experience%2C%20cultural%20heritage%20activity%2C%20warm%20indoor%20lighting%2C%20hands-on%20learning%2C%20traditional%20Indian%20arts%20and%20crafts%2C%20detailed%20craftsmanship%2C%20cultural%20tourism%20photography&width=300&height=200&seq=experiences1&orientation=landscape",
                };
            default:
                return {
                    icon: "ri-search-line",
                    title: "No Results Found",
                    description:
                        "Try adjusting your filters or check back later for new experiences.",
                    imageUrl:
                        "https://readdy.ai/api/search-image?query=Empty%20state%20illustration%20with%20magnifying%20glass%20and%20search%20concept%2C%20minimalist%20design%2C%20soft%20colors%2C%20clean%20background%2C%20modern%20illustration%20style%2C%20user%20interface%20design%2C%20neutral%20tones%2C%20simple%20composition&width=300&height=200&seq=empty1&orientation=landscape",
                };
        }
    };

    const content = getEmptyStateContent();

    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            {/* Image */}
            <div className="w-48 h-32 rounded-2xl overflow-hidden mb-6 bg-gray-100">
                <img
                    src={content.imageUrl}
                    alt=""
                    className="w-full h-full object-cover object-center"
                />
            </div>

            {/* Icon */}
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i className={`${content.icon} text-2xl text-gray-400`} />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-3 max-w-xs">
                {content.title}
            </h3>

            {/* Description */}
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                {content.description}
            </p>
        </div>
    )
}