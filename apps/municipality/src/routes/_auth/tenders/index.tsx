import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Package, Plus, ArrowUpRight, FileText } from "lucide-react";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/states";
import { useMuniAuth } from "@/lib/muni-auth";
import { getWorkPackages } from "@/services/shared-store";
import type { WorkPackage } from "@/services/types";
import { cn } from "@/lib/utils";

import { useQuery } from "@tanstack/react-query";
import { listTenders } from "@/services/api";

export const Route = createFileRoute("/_auth/tenders/")({ 
  head: () => ({ meta: [{ title: "Tenders — JANMIND" }] }), 
  component: TendersPage 
});

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "text-[var(--muted-foreground)] bg-[var(--muted)]",
  OPEN: "text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_12%,transparent)]",
  CONTRACTOR_SELECTION: "text-[var(--primary)] bg-[color-mix(in_oklab,var(--primary)_12%,transparent)]",
  CONTRACTED: "text-[var(--primary)] bg-[color-mix(in_oklab,var(--primary)_12%,transparent)]",
  IN_EXECUTION: "text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_12%,transparent)]",
  COMPLETED: "text-[var(--success)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)]",
  CANCELLED: "text-[var(--critical)] bg-[color-mix(in_oklab,var(--critical)_12%,transparent)]",
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft", OPEN: "Open", CONTRACTOR_SELECTION: "Selecting Contractor",
  CONTRACTED: "Contracted", IN_EXECUTION: "In Execution", COMPLETED: "Completed", CANCELLED: "Cancelled",
};

const PRIORITY_COLORS: Record<string, string> = {
  Critical: "text-[var(--critical)]", High: "text-[var(--warning)]",
  Moderate: "text-[var(--muted-foreground)]", Low: "text-[var(--muted-foreground)]",
};

function TendersPage() {
  const { officer } = useMuniAuth();
  const city = officer?.city ?? "vadodara";

  const { data: tenders = [], isLoading: loading } = useQuery({
    queryKey: ["muni-tenders", city],
    queryFn: () => listTenders(city),
    enabled: !!city,
  });

  if (loading) return <LoadingState message="Loading tenders..." />;

  return (
    <div className="muni-page-enter space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <SectionLabel>Tenders</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            {tenders.length} tender{tenders.length !== 1 ? "s" : ""}
          </h1>
        </div>
        <Link
          to={"/tenders/new" as any}
          className="action-btn primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Publish Tender
        </Link>
      </header>

      <div className="grid gap-4">
        {tenders.length === 0 ? (
          <GlassCard elevation="raised" className="p-12 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground opacity-40" />
            <p className="mt-4 text-sm text-muted-foreground">No tenders published yet.</p>
          </GlassCard>
        ) : (
          tenders.map((wp: any) => (
            <Link key={wp.id} to={"/tenders/$id" as any} params={{ id: wp.id } as any}>
              <GlassCard elevation="raised" className="lift p-5 cursor-pointer">
                <div className="flex flex-wrap items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium bg-[var(--surface-elevated)] text-[var(--primary)]")}>
                        {wp.status}
                      </span>
                    </div>
                    <p className="mt-1.5 font-semibold">{wp.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{wp.description}</p>
                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span>{wp.department_id || wp.department}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="label-xs">{wp.id}</p>
                    <p className="mt-1 text-xs font-semibold tabular-nums">₹{wp.estimated_budget?.toLocaleString()}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{wp.published_at ? format(new Date(wp.published_at), "dd MMM yyyy") : ""}</p>
                    <ArrowUpRight className="mt-2 ml-auto h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
