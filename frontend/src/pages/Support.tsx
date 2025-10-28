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
      question: "Can I customize the tour itinerary?",
      answer:
        "Customization is currently not offered. It impacts the number of places that can be covered within a timeframe and overall price, due to factors such as route adjustments, entry times, and traffic conditions.",
    },
    {
      id: "guests",
      question: "What is the maximum number of guests allowed?",
      answer: `The guest count depends on the seating capacity of the vehicle you choose. Details are provided during the booking process.`,
    },
    {
      id: "payment",
      question: "How and when do I make payment?",
      answer:
        "Payment is made on the app when you book. Any charges for extra time beyond the scheduled trip are paid directly to the driver at the rates shown on the payment page.",
    },
    {
      id: "chauffeur-details",
      question:
        "I haven't received my chauffeur details yet. What should I do?",
      answer:
        "First, please double-check your WhatsApp and ensure your contact details are correct. If you still don't have them, start a WhatsApp chat from our app, and we'll share the details immediately.",
    },
    {
      id: "chauffeur-not-reachable",
      question: "What should I do if my chauffeur is not reachable?",
      answer:
        "If you've tried calling and messaging a couple of times with no response, start a WhatsApp chat with our 24/7 support team from our app.",
    },
    {
      id: "cancellation-policy",
      question: "What is your cancellation policy?",
      answer:
        "Sightseeing Tours: Free cancellation until 6 PM the day before. Airport Transfers & Hourly Rentals: Free cancellation up to 12 hours before pickup. Please reach out to our customer support and we'll process your cancellation immediately.",
    },
    // {
    //     id: "reschedule-booking",
    //     question: "How do I reschedule my booking?",
    //     answer:
    //         "We get it, things come up unexpectedly. For tours, you can reschedule your booking an unlimited number of times within 7 days of the booking date, at no additional cost. After 7 days, rescheduling isn't available, and refunds can't be processed. For airport transfers, rescheduling isn't supported; please check the cancellation policy in this case. If you'd like to make a change, just chat with us and we'll help you reschedule right away.",
    // },
    // {
    //     id: "tax-invoice",
    //     question: "How can I get a tax invoice for my trip?",
    //     answer: "Just chat with us, and we'll email your invoice within 12 hours.",
    // },
    {
      id: "refund policy",
      question: "What is your refund policy?",
      answer:
        "During Free Cancellation Window: Full refund to original payment source. After window but 3+ hours before trip: 25% cancellation fee applies. Within 3 hours of trip or after: No refund. Check your booking details for the exact free cancellation window.Refunds for failed payments or eligible cancellations are automatically credited to your original payment method within 5–7 business days, in accordance with standard bank processing times. No further action is required on your part.",
    },
    {
      id: "tax-invoice",
      question: "How can I get a tax invoice for my trip?",
      answer:
        "Please start a WhatsApp chat with our support team from the app, or email us at care@nomora.co.in, and we'll email your invoice within 12 hours. We are working to automate this feature so you can download it instantly."
    },
  ];

  // Updated to split on real newline characters, making the function robust for both
  // template literals and strings that contain escaped "\\n".
  const formatAnswerText = (text: string) => {
    return text.split(/\r?\n/).map((line, index) => {
      if (line.trim() === "") {
        return <br key={index} />;
      }

      // Handle car category headers (Go, Prime, Edge, Max)
      if (["Go", "Prime", "Edge", "Max"].includes(line.trim())) {
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
        <p
          key={index}
          className="text-gray-600 leading-relaxed break-words mb-2"
        >
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
            <h1 className="text-lg font-medium text-gray-900">
              Help &amp; Support
            </h1>
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
                  {formatAnswerText(section.answer)}
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
            Can't find what you're looking for? Our support team is here to help
            you 24/7.
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
  );
}