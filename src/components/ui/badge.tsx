import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-overlay/10 bg-overlay/[0.04] px-2.5 py-1 text-xs font-medium text-muted",
        className
      )}
      {...props}
    />
  );
}
