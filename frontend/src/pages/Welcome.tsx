import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface StepProps {
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>
}
interface Step5Props {
    handleContinue: () => void
}

export default function Welcome() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);

    const handleContinue = () => {
        localStorage.setItem("hasSeenWelcome", "true");
        navigate("/auth", { replace: true });
    };

    const steps = [
        <Step1 setCurrentStep={setCurrentStep} />,
        <Step2 setCurrentStep={setCurrentStep} />,
        <Step3 setCurrentStep={setCurrentStep} />,
        <Step4 setCurrentStep={setCurrentStep} />,
        <Step5 handleContinue={handleContinue} />,
    ];

    return (
        <div className="min-h-[100svh] bg-white flex flex-col">
            <div className="flex justify-between items-center p-4 pt-6 sm:pt-12">
                <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((step) => (
                        <button key={step} onClick={() => setCurrentStep(step)}>
                            <div
                                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${currentStep >= step
                                    ? "bg-gray-800 w-7"
                                    : "bg-gray-200 w-4"
                                    }`}
                            />
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleContinue}
                    className="text-gray-500 text-sm font-medium cursor-pointer"
                >
                    Skip
                </button>
            </div>

            <div className="flex-1 flex justify-center px-6 overflow-y-auto">
                {steps[currentStep - 1]}
            </div>

            <div className="sm:mx-auto sm:max-w-sm w-full pb-6 px-6 sm:pb-12 sm:px-0">
                {currentStep < 5 ? (
                    <button
                        onClick={() => setCurrentStep((prev) => prev + 1)}
                        className="w-full bg-gray-800 text-white py-4 rounded-2xl text-base font-medium hover:bg-gray-900 transition-colors cursor-pointer"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handleContinue}
                        className="w-full bg-gray-800 text-white py-4 rounded-2xl text-base font-medium hover:bg-gray-900 transition-colors cursor-pointer"
                    >
                        Continue to Explore Bangalore
                    </button>
                )}
            </div>
        </div>
    );
}

const Step1: React.FC<StepProps> = () => (
    <div className="flex flex-col items-center pt-8">
        <div className="w-full max-w-sm mb-12">
            <div className="relative rounded-3xl overflow-hidden shadow-lg">
                <img
                    src="https://static.readdy.ai/image/638a2981e869109b2bf5c39446e6f624/95cc522fcb564bea0ee463a520cfcc7b.png"
                    alt=""
                    className="w-full h-64 object-cover object-top"
                />
            </div>
        </div>

        <div className="text-center max-w-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                Explore Bangalore with Nomora
            </h1>
            <p className="text-gray-600 text-base leading-relaxed">
                Sightseeing, tourist activities, and cab services with high-quality, private chauffeurs. Seamless travel, no planning required.
            </p>
        </div>
    </div>
);

const Step2: React.FC<StepProps> = () => (
    <div className="flex flex-col items-center pt-8">
        <div className="w-full max-w-sm mb-12">
            <div className="relative rounded-3xl overflow-hidden shadow-lg">
                <img
                    src="https://static.readdy.ai/image/638a2981e869109b2bf5c39446e6f624/902b4b3d6dec05a54d527d2169022ae4.png"
                    alt=""
                    className="w-full h-64 object-cover object-top"
                />
            </div>
        </div>

        <div className="text-center max-w-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                Tourist-First Service
            </h1>
            <p className="text-gray-600 text-base leading-relaxed">
                Designed for tourist comfort and care. Expect no rush pickups, clean cars, help with luggage, and multi-language support.
            </p>
        </div>
    </div>
);

const Step3: React.FC<StepProps> = () => (
    <div className="flex flex-col items-center pt-8">
        <div className="w-full max-w-sm mb-12">
            <div className="relative rounded-3xl overflow-hidden shadow-lg">
                <img
                    src="https://static.readdy.ai/image/638a2981e869109b2bf5c39446e6f624/101310c3bd2325b8a63dd7228eaee762.png"
                    alt=""
                    className="w-full h-64 object-cover object-top"
                />
            </div>
        </div>

        <div className="text-center max-w-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                Travel with Local Experts
            </h1>
            <p className="text-gray-600 text-base leading-relaxed">
                Our partners know every landmark, route, and traffic flow, ensuring quick, hassle-free pickups, drop-offs, and getting around. Enjoy safe and experienced driving.
            </p>
        </div>
    </div>
);

const Step4: React.FC<StepProps> = () => (
    <div className="flex flex-col items-center pt-8">
        <div className="w-full max-w-sm mb-12">
            <div className="relative rounded-3xl overflow-hidden shadow-lg bg-blue-100">
                <img
                    src="https://static.readdy.ai/image/638a2981e869109b2bf5c39446e6f624/dec2cd142401efcbd0184fd36d6da84c.png"
                    alt=""
                    className="w-full h-64 object-cover object-top"
                />
            </div>
        </div>

        <div className="text-center max-w-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                Early Vehicle Assignment
            </h1>
            <p className="text-gray-600 text-base leading-relaxed">
                No more waiting till the last minute. Get your car details upfront, so you can travel with confidence, zero stress, zero impact on your plans.
            </p>
        </div>
    </div>
);

const Step5: React.FC<Step5Props> = () => (
    <div className="flex flex-col items-center pt-8">
        <div className="w-full max-w-sm mb-12">
            <div className="relative rounded-3xl overflow-hidden shadow-lg bg-blue-50">
                <img
                    src="https://static.readdy.ai/image/638a2981e869109b2bf5c39446e6f624/fe2d911edc0ed324ad71151cd045de83.png"
                    alt=""
                    className="w-full h-64 object-cover object-top"
                />
            </div>
        </div>

        <div className="text-center max-w-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                Clear Terms, Trusted Partners
            </h1>
            <p className="text-gray-600 text-base leading-relaxed">
                We work with high-quality service partners, offering upfront, simple, and clear terms. No negotiations, no hidden charges.
            </p>
        </div>
    </div>
);