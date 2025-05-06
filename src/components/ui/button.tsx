import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import LoadingIcon from "../custom/shared/LoadingIcon";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading,
  iconLocation = "left",
  iconButton = false,
  children,
  icon,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
    iconLocation?: "left" | "right";
    icon?: React.JSX.Element | SVGAElement | Iterable<React.ReactNode> | any;
    iconButton?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  const foundIcon = icon ? icon :
    <svg className="w-3.5" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.3346 0.888021H9.41797L8.58464 0.0546875H4.41797L3.58464 0.888021H0.667969V2.55469H12.3346M1.5013 13.388C1.5013 13.83 1.6769 14.254 1.98946 14.5665C2.30202 14.8791 2.72594 15.0547 3.16797 15.0547H9.83463C10.2767 15.0547 10.7006 14.8791 11.0131 14.5665C11.3257 14.254 11.5013 13.83 11.5013 13.388V3.38802H1.5013V13.388Z" fill="white" />
    </svg>;


  if (isLoading) {
    props.disabled = true;
  }


  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {(iconLocation === 'left' && isLoading) && <LoadingIcon />}
      {(iconButton && iconLocation === 'left' && !isLoading) && foundIcon}

      {children}

      {(iconLocation === 'right' && isLoading) && <LoadingIcon />}
      {(iconButton && iconLocation === 'right' && !isLoading) && foundIcon}

    </Comp>
  );
}

export { Button, buttonVariants };
