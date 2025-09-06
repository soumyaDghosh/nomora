import { useState } from "react";
import PhoneInput from "../components/Auth/PhoneInput";
import OTPInput from "../components/Auth/OTPInput";

export default function Auth() {
    const [tab, setTab] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState("");

    return tab === 0 ? (
        <PhoneInput
            setTab={setTab}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
        />
    ) : (
        <OTPInput
            setTab={setTab}
            phoneNumber={phoneNumber}
        />
    )
}