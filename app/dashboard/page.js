"use client"
import dynamic from "next/dynamic";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../../components/ui/card";

import {Lock} from "lucide-react";
import ThemeChart from "../../components/theme-chart/theme-chart";
import {Button} from "../../components/ui/button";
import Link from 'next/link'
import {Input} from "../../components/ui/input";
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {FormControl, Form, FormField, FormItem, FormLabel, FormMessage} from "../../components/ui/from";
import NetworkGraph from "../../components/network-graph/network-graph";
import axios from "axios";
import {useStore} from "zustand/index";
import {useUserStore} from "../../stores/useUser";
import {useToast} from "../../hooks/use-toast";
import {cn} from "../../lib/utils";
import HeartRain from "../../components/hearts/hearts";

const formSchema = z.object({
    name: z.string().regex(/^[a-z ,.'-]+$/i, "Must be english").min(2, {message: "Name too short"}).max(12, {message: "Name too long"}),
    phone: z.string().length(11, {message: "Must be 11 digits"}),
})

const Countdown = dynamic(() => import('../../components/countdown/Time'), {ssr: false})

export default function Dashboard() {
    const {user} = useStore(useUserStore, (state) => state)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: ""
        },
    })

    function getFirstName(fullName) {
        if (!fullName) return ""; // Handle empty strings
        const firstName = fullName.split(" ")[0]; // Split and get the first part
        return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    }

    const {toast} = useToast()

    async function onSubmit(values) {
        values.recommended_by = user.id
        values.name = getFirstName(values.name)
        try {
            // Send the data to the backend using Axios
            const response = await axios.post(`http://localhost:8000/api/py/recommend/`, values, {
                headers: {'Content-Type': 'application/json'}
            });

            // Display the success message
            toast({title: response.data.message})
        } catch (error) {
            // Handle the error if the user already exists
            if (error.response && error.response.status === 404) {
                toast({
                    title: error.response.data.detail,

                })
            } else {
                console.log(error.response)
                toast({
                    title: 'An unexpected error occurred.'
                });
            }
        }
    }

    return (
        <div
            className={"w-full min-h-full md:max-h-full px-4 sm:px-0 py-4 grid grid-cols-1 md:grid-cols-6 md:grid-rows-12 gap-y-2 md:gap-3 overflow-y-auto"}>
            <Card className="col-span-1 md:col-span-2 md:row-span-3 p-4 justify-center items-center flex">
                <Countdown targetDateTime={"2025-01-16T17:00:00"}/>
            </Card>
            <Card className="col-span-1 md:row-span-3 md:col-span-2 flex justify-center items-center py-8">
                <Link href={"/dashboard/readme"}><Button variant={"default"} size={"lg"}>Readme</Button></Link>
            </Card>
            <div className="col-span-1 md:md:row-span-12 md:col-span-2 flex flex-col gap-2 md:gap-3">
                <Card className="w-full flex flex-col items-center p-6">
                    <CardTitle>Invite Friends</CardTitle>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8  w-full">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Name" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Phone" type={"number"} {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button size={"lg"} type="submit">Submit</Button>
                        </form>
                    </Form>
                </Card>
                <Card className="w-full flex overflow-hidden md:h-full aspect-square">
                    <div className=" w-full h-full ">
                        <NetworkGraph/>
                    </div>
                </Card>
            </div>
            <Card className="col-span-1 md:row-span-5 md:col-span-3 p-4 ">
                <ThemeChart userId={user?.id}></ThemeChart>
            </Card>
            <Card
                className="col-span-1 md:row-span-5 md:col-span-1 bg-muted flex items-center justify-center cursor-not-allowed overflow-hidden relative py-4 min-h-32">
                <Lock className={"z-10 h-10 w-10 backdrop-blur backdrop-opacity-30"}/>
                <p className={"font-pt font-bold absolute opacity-10 text-2xl md:text-5xl pointer-events-none"}>QUEST</p>
            </Card>
            <Card className={cn("col-span-1 md:row-span-4 md:col-span-4 ",
                Math.floor((Date.parse("2025-01-16T17:00:00") - Date.now()) / (1000 * 60 * 60 * 24)) < 2 ? "" : "bg-muted")}>
                {
                    Math.floor((Date.parse("2025-01-16T17:00:00") - Date.now()) / (1000 * 60 * 60 * 24)) < 2 ?
                        (
                            <div className="h-full grayscale-[90%] saturate-200 dark:invert ">
                                <iframe title="map" style={{border: 0, width: "100%", height: "100%"}} loading="lazy"
                                        allowFullScreen
                                        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyCGLJOMc7JLoi_G5IlxJMN9jyJi1rOpv9A&q=8H7HP289%2B8J&zoom=14"></iframe>
                            </div>) : (
                            <div
                                className="w-full h-full flex items-center justify-center cursor-not-allowed  relative min-h-32">
                                <Lock className={"z-10 h-10 w-10 backdrop-blur backdrop-opacity-30"}/>
                                <p className={"font-pt font-bold absolute opacity-10 text-2xl md:text-5xl pointer-events-none"}>LOCATION</p>
                            </div>
                        )
                }
            </Card>

            {
                user?.id === 6 ? <HeartRain/> : null
            }
        </div>
    )
}