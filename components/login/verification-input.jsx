"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {useLoginStore} from "../../stores/user";

const VerificationInput = () => {
    const router = useRouter();
    const [options, setOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [attempts, setAttempts] = useState(3);
    const phone = useLoginStore((state) => state.phone)
    const emojis = useLoginStore((state) => state.emojis)
    // Add this useEffect to set options when emojis prop changes
    useEffect(() => {
        if (emojis && emojis.length > 0) {
            setOptions(emojis);
        }
    }, [emojis]);

    const handleSelection = (option) => {
        // If option is already selected, deselect it
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter(item => item !== option));
            return;
        }

        // Prevent selecting more than 3 options
        if (selectedOptions.length >= 3) {
            alert('You can only select 3 options.');
            return;
        }

        // Add the selected option
        const newSelectedOptions = [...selectedOptions, option];
        setSelectedOptions(newSelectedOptions);

        // If 3 options are selected, make API call
        if (newSelectedOptions.length === 3) {
            makeAPICall(newSelectedOptions);
        }
    };

    const makeAPICall = async (selections) => {
        try {
            // Replace with your actual API endpoint
            const response = await fetch('http://localhost:3000/api/py/verify-login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone: phone, code: selections.join('') }),
            });

            if (response.ok) {
                // Redirect after successful submission
                router.push('/success');
            } else {
                // Decrement attempts
                const newAttempts = attempts - 1;
                setAttempts(newAttempts);

                if (newAttempts === 0) {
                    // Redirect if no attempts left
                    router.push('/game-over');
                } else {
                    // Reset selections
                    setSelectedOptions([]);
                }
            }
        } catch (error) {
            console.error('API call error:', error);

            // Decrement attempts on error
            const newAttempts = attempts - 1;
            setAttempts(newAttempts);

            if (newAttempts === 0) {
                router.push('/game-over');
            } else {
                // Reset selections
                setSelectedOptions([]);
            }
        }
    };

    if (!phone) return <></>


    return  (
        <div className="p-4 space-y-4">
            <div className="text-center">
                <h2 className="text-xl font-bold mb-2">Select 3 Options</h2>
                <p className="text-muted-foreground">Attempts Remaining: {attempts}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {options.map((option) => (
                    <button
                        key={option}
                        onClick={() => handleSelection(option)}
                        className={`w-full p-2 ${
                            selectedOptions.includes(option)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default VerificationInput;