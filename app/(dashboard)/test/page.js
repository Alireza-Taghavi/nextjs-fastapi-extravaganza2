"use client"
import dynamic from "next/dynamic";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../../../components/ui/card";
import {Button} from "../../../components/ui/button";

const Countdown = dynamic(() => import('../../../components/countdown/Time'), { ssr: false })

export default function Dashboard(){

    return (
        <div className={"flex flex-col items-center justify-center w-full h-full"}>
            <Countdown targetDateTime={"2025-01-16T17:00:00"} />
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Create project</CardTitle>
                    <CardDescription>Deploy your new project in one-click.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>teststsetst</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button>Deploy</Button>
                </CardFooter>
            </Card>
        </div>
    )
}