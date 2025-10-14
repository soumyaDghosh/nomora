import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import PWAPopup from "../components/PWAPopup";

interface StepProps {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

interface Step5Props {
  handleContinue: () => void;
}

export default function Welcome() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialStep = useMemo(() => {
    const stepFromUrl = Number(searchParams.get("step"));
    return Number.isFinite(stepFromUrl) && stepFromUrl >= 1 && stepFromUrl <= 5 ? stepFromUrl : 1;
  }, [searchParams]);

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [startX, setStartX] = useState<number | null>(null);

  const goToStep = (step: number) => {
    const clamped = Math.max(1, Math.min(step, steps.length));
    setCurrentStep(clamped);
    const next = new URLSearchParams(searchParams);
    next.set("step", String(clamped));
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    // Keep URL in sync if someone lands without step
    const stepFromUrl = Number(searchParams.get("step"));
    const normalized = Number.isFinite(stepFromUrl) && stepFromUrl >= 1 && stepFromUrl <= 5 ? stepFromUrl : 1;
    if (normalized !== currentStep) {
      goToStep(normalized);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = () => {
    localStorage.setItem("doneWelcome", "true");
    navigate(`/${hotelId}/auth`, { replace: true });
  };

  const steps = [
    <Step1 setCurrentStep={setCurrentStep} />,
    <Step2 setCurrentStep={setCurrentStep} />,
    <Step3 setCurrentStep={setCurrentStep} />,
    <Step4 setCurrentStep={setCurrentStep} />,
    <Step5 handleContinue={handleContinue} />,
  ];

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX === null) return;

    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentStep < steps.length) {
        goToStep(currentStep + 1);
      } else if (diff < 0 && currentStep > 1) {
        goToStep(currentStep - 1);
      }
    }

    setStartX(null);
  };

  return (
    <div
      className="min-h-[100svh] bg-white flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <PWAPopup top={0} timeout={1000} welcomePage={true} />

      {/* Progress Bar */}
      <div className="flex justify-between items-center h-[80px] px-4">
        <div className="flex space-x-2">
          {Array.from({ length: steps.length }, (_, i) => i + 1).map((step) => (
            <button key={step} onClick={() => goToStep(step)}>
              <div
                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                  currentStep >= step
                    ? "bg-gray-800 w-8"
                    : "bg-gray-200 w-2"
                }`}
              />
            </button>
          ))}
        </div>
        {currentStep < steps.length && (
          <button
            onClick={handleContinue}
            className="text-gray-500 text-sm font-medium cursor-pointer"
          >
            Skip
          </button>
        )}
      </div>

      {/* Current Step */}
      <div className="mt-6 flex justify-center px-6 overflow-y-auto">
        {steps[currentStep - 1]}
      </div>

      {/* Bottom Button */}
      <div className="mt-12 sm:mx-auto sm:max-w-sm w-full pb-6 px-6 sm:pb-12 sm:px-0">
        {currentStep < steps.length ? (
          <button
            onClick={() => goToStep(currentStep + 1)}
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
  <div className="flex flex-col items-center">
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
        Explore Bangalore with <span className="text-gray-900">Nomora</span>
      </h1>
      <p className="text-gray-600 text-base leading-relaxed">
        Book curated trips and private cabs with professional chauffeurs, with
        the convenience of hotel pickup and drop. Seamless travel, no planning
        required.
      </p>
    </div>
  </div>
);

const Step2: React.FC<StepProps> = () => (
  <div className="flex flex-col items-center">
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
        Traveler-First Service
      </h1>
      <p className="text-gray-600 text-base leading-relaxed">
        Designed for comfort and care. Expect uniformed chauffeurs, no rush
        pickups, clean and well-maintained vehicles, and luggage assistance.
      </p>
    </div>
  </div>
);

const Step3: React.FC<StepProps> = () => (
  <div className="flex flex-col items-center">
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
        Our partners know every landmark, best routes, parking spots, and
        traffic, ensuring quick, hassle-free local navigation. Enjoy safe,
        experienced driving.
      </p>
    </div>
  </div>
);

const Step4: React.FC<StepProps> = () => (
  <div className="flex flex-col items-center">
    <div className="w-full max-w-sm mb-12">
      <div className="relative rounded-3xl overflow-hidden shadow-lg bg-blue-50">
        <img
          src="/images/step4.png"
          alt=""
          className="w-full h-64 object-cover object-top"
        />
      </div>
    </div>

    <div className="text-center max-w-sm">
      <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
        No Price Negotiations
      </h1>
      <p className="text-gray-600 text-base leading-relaxed">
        We work only with best-quality service partners, offering upfront pricing
        and simple terms. No hidden charges, no surprises.
      </p>
    </div>
  </div>
);

const Step5: React.FC<Step5Props> = () => {
  const services = [
    {
      icon: "ri-plane-line",
      title: "Airport Transfers",
      description: "Reliable pickups and drop-offs",
    },
    {
      icon: "ri-camera-line",
      title: "Sightseeing",
      description: "Explore local attractions with chauffeur",
    },
    {
      icon: "ri-map-pin-line",
      title: "Same-Day Round Trips",
      description: "Curated escapes around Bangalore",
    },
    {
      icon: "ri-time-line",
      title: "Hourly Rental",
      description: "Perfect for business meetings",
    },
  ];

  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-center mb-6 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
          Designed for Tourists and Business Travelers
        </h1>
      </div>

      <div className="flex-1 w-full space-y-2 mb-1 px-4">
        {services.map((service, index) => (
          <div key={index} className="flex items-center space-x-4 py-2">
            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
              <i className={`${service.icon} text-white text-xl`}></i>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
