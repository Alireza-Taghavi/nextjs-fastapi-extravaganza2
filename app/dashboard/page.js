"use client"
import dynamic from "next/dynamic";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../../components/ui/card";

import {Lock} from "lucide-react";
import ThemeChart from "../../components/theme-chart/theme-chart";
import {Button} from "../../components/ui/button";
import Link from 'next/link'
const Countdown = dynamic(() => import('../../components/countdown/Time'), {ssr: false})

export default function Dashboard() {


    return (
        <div
            className={"w-full min-h-full md:max-h-full px-4 sm:px-0 py-4 grid grid-cols-1 md:grid-cols-6 md:grid-rows-12 gap-y-2 md:gap-3 overflow-y-auto"}>
            <Card className="col-span-1 md:col-span-2 md:row-span-3">
                <Countdown targetDateTime={"2025-01-16T17:00:00"}/>
            </Card>
            <Card className="col-span-1 md:row-span-3 md:col-span-2 flex justify-center items-center py-8">
                <Link href={"/dashboard/readme"}><Button variant={"default"} size={"lg"}>Readme</Button></Link>
            </Card>
            <div className="col-span-1 md:md:row-span-12 md:col-span-2 flex flex-col gap-2 md:gap-3">
                <Card className="w-full md:h-2/5">add friend</Card>
                <Card className="w-full md:h-3/5">list</Card>
            </div>
            <Card className="col-span-1 md:row-span-5 md:col-span-3 p-4 ">
               <ThemeChart></ThemeChart>
            </Card>
            <Card
                className="col-span-1 md:row-span-5 md:col-span-1 bg-muted flex items-center justify-center cursor-not-allowed overflow-hidden relative py-4">
                <Lock className={"z-10 h-10 w-10 backdrop-blur backdrop-opacity-30"}/>
                <p className={"font-pt font-bold absolute opacity-10 text-2xl md:text-5xl pointer-events-none"}>QUEST</p>
            </Card>
            <Card className="col-span-1 md:row-span-4 md:col-span-4 ">
                {
                    Math.floor((Date.parse("2025-01-16T17:00:00") - Date.now()) / (1000 * 60 * 60 * 24)) < 2 ?
                        (
                            <div className="h-full grayscale-[90%] saturate-200 dark:invert ">
                                <iframe title="map" style={{border: 0, width: "100%", height: "100%"}} loading="lazy"
                                        allowFullScreen
                                        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCGLJOMc7JLoi_G5IlxJMN9jyJi1rOpv9A&q=8H7HP289%2B8J&zoom=14"></iframe>
                            </div>) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center cursor-not-allowed  relative py-4">
                                <Lock className={"z-10 h-10 w-10 backdrop-blur backdrop-opacity-30"}/>
                                <p className={"font-pt font-bold absolute opacity-10 text-2xl md:text-5xl pointer-events-none"}>LOCATION</p>
                            </div>
                        )
                }
            </Card>
        </div>
    )
}