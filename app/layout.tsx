"use client"
import "./globals.css";
import {Inter, PT_Serif} from "next/font/google";
import {cn} from "@/lib/utils";
import {ThemeProvider} from "@/components/layout/theme-provider";
import localFont from 'next/font/local'
import {useRouter} from "next/navigation";
import {useLoginStore, useUserStore} from "@/stores/useUser";
import {useEffect} from "react";
import {useStore} from "zustand";

const inter = Inter(
    {
        subsets: ["latin"],
        variable: '--font-inter'
    });

const ptSerif = PT_Serif(
    {
        weight: ["400", "700"],
        subsets: ["latin"],
        variable: '--font-pt_serif'
    });

const flurries = localFont({
    src: './Flurries.otf',
    display: 'auto',
    variable: '--font-flurries'
})



export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const {user, setUser} = useStore(useUserStore, (state) => state)

    useEffect(() => {
        if (!!user) {
            router.replace('/dashboard');
        } else {
            router.replace('/login');
        }
    }, [user, router]);
    return (
        <html lang="en">
        <head>
            <title>Extravaganza 2</title>
        </head>
        <body className={cn(inter.variable, flurries.variable, ptSerif.variable, "flex h-dvh w-full flex-col items-center bg-background")}>{
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                disableTransitionOnChange
            >
                <div
                    className={"flex flex-col max-w-7xl w-full items-center px-0 sm:px-4 md:px-16 xl:px-0 overflow-x-hidden h-full"}>
                    {children}
                </div>
            </ThemeProvider>
        }</body>
        </html>
    );
}
