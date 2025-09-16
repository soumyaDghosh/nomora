import { useState, useRef, useEffect } from "react";
import useAuthStore from "../../store/authStore";
import useVerifyOtp from "../../hooks/useVerifyOTP";
import useSendOtp from "../../hooks/useSendOTP"
import useFetchUser from "../../hooks/useFetchUser";
import useFetchBookings from "../../hooks/useFetchBookings";

interface OTPInputProps {
    setTab: React.Dispatch<React.SetStateAction<number>>
    phoneNumber: string
}

const OTPInput = ({ setTab, phoneNumber }: OTPInputProps) => {
    const { isAuthenticating } = useAuthStore();

    const { loading, verifyOtp } = useVerifyOtp();
    const { sendOtp } = useSendOtp();
    const { fetchUser } = useFetchUser();
    const { fetchBookings } = useFetchBookings();

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const [resetKey, setResetKey] = useState(0);
    const [resendMessage, setResendMessage] = useState("");

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
        else {
            setCanResend(true);
        }
    }, [countdown]);

    const handleOTPComplete = (otpValue: string) => {
        setOtp(otpValue);
    };

    const handleVerifyOTP = async () => {
        if (!otp || otp.length !== 4) return;
        setError("");

        const ok = await verifyOtp(phoneNumber, otp);
        if (ok) {
            const ok = await fetchUser();
            if (ok) {
                await fetchBookings();
            }
        }
        else {
            setError("OTP is incorrect");
            setOtp("");
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) return;

        setCanResend(false);
        setCountdown(30);
        setError("");
        setResetKey(prev => prev + 1);
        setOtp("");

        const maskedNumber = formatPhoneNumber(phoneNumber);
        setResendMessage(`OTP is resent to ${maskedNumber}`);

        await sendOtp(phoneNumber);
    };

    const formatPhoneNumber = (phone: string) => {
        if (phone.length === 10) {
            return `+91 XXXXXX${phone.slice(-4)}`;
        }
        return `+91 XXXXXX${phone.slice(-4)}`;
    };

    return (
        <div className="min-h-[100svh] bg-white flex flex-col">
            <div className="grid grid-cols-3 items-center p-4 pt-12">
                <button
                    onClick={() => setTab(0)}
                    className="w-7 h-7 flex items-center justify-center cursor-pointer"
                >
                    <i className="ri-arrow-left-line text-xl text-gray-700" />
                </button>
                <div className="flex-1 text-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Nomora</h1>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center px-6 pt-8">
                <div className="mb-8">
                    <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">Enter OTP</h2>
                    <p className="text-gray-600">
                        {resendMessage || `OTP sent to ${formatPhoneNumber(phoneNumber)}`}
                    </p>
                </div>

                <div className="mb-6">
                    <OTPField
                        key={resetKey}
                        length={4}
                        onComplete={handleOTPComplete}
                        error={!!error}
                        setError={setError}
                        value={otp}
                        onChange={setOtp}
                    />
                </div>

                {error && (
                    <div className="mb-4 text-center">
                        <p className="text-red-500 text-sm">{error}</p>
                    </div>
                )}

                <div className="mb-8 text-center">
                    <button
                        disabled={!canResend || isAuthenticating}
                        onClick={handleResendOTP}
                        className={`text-sm font-medium ${canResend ? "text-gray-900 underline cursor-pointer" : "text-gray-600 cursor-not-allowed"}`}
                    >
                        {canResend ? "Resend OTP" : `Resend OTP in ${countdown}s`}
                    </button>
                </div>

                <div className="mb-8 w-full">
                    <button
                        onClick={handleVerifyOTP}
                        disabled={!otp || otp.length !== 4 || loading || isAuthenticating}
                        className={`w-full py-4 rounded-2xl text-base font-medium transition-all flex items-center justify-center ${!otp || otp.length !== 4 || loading
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gray-800 text-white hover:bg-gray-900 cursor-pointer"
                            } `}
                    >
                        {(loading || isAuthenticating) && (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        )}
                        Verify OTP
                    </button>
                </div>

                <div className="flex-1"></div>

                <div className="text-center pb-12">
                    <p className="text-sm text-gray-500">
                        Didn't receive the code? Check your SMS or try again
                    </p>
                </div>
            </div>
        </div>
    )
}

interface OTPFieldProps {
    length: number
    onComplete: (otp: string) => void
    error?: boolean
    setError: React.Dispatch<React.SetStateAction<string>>
    value?: string
    onChange?: (otp: string) => void
}

const OTPField = ({ length, onComplete, error, setError, value, onChange }: OTPFieldProps) => {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
    // const [shake, setShake] = useState(false);
    const inputRefs = useRef<HTMLInputElement[]>([]);

    // useEffect(() => {
    //     if (error) {
    //         setShake(true);
    //         setTimeout(() => setShake(false), 500);
    //     }
    // }, [error]);

    useEffect(() => {
        if (value === "") {
            const newOtp = new Array(length).fill("");
            setOtp(newOtp);
            inputRefs.current[0]?.focus();
        }
    }, [value, length]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const updateOTP = (newOtp: string[]) => {
        setOtp(newOtp);
        const otpString = newOtp.join("");
        onChange?.(otpString);

        if (newOtp.every(digit => digit !== "")) {
            onComplete(otpString);
        }
    };

    const handleChange = (element: HTMLInputElement, index: number) => {
        const value = element.value;
        setError("");

        if (value && isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        updateOTP(newOtp);

        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            const newOtp = [...otp];

            if (newOtp[index]) {
                newOtp[index] = "";
                updateOTP(newOtp);
            }
            else if (index > 0) {
                newOtp[index - 1] = "";
                updateOTP(newOtp);
                inputRefs.current[index - 1]?.focus();
            }
        }
        else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        else if (e.key === "ArrowRight" && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
        const newOtp = new Array(length).fill("");

        for (let i = 0; i < pasteData.length; i++) {
            newOtp[i] = pasteData[i];
        }

        updateOTP(newOtp);

        const nextIndex = Math.min(pasteData.length, length - 1);
        inputRefs.current[nextIndex]?.focus();
    };

    return (
        // <div className={`flex justify-center space-x-3 ${shake ? "animate-bounce" : ""}`}>
        <div className='flex justify-center space-x-3'>
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(ref) => {
                        if (ref) inputRefs.current[index] = ref;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className={`
                        w-12 h-12 text-center text-lg font-medium border-2 rounded-xl outline-none transition-all 
                        ${error
                            ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-400"
                            : "border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-400"
                        }
                    `}
                />
            ))}
        </div>
    )
}

export default OTPInput