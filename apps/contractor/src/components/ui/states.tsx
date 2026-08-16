import { Loader2, AlertTriangle, Inbox } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { GlassButton } from "@/components/ui/glass-button";
import { cn } from "@/lib/utils";

export function LoadingState({
  message = "Loading...",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground",
        className,
      )}
    >
      <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-[var(--glass)]",
        "after:absolute after:inset-0 after:w-1/3 after:bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--foreground)_7%,transparent),transparent)] after:content-['']",
        className,
      )}
      style={{ animation: "none" }}
    >
      <span
        className="absolute inset-y-0 -left-1/3 w-1/3 bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--foreground)_8%,transparent),transparent)]"
        style={{ animation: "jm-sweep 1.6s ease-in-out infinite" }}
      />
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <GlassCard className="flex flex-col items-center gap-4 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-[var(--glass-strong)] text-muted-foreground">
        {icon ?? <Inbox className="h-5 w-5" aria-hidden />}
      </div>
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      {actionLabel && onAction && (
        <GlassButton onClick={onAction} size="sm">
          {actionLabel}
        </GlassButton>
      )}
    </GlassCard>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
}: {
  title?: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <GlassCard className="flex flex-col items-center gap-4 px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--critical)_35%,transparent)] bg-[color-mix(in_oklab,var(--critical)_12%,transparent)] text-critical">
        <AlertTriangle className="h-5 w-5" aria-hidden />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      {onRetry && (
        <GlassButton variant="glass" size="sm" onClick={onRetry}>
          Try again
        </GlassButton>
      )}
    </GlassCard>
  );
}
