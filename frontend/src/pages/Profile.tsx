import { useParams, useNavigate } from "react-router-dom";
import usePWAStore from "../store/pwaStore";
import useAuthStore from "../store/authStore";
import useSignOut from "../hooks/useSignOut";

export default function Profile() {
    const { hotelId } = useParams<{ hotelId: string }>();
    const navigate = useNavigate();

    const { deferredPrompt, isInstallable, clearDeferredPrompt } = usePWAStore();
    const { user, clearUser } = useAuthStore();
    const { loading, signOut } = useSignOut();

    const handleInstall = async () => {
        if (!deferredPrompt) {
            alert("App install not available right now. Try from browser menu.");
            return;
        }

        deferredPrompt.prompt();
        await deferredPrompt.userChoice;

        clearDeferredPrompt();
    };

    const handleSignOut = async () => {
        const ok = await signOut();
        if (ok) {
            localStorage.removeItem("doneAuth");
            clearUser();
            navigate(`/${hotelId}/welcome`, { replace: true });
        }
    };

    return (
        <div className="min-h-[100svh] bg-gray-50 pb-20">
            {/* Header - Match Dashboard spacing: pt-6 pb-6 */}
            <div className="bg-white px-4 py-6.5 mb-6 shadow-sm shadow-gray-100">
                <h1 className="text-xl font-semibold text-gray-900">
                    Profile
                </h1>
            </div>

            <div className="px-4">
                <div className="bg-white rounded-2xl p-6">
                    <div className="flex items-center mb-6">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                            <i className="ri-user-line text-gray-600 text-2xl" />
                        </div>
                        {user?.phone && (
                            <div>
                                <h3 className="font-semibold text-gray-900">{user?.name || "User"}</h3>
                                <div className="flex items-center gap-2">
                                    <p className="text-gray-600 text-sm">
                                        +91 XXXXX{user.phone.toString().slice(5)}
                                    </p>
                                    <div className="flex items-center justify-center w-5 h-5 bg-gray-900 rounded-full">
                                        <i className="ri-check-line text-white text-xs" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        {isInstallable && (
                            <button
                                onClick={handleInstall}
                                className="w-full flex items-center justify-between p-4 rounded-xl transition-colors bg-gray-50 hover:bg-gray-100 cursor-pointer"
                            >
                                <div className="flex items-center">
                                    <i className="ri-download-line text-gray-600 mr-3" />
                                    <span className="text-gray-900">Install App</span>
                                </div>
                                <i className="ri-arrow-right-s-line text-gray-400" />
                            </button>
                        )}

                        <button
                            onClick={() => navigate(`/${hotelId}/support`)}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center">
                                <i className="ri-customer-service-line text-gray-600 mr-3" />
                                <span className="text-gray-900">Support</span>
                            </div>
                            <i className="ri-arrow-right-s-line text-gray-400" />
                        </button>

                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center">
                                <i className="ri-logout-box-line text-red-600 mr-3" />
                                <span className="text-red-600">Sign Out</span>
                            </div>
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-red-600 rounded-full animate-spin mr-2" />
                            ) : <i className="ri-arrow-right-s-line text-gray-400" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}