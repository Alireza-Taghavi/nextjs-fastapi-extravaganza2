"use client"

import { Button } from "../ui/button";

const chartData = [
    { theme: "halloween", votes: 27, fill: "orange", icon: "🎃" },
    { theme: "black", votes: 20, fill: "green", icon: "🎄" },
    { theme: "white", votes: 18, fill: "white", icon: "🤍" },
    { theme: "red", votes: 17, fill: "red", icon: "❤️" },
    { theme: "other", votes: 9, fill: "yellow", icon: "🔑" },
];

export default function ThemeChart() {
    // Calculate the maximum votes to normalize bar lengths
    const maxVotes = Math.max(...chartData.map(item => item.votes));

    return (
            <div className="w-full flex sm:flex-col justify-between  grayscale-[50%] h-48 sm:h-full gap-2">
                {chartData.map((item, i) => (
                    <div key={i} className="flex flex-col-reverse sm:flex-row items-center gap-2 sm:gap-4 w-full">
                        <Button variant={"outline"} size={"icon"} className="w-full sm:w-16">
                            {item.icon}
                        </Button>
                        <div className="flex-1 h-6 hidden sm:block">
                            <div
                                className="h-full border-4 border-dashed border-background "
                                style={{
                                    width: `${(item.votes / maxVotes) * 100}%`,
                                    backgroundColor: item.fill,
                                }}
                            />
                        </div>
                        <div className="flex-1 w-4 sm:w-6 sm:hidden flex flex-col">
                            <div
                                className="w-full border-4 border-dashed border-background mt-auto"
                                style={{
                                    height: `${(item.votes / maxVotes) * 100}%`,
                                    backgroundColor: item.fill,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
    );
}

