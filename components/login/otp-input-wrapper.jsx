'use client';

import React, {createContext, useEffect, useRef, useState} from 'react';

import {useLoginStore} from '../../stores/useUser';
import {InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator} from "../ui/input-otp";
import {cn} from "../../lib/utils";

const OTPInputWrapper = ({
                             length = 6,
                             className = '',
                             disabled = false,
                             onComplete,
                         }) => {
    const phone = useLoginStore((state) => state.phone);
    const setPhone = useLoginStore((state) => state.setPhone);
    const setEmojis = useLoginStore((state) => state.setEmojis);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState("default"); // "success" or "failure"

    useEffect(() => {
        setTimeout(() => {
            setResult("default");
            setIsLoading(false);
        }, 2000);
    }, [result]);

    const handleComplete = async (otpValue) => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/py/login/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({phone: otpValue}),
            });

            if (!response.ok) throw new Error('Invalid OTP');
            const result = await response.json();
            setEmojis(result.emojis.split(' - '));
            setPhone(otpValue);
            setResult("success");

            if (onComplete) onComplete(otpValue);
        } catch {
            setResult("error");
            console.error('OTP validation failed');
        }
    };

    if (phone) return null;

    return (
        <>
            <InputOTP
                onComplete={handleComplete}
                containerClassName={cn(className, "transition-all "
                    , isLoading ? "" : "")}
                disabled={isLoading}
                maxLength={length}
                autoFocus={true}
            >
                <InputOTPGroup>
                    {/* Render each OTP slot */}
                    {Array.from({length}).map((_, index) => (
                        <InputOTPSlot
                            key={index}
                            index={index}
                            className={cn("duration-100", isLoading ? "animate-pulse" : "")}
                            isLoading={isLoading}
                            state={result}
                        />
                    ))}
                </InputOTPGroup>
            </InputOTP>
        </>
    );
};

export default OTPInputWrapper;