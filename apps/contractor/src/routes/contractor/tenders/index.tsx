import { createFileRoute, Link } from "@tanstack/react-router";
import { useContractorAuth } from "@/lib/contractor-auth";
import { getEligibleTenders } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "@/components/ui/states";
import { GlassCard } from "@/components/ui/glass-card";

export const Route = createFileRoute("/contractor/tenders/")({
  component: TendersIndex,
});

const TENDER_STATUS_LABEL: Record<string, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Open for Bids",
  CLOSED: "Closed",
  EVALUATING: "Under Evaluation",
  AWARDED: "Awarded",
  CANCELLED: "Cancelled",
};

const TENDER_STATUS_COLOR: Record<string, string> = {
  DRAFT: "text-[var(--muted-foreground)]",
  PUBLISHED: "text-green-500",
  CLOSED: "text-[var(--warning)]",
  EVALUATING: "text-[var(--primary)]",
  AWARDED: "text-[var(--success)]",
  CANCELLED: "text-[var(--critical)]",
};

function TendersIndex() {
  const { contractor } = useContractorAuth();

  // contractor.city comes from the backend User.city field (set during login).
  // getEligibleTenders resolves city name slugs to real DB UUIDs internally.
  const cityParam = contractor?.city ?? "vadodara";

  const { data: tenders = [], isLoading: loading } = useQuery({
    queryKey: ["contractor-tenders", cityParam],
    queryFn: () => getEligibleTenders(cityParam),
    // Only fetch once we have a real contractor id (i.e., logged in)
    enabled: !!contractor?.id,
  });

  if (loading) {
    return <LoadingState message="Loading tenders..." />;
  }

  return (
    <div className="space-y-6 animate-fade">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">
          Tenders &amp; Bidding
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Open procurement opportunities you are eligible for.
        </p>
      </header>

      {tenders.length === 0 ? (
        <GlassCard className="p-12 text-center glass-strong">
          <p className="text-[var(--muted-foreground)]">
            No open tenders found for your approved categories and cities.
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mt-2">
            Your contractor profile must be approved in a city before tenders appear here.
          </p>
        </GlassCard>
      ) : (
        <div className="grid gap-4">
          {tenders.map((t: any) => (
            <Link
              key={t.id}
              to={"/contractor/tenders/$id" as any}
              params={{ id: t.id }}
              className="block"
            >
              <GlassCard className="p-6 glass-strong lift transition-all hover:border-[var(--primary)]/40">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs font-semibold uppercase px-2 py-0.5 rounded bg-[var(--surface-elevated)] border border-[var(--glass-border)] ${TENDER_STATUS_COLOR[t.status] ?? "text-[var(--muted-foreground)]"}`}
                      >
                        {TENDER_STATUS_LABEL[t.status] ?? t.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-[var(--foreground)] leading-tight">
                      {t.title}
                    </h3>
                    {t.description && (
                      <p className="mt-1.5 text-sm text-[var(--muted-foreground)] line-clamp-2">
                        {t.description}
                      </p>
                    )}
                    {t.closed_at && (
                      <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                        Closes:{" "}
                        <span className="font-medium text-[var(--foreground)]">
                          {new Date(t.closed_at).toLocaleDateString("en-IN")}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-xs text-[var(--muted-foreground)] mb-1">Est. Budget</div>
                    <div className="text-lg font-semibold tabular-nums text-[var(--primary)]">
                      ₹{(t.estimated_budget ?? 0).toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
