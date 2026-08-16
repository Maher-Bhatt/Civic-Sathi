import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getEligibleTenders } from "@/services/api";
import { useContractorAuth } from "@/lib/contractor-auth";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/contractor/tenders/")({
  component: TendersIndex,
});

function TendersIndex() {
  const { contractor } = useContractorAuth();
  const cityId = contractor?.city || "11111111-1111-1111-1111-111111111111";

  const { data: tenders = [], isLoading: loading } = useQuery({
    queryKey: ["contractor-tenders", cityId],
    queryFn: () => getEligibleTenders(cityId),
    enabled: !!contractor,
  });

  if (loading) {
    return <div className="p-8 text-center text-[var(--muted-foreground)]">Loading tenders...</div>;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Tenders & Bidding</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Open procurement opportunities you are eligible for.
        </p>
      </header>
      
      {tenders.length === 0 ? (
        <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--surface-elevated)] p-12 text-center">
          <p className="text-[var(--muted-foreground)]">No open tenders found for your approved categories and cities.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tenders.map((t) => (
            <Link
              key={t.id}
              to={"/contractor/tenders/$id" as any}
              params={{ id: t.id }}
              className="block rounded-xl border border-[var(--glass-border)] bg-[var(--surface)] p-6 transition-colors hover:bg-[var(--surface-elevated)]"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium">{t.title}</h3>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)] line-clamp-2">{t.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-sm font-semibold text-[var(--primary)]">Est. Budget</div>
                  <div className="text-lg font-medium tabular-nums">₹{t.estimated_budget.toLocaleString()}</div>
                  <div className="mt-2 inline-flex rounded bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-500">
                    {t.status}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
