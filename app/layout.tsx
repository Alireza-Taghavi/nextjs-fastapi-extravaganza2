import "./globals.css";
import {Inter} from "next/font/google";
import {cn} from "@/lib/utils";
import {ThemeProvider} from "@/components/layout/theme-provider";

const inter = Inter({subsets: ["latin"]});

export const metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">

        <body className={cn(inter.className, "flex h-dvh w-full flex-col items-center")}>{
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                disableTransitionOnChange
            >
                <div className={"flex flex-col max-w-7xl h-full items-center"}>
                    {children}
                </div>
            </ThemeProvider>
        }</body>
        </html>
    );
}
