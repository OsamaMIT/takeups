import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "gold";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  icon?: ReactNode;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-takeups-blue/60 bg-takeups-blue text-white shadow-glow hover:bg-[#6AA0FF]",
  secondary:
    "border-takeups-border bg-takeups-elevated text-takeups-text hover:border-takeups-blue/60 hover:bg-[#1A2230]",
  danger: "border-takeups-red/60 bg-takeups-red text-white shadow-redglow hover:bg-[#FF6B83]",
  ghost:
    "border-transparent bg-transparent text-takeups-muted hover:border-takeups-border hover:text-takeups-text",
  gold: "border-takeups-gold/70 bg-takeups-gold text-black hover:bg-[#FFD66D]"
};

export function Button({
  className,
  variant = "secondary",
  icon,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold uppercase tracking-[0.14em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-takeups-blue disabled:cursor-not-allowed disabled:opacity-45",
        variants[variant],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
