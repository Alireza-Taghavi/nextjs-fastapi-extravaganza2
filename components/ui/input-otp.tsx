"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { Minus } from "lucide-react"

import { cn } from "@/lib/utils"

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    containerClassName={cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    )}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

const InputOTPSlot = React.forwardRef<
    React.ElementRef<"div">,
    React.ComponentPropsWithoutRef<"div"> & {
    index: number;
    isLoading?: boolean; // false by default
    state?: "default" | "error" | "success"; // default by default
}
>(({ index, className, isLoading = false, state = "default", ...props }, ref) => {
    const inputOTPContext = React.useContext(OTPInputContext);
    const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

    // State for the random number when isLoading is true
    const [randomNumber, setRandomNumber] = React.useState(0);

    React.useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isLoading) {
            // Update the random number every 0.1s
            interval = setInterval(() => {
                setRandomNumber(Math.floor(Math.random() * 10)); // Random number between 0 and 9
            }, 100);
        } else {
            if (interval) clearInterval(interval);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isLoading]);

    // Determine the border color based on the state
    const borderColor =
        state === "error"
            ? "border-destructive"
            : state === "success"
                ? "border-green-500"
                : "border-input";

    return (
        <div
            ref={ref}
            className={cn(
                "relative flex h-9 w-7 md:h-12 md:w-12 items-center justify-center border-y border-r text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
                borderColor, // Apply dynamic border color
                ((isActive && !isLoading) && "z-10 ring-1 ring-gray-950 dark:ring-gray-300"),
                className
            )}
            {...props}
        >
            {isLoading ? randomNumber : char}
            {hasFakeCaret && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-4 w-px animate-caret-blink bg-gray-950 duration-1000 dark:bg-gray-50" />
                </div>
            )}
        </div>
    );
});
InputOTPSlot.displayName = "InputOTPSlot"

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Minus />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
