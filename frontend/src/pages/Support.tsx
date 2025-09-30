import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Support() {
    const navigate = useNavigate();

    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const handleChatWithUs = () => {
        window.open("https://wa.me/+917483864715", "_blank");
    };

    const supportSections = [
        {
            id: "customize",
            question: "Can I customize my tour itinerary?",
            answer:
                "Currently, we do't offer customization. It impacts the number of places that can be covered within a timeframe and overall price, due to factors such as route adjustments, entry times, and traffic conditions.",
        },
        {
            id: "guests",
            question: "What is the maximum number of guests allowed?",
            answer: `Guest count depends on the seating capacity of the vehicle you’ve booked. Capacity details are provided on the relevant screens during booking.

Note: '+1' refers to the chauffeur.`,
        },
        {
            id: "payment",
            question: "How and when do I make the payment?",
            answer:
                "You can pay your chauffeur directly at the end of the trip using Cash or UPI (no cards for offline payments). Your payment details are available in My Bookings. If you'd prefer paying online, just chat with us and we'll share an official, secure Razorpay link.",
        },
        {
            id: "chauffeur-details",
            question: "I haven't received my chauffeur details yet. What should I do?",
            answer:
                "Chauffeur details are provided ahead of your pickup, usually 4 hours before airport transfers or by 11 PM the night before a scheduled tour. If you haven’t received them, please check your SMS, WhatsApp, and email (including the spam folder) and ensure your contact details are correct. If you still can’t find them, simply chat with us, and we’ll resend the chauffeur and vehicle details immediately.",
        },
        {
            id: "chauffeur-not-responding",
            question: "What should I do if my chauffeur is not answering my calls?",
            answer:
                "First, please try calling and messaging your chauffeur and operator a couple of times. If there's still no response, just chat with us, we'll quickly connect you or assign another service expert right away. Our support team is available 24/7 to make sure your trip goes smoothly.",
        },
        {
            id: "cancel-booking",
            question: "How do I cancel my booking?",
            answer:
                "We understand that plans can change. For tours, cancellations made more than 24 hours before the start time get a full refund. For airport transfers, the window is 4 hours. Refunds aren't available after that. If you're eligible, the refund will go back to your original payment method. Just chat with us, and we'll help you cancel right away.",
        },
        {
            id: "reschedule-booking",
            question: "How do I reschedule my booking?",
            answer:
                "We get it, things come up unexpectedly. For tours, you can reschedule your booking an unlimited number of times within 7 days of the booking date, at no additional cost. After 7 days, rescheduling isn't available, and refunds can't be processed. For airport transfers, rescheduling isn't supported; please check the cancellation policy in this case. If you'd like to make a change, just chat with us and we'll help you reschedule right away.",
        },
        {
            id: "tax-invoice",
            question: "How can I get a tax invoice for my trip?",
            answer: "Just chat with us, and we'll email your invoice within 12 hours.",
        },
    ];

    // Updated to split on real newline characters, making the function robust for both
    // template literals and strings that contain escaped "\\n".
    const formatAnswerText = (text: string) => {
        return text.split(/\r?\n/).map((line, index) => {
            if (line.trim() === "") {
                return <br key={index} />;
            }

            // Handle car category headers (Go, Comfort, Edge, Max)
            if (["Go", "Comfort", "Edge", "Max"].includes(line.trim())) {
                return (
                    <div key={index} className="font-medium text-gray-900 mt-3 mb-1">
                        {line}
                    </div>
                );
            }

            // Handle guest count lines
            if (line.includes("+1 Guests")) {
                return (
                    <div key={index} className="text-gray-600 text-sm mb-1">
                        {line}
                    </div>
                );
            }

            return (
                <p key={index} className="text-gray-600 leading-relaxed break-words mb-2">
                    {line}
                </p>
            );
        });
    };

    return (
        <div className="min-h-[100svh] bg-gray-50">
            {/* Header - Match Dashboard spacing */}
            <div className="bg-white px-4 py-5 sticky top-0 z-40 shadow-sm shadow-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 flex items-center justify-center cursor-pointer"
                        >
                            <i className="ri-arrow-left-line text-xl text-gray-900" />
                        </button>
                        <h1 className="text-lg font-medium text-gray-900">Help &amp; Support</h1>
                    </div>
                </div>
            </div>

            {/* Support Content */}
            <div className="px-4 pt-6 space-y-4">
                {supportSections.map((section) => (
                    <div
                        key={section.id}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                    >
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                        >
                            <span className="font-medium text-gray-900 pr-4 break-words flex-1">
                                {section.question}
                            </span>
                            {expandedSection === section.id ? (
                                <i className="ri-arrow-up-s-line text-gray-500 text-xl flex-shrink-0" />
                            ) : (
                                <i className="ri-arrow-down-s-line text-gray-500 text-xl flex-shrink-0" />
                            )}
                        </button>

                        {expandedSection === section.id && (
                            <div className="px-4 pb-4 border-t border-gray-100">
                                {/* FIXED: Added proper spacing between question and answer */}
                                <div className="space-y-3 mb-4 pt-4">
                                    {section.id === "guests" ? (
                                        <div>
                                            <p className="text-gray-600 leading-relaxed break-words mb-2">
                                                Guest count depends on the seating capacity of the vehicle you’ve booked. Capacity details are provided on the relevant screens during booking.
                                            </p>

                                            <div className="font-medium text-gray-900 mt-2 mb-1">
                                                Go
                                            </div>
                                            <div className="text-gray-600 text-sm mb-2">
                                                3+1 Guests
                                            </div>

                                            <div className="font-medium text-gray-900 mt-2 mb-1">
                                                Comfort
                                            </div>
                                            <div className="text-gray-600 text-sm mb-2">
                                                4+1 Guests
                                            </div>

                                            <div className="font-medium text-gray-900 mt-2 mb-1">
                                                Edge
                                            </div>
                                            <div className="text-gray-600 text-sm mb-2">
                                                4+1 Guests
                                            </div>

                                            <div className="font-medium text-gray-900 mt-2 mb-1">
                                                Max
                                            </div>
                                            <div className="text-gray-600 text-sm mb-2">
                                                6+1 Guests
                                            </div>

                                            <p className="text-gray-600 leading-relaxed break-words mb-2">
                                                Note: '+1' refers to the chauffeur.
                                            </p>
                                        </div>
                                    ) : (
                                        formatAnswerText(section.answer)
                                    )}
                                </div>

                                <button
                                    onClick={handleChatWithUs}
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                                >
                                    <i className="ri-whatsapp-line text-white" />
                                    <span>Chat with us</span>
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Need More Help Section */}
            <div className="px-4 py-6">
                <div className="bg-gray-100 rounded-xl p-6 text-center">
                    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="ri-customer-service-2-line text-white text-xl" />
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2">Need More Help?</h3>
                    <p className="text-sm text-gray-600 mb-4 break-words leading-relaxed">
                        Can't find what you're looking for? Our support team is here to help you 24/7.
                    </p>

                    <button
                        onClick={handleChatWithUs}
                        className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                        <i className="ri-whatsapp-line text-white" />
                        <span>Start Live Chat</span>
                    </button>
                </div>
            </div>
        </div>
    )
}