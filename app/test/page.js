"use client"
import Countdown from "../../components/countdown/Time";

export default function Dashboard(){

    return (
        <main className={"flex h-dvh flex-col items-center justify-center px-16"}>
            <Countdown targetDateTime={"2025-01-16T17:00:00"} />
        </main>
    )
}