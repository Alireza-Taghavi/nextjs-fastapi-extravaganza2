import React, {useState, useEffect} from 'react';

const Countdown = ({targetDateTime}) => {
    const calculateTimeLeft = () => {
        const now = new Date();
        const target = new Date(targetDateTime);
        const difference = target - now;

        return difference > 0 ? difference : 0; // Return time in milliseconds
    };

    const [time, setTime] = useState(calculateTimeLeft());

    useEffect(() => {
        if (time === 0) return;

        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTime(newTimeLeft);
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDateTime]); // Only reinitialize on targetDateTime change

    const formatTime = (time) => {
        return String(time).padStart(2, '0')
    };

    return (
        <div className={"w-full flex flex-col items-center justify-center gap-2 text-md text-foreground"}>
            <div className="flex gap-10">
                <div className="flex flex-col items-center gap-2">
                    <span className={"text-5xl"}>{Math.floor(time / (1000 * 60 * 60 * 24))}</span>
                    <span className={""}>Days</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span
                        className="flex gap-1"><span>{formatTime(Math.floor((time / (1000 * 60 * 60)) % 24))}</span><span>Hours</span></span>
                    <span
                        className="flex gap-1"><span>{formatTime(Math.floor((time / (1000 * 60)) % 60))}</span><span>Minutes</span></span>
                    <span
                        className="flex gap-1"><span>{formatTime(Math.floor((time / 1000) % 60))}</span><span>Seconds</span></span>
                </div>
            </div>
            <p>{"Thursday, January 16, 2025 | 17:00"}</p>
            {/*<p>{"پنجشنبه ، 27 دی ، 1403  |  17:00"}</p>*/}
        </div>
    );
};

export default Countdown;
