'use client'
import React, {useState, useRef} from 'react';
import {useLoginStore} from "../../stores/user";

const OTPInput = ({
                      length = 6,
                      className = '',
                      disabled = false
                  }) => {
    const [otp, setOTP] = useState(Array(length).fill(''));
    const [validationState, setValidationState] = useState('neutral');
    const inputRefs = useRef(Array(length).fill(null));

    const phone = useLoginStore((state) => state.phone)
    const setPhone = useLoginStore((state) => state.setPhone)
    const setEmojis = useLoginStore((state) => state.setEmojis)

    const handleChange = async (index, value) => {
        // Validate input to only allow numbers
        if (!/^\d*$/.test(value)) return;

        const newOTP = [...otp];
        newOTP[index] = value;
        setOTP(newOTP);

        // Automatically move focus to next input if filled
        if (value && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }

        // Check if OTP is complete
        if (newOTP.every(digit => digit !== '')) {
            await triggerCompletionAnimation(newOTP.join(''));
        }
    };

    const triggerCompletionAnimation = async (value) => {
        // Sequential focus animation
        for (let i = 0; i < length; i++) {
            inputRefs.current[i].classList.add('motion-safe:animate-bounce');
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Validate OTP (replace with your actual validation)
        const isValid = await validateOTP(value);

        // Set final validation state
        setValidationState(isValid ? 'success' : 'error');

        // Wait a moment before final action
        await new Promise(resolve => setTimeout(resolve, 500));


        for (let i = 0; i < length; i++) {
            inputRefs.current[i].classList.remove('motion-safe:animate-bounce');
            await new Promise(resolve => setTimeout(resolve, 50))
        }

        await new Promise(resolve => setTimeout(resolve, 800));
        setValidationState("neutral")

        // Call onComplete with validation result
        if (isValid) setPhone(value)
    };

    // Simulated OTP validation function
    const validateOTP = async (otpValue) => {
        // Example validation: you would replace this with your actual validation logic
        let response = await fetch('http://localhost:3000/api/py/login/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({phone: otpValue})
        })
        if (!response.ok) return false;
        response = await response.json();
        setEmojis(response.emojis.split(" - "))

        return true;
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace to move focus and clear previous input
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
            const newOTP = [...otp];
            newOTP[index - 1] = '';
            setOTP(newOTP);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');

        // Only allow numeric paste
        if (!/^\d+$/.test(pastedText)) return;

        // Limit to OTP length
        const pastedOTP = pastedText.slice(0, length).split('');

        const newOTP = [...otp];
        pastedOTP.forEach((digit, index) => {
            if (index < length) {
                newOTP[index] = digit;
            }
        });

        setOTP(newOTP);

        // Focus on last input after paste
        inputRefs.current[Math.min(pastedOTP.length - 1, length - 1)].focus();

        // Check if OTP is complete
        if (newOTP.every(digit => digit !== '')) {
            triggerCompletionAnimation();
        }
    };

    if (!!phone) return <></>

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    aria-label={`Phone digit ${index + 1}`}
                    className={`
                        w-10 h-10 text-center rounded border 
                        outline-none focus:ring-2 focus:ring-blue-500
                        transition-all duration-300
                        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-text'}
                        ${validationState === 'success'
                        ? 'border-green-500 text-green-700'
                        : validationState === 'error'
                            ? 'border-red-500 text-red-700'
                            : 'border-gray-300 focus:border-blue-500'
                    }
                    `}
                    disabled={disabled}
                />
            ))}
        </div>
    );
};

export default OTPInput;