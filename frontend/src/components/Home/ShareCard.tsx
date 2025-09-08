const ShareCard = () => {
    const handleShare = async () => {
        const shareData = {
            title: "Nomora – Last-Minute Travel App",
            text: "Check out Nomora! City tours, day trips, and local experiences with high-quality private chauffeurs in and around your favorite Bangalore city. Safe and comfortable trips.",
            url: window.location.origin
        };

        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share(shareData);
            }
            catch (error) {
                console.error("Error sharing:", error);
            }
        }
        else {
            // Fallback for browsers that don"t support Web Share API
            try {
                if (typeof navigator !== "undefined" && navigator.clipboard) {
                    await navigator.clipboard.writeText(shareData.url);
                    alert("Link copied to clipboard!");
                }
                else {
                    // Further fallback
                    const textArea = document.createElement("textarea");
                    textArea.value = shareData.url;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand("copy");
                    document.body.removeChild(textArea);
                    alert("Link copied to clipboard!");
                }
            }
            catch {
                alert("Unable to copy link");
            }
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center mb-6">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-heart-line text-gray-600 text-xl" />
            </div>

            <h3 className="font-semibold text-gray-900 text-base mb-2">
                Enjoying Nomora?
            </h3>

            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Share it with friends and family who love making spontaneous travel plans.
            </p>

            <button
                onClick={handleShare}
                className="bg-gray-800 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-900 transition-colors cursor-pointer"
            >
                Share Nomora
            </button>
        </div>
    )
}

export default ShareCard