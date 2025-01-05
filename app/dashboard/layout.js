"use client"
import Header from "../../components/layout/header";
import useStore from "zustand";
import {useUserStore} from "../../stores/useUser";
import {Toaster} from "../../components/ui/toaster";
import HeartRain from "../../components/hearts/hearts";

export default function DashboardLayout ({ children}) {
    return (
        <>
            <Header/>
            <main className=" w-full flex flex-col items-center font-pt md:h-full overflow-y-hidden">
                {children}
            </main>
            <Toaster />
        </>
    )
}