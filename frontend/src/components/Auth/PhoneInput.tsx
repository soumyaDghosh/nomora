import { useState } from "react";
import { Link } from "react-router-dom";
import useSendOtp from "../../hooks/useSendOTP";

interface PhoneInputProps {
    setTab: React.Dispatch<React.SetStateAction<number>>
    phoneNumber: string
    setPhoneNumber: React.Dispatch<React.SetStateAction<string>>
}

const PhoneInput = ({ setTab, phoneNumber, setPhoneNumber }: PhoneInputProps) => {
    const { loading, sendOtp } = useSendOtp();

    const [error, setError] = useState("");
    const [focused, setFocused] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.replace(/\D/g, "");
        if (inputValue.length <= 10) {
            handlePhoneChange(inputValue);
        }
    };

    const validateIndianMobile = (number: string): boolean => {
        const cleanNumber = number.replace(/\s+/g, "");
        const indianMobileRegex = /^[6-9]\d{9}$/;
        return indianMobileRegex.test(cleanNumber);
    };

    const isValidNumber = phoneNumber.length === 10 && validateIndianMobile(phoneNumber);

    const handleSendOTP = async () => {
        if (!isValidNumber) {
            setError("Please enter a valid 10-digit mobile number");
            return;
        }
        setError("");

        const ok = await sendOtp(phoneNumber);
        if (ok) {
            setTab(1);
        }
    };

    const handlePhoneChange = (value: string) => {
        setPhoneNumber(value);
        if (error) setError("");
    };

    return (
        <div className="min-h-[100svh] bg-white flex flex-col">
            <div className="flex items-center p-4 pt-12">
                <div className="flex-1 text-center">
                    <h1 className="text-lg font-semibold text-gray-900">Nomora</h1>
                </div>
            </div>

            <div className="flex-1 flex flex-col px-6 pt-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Log in or Sign up</h2>
                    <p className="text-gray-600">Enter your mobile number to continue</p>
                </div>

                <div className="mb-8">
                    <div className="w-full">
                        <div className={`flex border-2 rounded-xl overflow-hidden transition-all ${error ? "border-red-400" :
                            focused ? "border-gray-400" : "border-gray-200"
                            }`}>
                            <div className="bg-gray-50 px-4 py-3 border-r border-gray-200">
                                <span className="text-gray-700 font-medium">+91</span>
                            </div>
                            <input
                                type="tel"
                                inputMode="numeric"
                                placeholder="Enter mobile number"
                                value={phoneNumber}
                                onChange={handleChange}
                                onFocus={() => setFocused(true)}
                                onBlur={() => setFocused(false)}
                                disabled={loading}
                                className={`flex-1 px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none bg-white ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                                maxLength={10}
                            />
                        </div>
                        {error && (
                            <p className="text-red-500 text-sm mt-2 ml-1">{error}</p>
                        )}
                    </div>
                </div>

                <div className="mb-8">
                    <button
                        onClick={handleSendOTP}
                        disabled={!isValidNumber || loading}
                        className={`w-full py-4 rounded-2xl text-base font-medium transition-all flex items-center justify-center ${!isValidNumber || loading
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gray-800 text-white hover:bg-gray-900 cursor-pointer"
                            }`}
                    >
                        {loading && (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        )}
                        Get OTP
                    </button>
                </div>

                <div className="flex-1"></div>

                <div className="text-center pb-6 sm:pb-12">
                    <p className="text-sm text-gray-600">
                        By continuing you agree to our{" "}
                        <Link
                            to="/terms"
                            className="text-gray-900 underline"
                            target="_blank"
                        >
                            Terms
                        </Link>
                        {" "}and{" "}
                        <Link
                            to="/privacy"
                            className="text-gray-900 underline"
                            target="_blank"
                        >
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default PhoneInput