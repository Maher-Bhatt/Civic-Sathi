import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const glassButton = cva(
  "press inline-flex items-center justify-center gap-2 rounded-xl font-medium tracking-[0.06em] uppercase select-none disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[var(--shadow-lift)]",
        glass:
          "glass text-foreground hover:-translate-y-0.5 hover:bg-[var(--glass-strong)] hover:shadow-[var(--shadow-lift)]",
        outline:
          "border border-border bg-transparent text-foreground hover:-translate-y-0.5 hover:bg-[var(--glass)]",
        ghost: "text-muted-foreground hover:text-foreground hover:bg-[var(--glass)]",
        danger:
          "bg-critical text-primary-foreground hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[var(--shadow-lift)]",
      },
      size: {
        sm: "h-9 px-3.5 text-[0.7rem]",
        md: "h-11 px-5 text-xs",
        lg: "h-13 px-7 text-[0.8rem]",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof glassButton> {
  asChild?: boolean;
}

export function GlassButton({ className, variant, size, asChild, ...props }: GlassButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(glassButton({ variant, size }), className)} {...props} />;
}

export { glassButton };
