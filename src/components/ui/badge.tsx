import * as React from "react";
import { cn } from "@/lib/utils";

/** The `.chip` component class from index.css, as a span. One definition, not two. */
export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("chip", className)} {...props} />;
}
