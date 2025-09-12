import { useLocation, useParams, Link } from "react-router-dom";

interface NavItem {
    href: string;
    icon: string;
    label: string;
}

const BottomNavigation = () => {
    const location = useLocation();
    const { hotelId } = useParams<{ hotelId: string }>();

    if (!hotelId) return null;

    const navItems: NavItem[] = [
        { href: `/${hotelId}`, icon: "ri-home-line", label: "Home" },
        { href: `/${hotelId}/transfer`, icon: "ri-plane-line", label: "Transfer" },
        { href: `/${hotelId}/bookings`, icon: "ri-calendar-line", label: "Bookings" },
        { href: `/${hotelId}/profile`, icon: "ri-user-line", label: "Profile" },
    ];

    const allowedTopRoutes = [
        `/${hotelId}`,
        `/${hotelId}/`,
        `/${hotelId}/explore`,
        `/${hotelId}/bookings`,
        `/${hotelId}/profile`,
        `/${hotelId}/transfer`,
    ];

    const isAllowed = allowedTopRoutes.includes(location.pathname);

    if (!isAllowed) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-40">
            <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-colors ${isActive
                                ? "text-gray-900 bg-gray-50"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            <i className={`${item.icon} text-lg mb-1`} />
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    )
}

export default BottomNavigation