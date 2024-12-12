import OTPInput from "../../components/login/otp-input";
import VerificationInput from "../../components/login/verification-input";

export default function Login() {
    return (
        <main className="flex h-dvh flex-col items-center justify-center px-16">
            <div className="flex">

                <OTPInput
                    length={11}
                />
                <VerificationInput
                />

            </div>
        </main>
    )
}