import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-takeups-border bg-takeups-panel/88 shadow-2xl shadow-black/30 backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
}
