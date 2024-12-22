"use client"
import {Moon, Sun} from "lucide-react"
import {Button} from "../ui/button";
import {useTheme} from "next-themes";

const Header = () => {
    const {setTheme, theme} = useTheme()

    function handleTheme() {
        if (theme === "dark") {
            setTheme("light");
        } else if (theme === "light") {
            setTheme("dark");
        }
    }

    return (
        <header
            className="border-b-2 border-solid border-border w-full py-2 px-4 lg:py-4 sm:px-0 flex items-center justify-between sticky top-0 bg-background">
            <div>
                <h1 className="font-serif uppercase text-xl lg:text-2xl">
                    xtavaganz 2
                </h1>
            </div>
            <div className="flex items-center space-x-2">
                <Button className={"rounded-full"}
                        variant="outline" size="icon" onClick={handleTheme}>
                    <Sun
                        className="absolute h-[1.2rem] w-[1.2rem]
                         duration-300
                          dark:opacity-0 transition-opacity  opacity-60"/>
                    <Moon
                        className="absolute h-[1.2rem] w-[1.2rem]
                         duration-300
                         dark:opacity-60 transition-opacity opacity-0"/>
                </Button>
            </div>
        </header>
    )
}
export default Header;