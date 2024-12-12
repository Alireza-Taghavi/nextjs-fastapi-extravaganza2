"use client"
import React, {useState, useRef, useEffect} from 'react';
import {motion} from 'framer-motion';

const OTPInput = ({
                      length = 11,
                      className = '',
                      disabled = false
                  }) => {
    const [otp, setOTP] = useState(Array(length).fill(''));
    const [validationState, setValidationState] = useState('neutral');
    const [animationTrigger, setAnimationTrigger] = useState(false);
    const inputRefs = useRef(Array(length).fill(null));
    const [isCompleted, setIsCompleted] = useState(false)

    async function handleChange(index, value) {
        // Validate input to only allow numbers
        if (!/^\d*$/.test(value)) return;

        const newOTP = [...otp];
        newOTP[index] = value;
        setOTP(newOTP);

        // Automatically move focus to next input if filled
        if (value && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }
        if (isCompleted) {
            setValidationState('neutral');
            setAnimationTrigger(false);
            setAnimationTrigger(false);
        }

        // Check if OTP is complete
        if (newOTP.every(digit => digit !== '')) {
            // Simulate OTP validation (replace with your actual validation logic)

            // Trigger animation and validation state
            setIsCompleted(true);
            setAnimationTrigger(true);
            // setValidationState(isValid ? 'success' : 'error');
            // alert("test")
            // Call onComplete callback
            let response = await fetch('http://localhost:3000/api/py/login/', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({phone: newOTP.join('')})
            })
            response = await response;
            if(!response.ok){

            }

            console.log(response)

        }
    };

    // Simulated OTP validation function
    const validateOTP = (otpValue) => {
        // Example validation: check if OTP is a specific value
        // Replace with your actual validation logic
        return otpValue === '09035013471';
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
            // Simulate OTP validation (replace with your actual validation logic)
            // const isValid = validateOTP(newOTP.join(''));

            // Trigger animation and validation state
            setIsCompleted(true)
            setAnimationTrigger(true);
            // setValidationState(isValid ? 'success' : 'error');
            // Call onComplete callback
        }
    };

    // Reset animation and validation state
    const resetState = () => {
        setAnimationTrigger(false);
        setValidationState('neutral');
        setOTP(Array(length).fill(''));
        inputRefs.current[0].focus();
    };

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
                        aria-label={`OTP Digit ${index + 1}`}
                        className={`
              w-10 h-10 text-center rounded border 
              outline-none focus:ring-2 focus:ring-blue-500
              transition-all duration-300
              ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-text'}
              ${animationTrigger
                            ? (validationState === 'success'
                                ? 'border-green-500 text-green-700 animate-bounce'
                                : 'border-red-500 text-red-700 animate-bounce')
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