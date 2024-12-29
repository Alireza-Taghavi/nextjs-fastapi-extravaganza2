import OTPInput from "../../components/login/otp-input-wrapper";
import VerificationInput from "../../components/login/verification-input";

export default function Login() {
    return (
        <>

        <main className="flex flex-col items-center justify-center w-full h-full ">
            {/*<h1 className="scroll-m-20 font-serif uppercase text-7xl font-extrabold lg:text-7xl tracking-tighter absolute inset-0 top-1/2 opacity-5 -z-10 w-full h-full text-center">
                xtavaganz2
            </h1>*/}
            <OTPInput
                length={11}
            />
            <VerificationInput
            />
        </main>
            </>
    )
}