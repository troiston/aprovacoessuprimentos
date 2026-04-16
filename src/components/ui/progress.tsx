"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  segments?: { value: number; label: string; color?: string }[];
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, segments, ...props }, ref) => {
  if (segments) {
    const total = segments.reduce((s, seg) => s + seg.value, 0);
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={Math.round(total)}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn("progress-blueprint w-full", className)}
        {...props}
      >
        {segments.map((seg, i) => (
          <div
            key={i}
            title={`${seg.label}: ${seg.value.toFixed(1)}%`}
            className="h-full rounded-[2px] transition-all duration-[--duration-slow]"
            style={{
              width: `${seg.value}%`,
              backgroundColor: seg.color ?? "var(--color-chart-1)",
              minWidth: seg.value > 0 ? "2px" : "0",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-1.5 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary transition-all duration-[--duration-slow] ease-[--easing-decelerate]"
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
