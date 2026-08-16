import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, CheckCircle2, Info, UserCheck } from "lucide-react";
import { PageShell } from "@/components/site-nav";
import { AuthGate } from "@/lib/require-auth";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { getNotifications, markNotificationsRead } from "@/services/api";
import { useEffect } from "react";
import type { AppNotification } from "@/services/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — JANMIND" },
      {
        name: "description",
        content:
          "Status changes, officer assignments and resolution updates for your civic reports.",
      },
      { property: "og:title", content: "Notifications — JANMIND" },
      {
        property: "og:description",
        content: "Stay updated on every change to your civic complaints.",
      },
    ],
  }),
  component: () => (
    <AuthGate redirectTo="/notifications">
      <NotificationsPage />
    </AuthGate>
  ),
});

const icons = {
  received: Info,
  assigned: UserCheck,
  status: Bell,
  resolution: CheckCircle2,
} as const;

function NotificationItem({ item, index }: { item: AppNotification; index: number }) {
  const Icon = icons[item.kind];
  return (
    <GlassCard
      as="li"
      interactive
      className="animate-rise list-none p-0"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <Link
        to="/complaint/$id"
        params={{ id: item.complaintId }}
        className="flex items-start gap-4 p-5"
      >
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
            item.kind === "resolution"
              ? "border-[color-mix(in_oklab,var(--success)_40%,transparent)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)] text-success"
              : "border-border bg-[var(--glass-strong)] text-muted-foreground",
          )}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{item.title}</p>
            {!item.read && (
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-label="Unread" />
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
          <p className="mt-2 text-[0.68rem] tracking-[0.08em] text-subtle uppercase">
            {new Date(item.at).toLocaleString(undefined, {
              day: "2-digit",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </Link>
    </GlassCard>
  );
}

function NotificationsPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  useEffect(() => {
    if (data && data.some((n) => !n.read)) {
      markNotificationsRead().catch(console.error);
    }
  }, [data]);

  return (
    <PageShell className="max-w-2xl">
      <div className="animate-rise space-y-2">
        <SectionLabel>Updates</SectionLabel>
        <h1 className="text-2xl font-semibold sm:text-3xl">Notifications</h1>
      </div>

      <div className="mt-7">
        {isLoading && <LoadingState message="Loading notifications..." />}
        {isError && (
          <ErrorState
            description="We couldn't load your notifications."
            onRetry={() => void refetch()}
          />
        )}
        {data && data.length === 0 && (
          <EmptyState
            title="Nothing yet"
            description="Updates about your reports will appear here."
            actionLabel="Report a problem"
            onAction={() => navigate({ to: "/report" })}
          />
        )}
        {data && data.length > 0 && (
          <ul className="space-y-3">
            {data.map((n, i) => (
              <NotificationItem key={n.id} item={n} index={i} />
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
}
