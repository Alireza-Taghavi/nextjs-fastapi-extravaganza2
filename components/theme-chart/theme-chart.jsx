"use client"

import { Button } from "../ui/button";
import {useEffect, useState} from "react";
import axios from "axios";
import {toast} from "../../hooks/use-toast";
import {useStore} from "zustand/index";
import {useUserStore} from "../../stores/useUser";
import {cn} from "../../lib/utils";


export default function ThemeChart() {
    // Calculate the maximum votes to normalize bar lengths
    const {user, setUser,} = useStore(useUserStore, (state) => state)
    const [maxVotes, setMaxVotes] = useState()
    const [chartData, setChartData] = useState([{}])

    // Fetch themes from the API
    const fetchThemes = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/py/themes');
            setChartData(response.data);
            setMaxVotes(Math.max(...chartData.map(item => item.votes)))
        } catch (error) {
            console.error("Error fetching themes:", error);
            toast({
                title:"Failed to load themes. Please try again later."});
        }
    };

    // Submit a vote for a theme
    const voteTheme = async (themeId, userId) => {
        try {
            const response = await axios.post('http://localhost:3000/api/py/vote-theme', {
                theme_id: themeId,
                user_id: 1,
            });

            const updatedUser = user;
            updatedUser.theme = themeId;

            setUser(updatedUser)
            toast({
                title:"Vote submitted successfully!"});

            // Refresh the theme data to reflect the updated vote count
            fetchThemes();
        } catch (error) {
            console.error("Error submitting vote:", error);
            toast({
                title:`Error: ${error.response?.data?.detail || "An error occurred"}`
        });
        }
    };

    // Fetch themes on component mount
    useEffect(() => {
        fetchThemes();
        console.log(user)
    }, [user]);


    return (<div className="w-full flex sm:flex-col justify-between h-48 sm:h-full gap-2">
                {chartData.map((item, i) => (
                    <div key={i} className={cn(user?.theme===item.id ? "" : "grayscale-[40%]"
                        ,"flex flex-col-reverse sm:flex-row items-center gap-2 sm:gap-4 w-full")}>
                        <Button className="w-full sm:w-16 border-red-800 border-2"
                            disabled={user?.theme===item.id} onClick={()=>voteTheme(item.id ,user?.id)} variant={"outline"} size={"icon"} >
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
                        <div>
                            + {String(item.prize).padStart(2, '0')}
                        </div>
                    </div>
                ))}
            </div>
    );
}

