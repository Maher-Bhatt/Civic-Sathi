import { cn } from "@/lib/utils";

type Elevation = "flat" | "raised" | "solid";

export interface GlassCardProps extends React.HTMLAttributes<HTMLElement> {
  elevation?: Elevation;
  interactive?: boolean;
  as?: "div" | "section" | "article" | "li" | "aside";
}

export function GlassCard({
  className,
  elevation = "flat",
  interactive = false,
  as: Tag = "div",
  ...props
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        "rounded-2xl",
        elevation === "solid" ? "solid-surface" : elevation === "raised" ? "glass-strong" : "glass",
        interactive && "lift cursor-pointer",
        className,
      )}
      {...props}
    />
  );
}

export function SectionLabel({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("label-xs block", className)} {...props} />;
}
