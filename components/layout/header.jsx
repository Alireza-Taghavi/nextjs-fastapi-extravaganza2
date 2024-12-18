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
            className="border-b-2 border-solid border-gray-200 border-opacity-30 w-full py-2 px-4 lg:py-4 lg:px-0 flex items-center justify-between">
            <div>
                <p>hello felani</p>
            </div>
            <div className="flex items-center space-x-2">
                <Button className={"rounded-full"}
                        variant="outline" size="icon" onClick={handleTheme}>
                    <Sun
                        className="absolute h-[1.2rem] w-[1.2rem]
                         duration-300
                          dark:opacity-0 transition-opacity  opacity-100"/>
                    <Moon
                        className="absolute h-[1.2rem] w-[1.2rem]
                         duration-300
                         dark:opacity-100 transition-opacity opacity-0"/>
                </Button>
            </div>
        </header>
    )
}
export default Header;