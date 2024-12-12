"use client"
import OTPInput from "../../components/login/otp-input";
import {useLoginStore} from "../../stores/user";
import VerificationInput from "../../components/login/verification-input";

export default function Login() {
    const phoneNumber = useLoginStore((state) => state.phone)
    const emojis = useLoginStore((state) => state.emojis)
    return (
        <main className="flex h-dvh flex-col items-center justify-center px-16">
            <div className="flex">
                {
                    (phoneNumber == null) ?
                        <OTPInput
                            length={11}
                        />
                        :
                        <VerificationInput
                            emojis={emojis}
                            phone={phoneNumber}
                        />
                }
            </div>
        </main>
    )
}