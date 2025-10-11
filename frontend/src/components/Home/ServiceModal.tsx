import { useState, useEffect } from 'react';

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'sightseeing' | 'daytrips';
    onContinue?: (type: 'sightseeing' | 'daytrips') => void;
}

export default function ServiceModal({ isOpen, onClose, type, onContinue }: ServiceModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    const sightseeingContent = {
        title: 'City Sightseeing',
        description: 'Discover must-see attractions and spots with expert-curated tours. From iconic landmarks to authentic local experiences – all bookable in seconds. Skip the research, and negotiations.',
        features: [
            {
                icon: 'ri-time-line',
                title: 'Duration Options',
                subtitle: '8 hrs to 12 hrs'
            },
            {
                icon: 'ri-car-line',
                title: 'Transportation',
                subtitle: 'Private Car with a chauffeur'
            },
            {
                icon: 'ri-map-pin-line',
                title: 'Convenience',
                subtitle: 'Pickup and drop off at Hotel/Location'
            },
            {
                icon: 'ri-user-line',
                title: 'Guide Service',
                subtitle: 'Tour Guide (Optional)'
            }
        ]
    };

    const daytripsContent = {
        title: 'Same-Day Trips',
        description: 'Explore places within drivable distance from Bangalore. Start early in the morning and return by night.',
        features: [
            {
                icon: 'ri-time-line',
                title: 'Duration Option',
                subtitle: 'Follows calendar day ending at midnight'
            },
            {
                icon: 'ri-car-line',
                title: 'Transportation',
                subtitle: 'Private Car with a chauffeur'
            },
            {
                icon: 'ri-map-pin-line',
                title: 'Convenience',
                subtitle: 'Pickup and drop off at Hotel/Location'
            },
            {
                icon: 'ri-user-line',
                title: 'Guide Service',
                subtitle: 'Tour Guide (Optional)'
            }
        ]
    };

    const content = type === 'sightseeing' ? sightseeingContent : daytripsContent;

    const handleContinueClick = () => {
        if (onContinue) {
            onContinue(type);
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'opacity-50' : 'opacity-0'
                    }`}
                onClick={onClose}
            />

            {/* Modal */}
            <div className={`relative w-full bg-white rounded-t-3xl transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'
                }`}>
                {/* Handle */}
                <div className="flex justify-center py-3">
                    <div className="w-10 h-1 bg-gray-300 rounded-full" />
                </div>

                {/* Content */}
                <div className="px-6 pb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {content.title}
                    </h2>

                    <p className="text-gray-600 text-sm leading-relaxed mb-8 break-words">
                        {content.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-6 mb-8">
                        {content.features.map((feature, index) => (
                            <div key={index} className="flex items-start space-x-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <i className={`${feature.icon} text-gray-600 text-lg`}></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 text-sm mb-1 break-words">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm break-words">
                                        {feature.subtitle}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Continue Button */}
                    <button
                        onClick={handleContinueClick}
                        className="w-full bg-gray-800 text-white py-4 rounded-2xl text-base font-medium hover:bg-gray-900 transition-colors cursor-pointer"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    )
}