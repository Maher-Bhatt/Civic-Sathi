import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/site-nav";
import { AuthGate } from "@/lib/require-auth";
import { SectionLabel } from "@/components/ui/glass-card";
import { ComplaintCard } from "@/components/complaint-card";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { getMyComplaints } from "@/services/api";

export const Route = createFileRoute("/complaints")({
  head: () => ({
    meta: [
      { title: "My complaints — JANMIND" },
      {
        name: "description",
        content:
          "Track every civic complaint you submitted through JANMIND and its current status.",
      },
      { property: "og:title", content: "My complaints — JANMIND" },
      {
        property: "og:description",
        content: "Your civic report history with live status tracking.",
      },
    ],
  }),
  component: () => (
    <AuthGate redirectTo="/complaints">
      <ComplaintsPage />
    </AuthGate>
  ),
});

function ComplaintsPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["complaints"],
    queryFn: getMyComplaints,
  });

  return (
    <PageShell className="max-w-3xl">
      <div className="animate-rise space-y-2">
        <SectionLabel>Your activity</SectionLabel>
        <h1 className="text-2xl font-semibold sm:text-3xl">My complaints</h1>
        <p className="text-sm text-muted-foreground">
          Every report you submit stays here with its live status.
        </p>
      </div>

      <div className="mt-7">
        {isLoading && <LoadingState message="Loading your reports..." />}
        {isError && (
          <ErrorState
            description="We couldn't load your complaints right now."
            onRetry={() => void refetch()}
          />
        )}
        {data && data.length === 0 && (
          <EmptyState
            title="No reports yet"
            description="You haven't submitted any reports yet."
            actionLabel="Report a problem"
            onAction={() => navigate({ to: "/report" })}
          />
        )}
        {data && data.length > 0 && (
          <ul className="space-y-3">
            {data.map((c, i) => (
              <ComplaintCard key={c.id} complaint={c} index={i} />
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
}
