import OTPInput from "../../components/login/otp-input";
import VerificationInput from "../../components/login/verification-input";

export default function Login() {
    return (
        <main className="flex items-center justify-center w-full h-full">

            <OTPInput
                length={11}
            />
            <VerificationInput
            />
        </main>
    )
}