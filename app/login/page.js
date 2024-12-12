import OTPInput from "../../components/login/otp-input";

export default function Login() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="flex">
                <OTPInput
                    length={11}
                />
            </div>
        </main>
    )
}