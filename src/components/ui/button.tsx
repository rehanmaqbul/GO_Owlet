
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary/50 backdrop-blur-md text-primary-foreground hover:bg-primary/40",
        destructive:
          "bg-destructive/50 backdrop-blur-md text-destructive-foreground hover:bg-destructive/40",
        outline:
          "border border-input/50 bg-background/20 backdrop-blur-md hover:bg-accent/20 hover:text-accent-foreground",
        secondary:
          "bg-secondary/40 backdrop-blur-md text-secondary-foreground hover:bg-secondary/30",
        ghost: "hover:bg-accent/20 backdrop-blur-md hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        subject: "h-24 flex flex-col items-center justify-center text-center p-4 bg-white/40 backdrop-blur-md shadow-md hover:bg-accent/30 border border-white/20",
        teacher: "h-24 bg-owl-blue text-white hover:bg-owl-blue/90 rounded-lg",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        xl: "h-16 px-8 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
