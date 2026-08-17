import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { Package, Plus, ArrowUpRight } from "lucide-react";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/states";
import { useMuniAuth } from "@/lib/muni-auth";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { listTenders } from "@/services/api";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_auth/tenders/")({
  head: () => ({ meta: [{ title: "Tenders — JANMIND" }] }),
  component: TendersPage,
});

// Matches backend TenderStatus enum: DRAFT | PUBLISHED | CLOSED | EVALUATING | AWARDED | CANCELLED
const STATUS_LABEL: Record<string, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Open",
  CLOSED: "Closed",
  EVALUATING: "Under Evaluation",
  AWARDED: "Awarded",
  CANCELLED: "Cancelled",
};

const STATUS_CHIP: Record<string, string> = {
  DRAFT: "text-[var(--muted-foreground)] bg-[var(--muted)]",
  PUBLISHED: "text-green-500 bg-[color-mix(in_oklab,#22c55e_12%,transparent)]",
  CLOSED: "text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_12%,transparent)]",
  EVALUATING: "text-[var(--primary)] bg-[color-mix(in_oklab,var(--primary)_12%,transparent)]",
  AWARDED: "text-[var(--success)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)]",
  CANCELLED: "text-[var(--critical)] bg-[color-mix(in_oklab,var(--critical)_12%,transparent)]",
};

function TendersPage() {
    const { t } = useI18n();
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
          <SectionLabel>{t('ui.tenders')}</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            {tenders.length} {t('ui.tender')}{tenders.length !== 1 ? "s" : ""}
          </h1>
        </div>
        <Link to={"/tenders/new" as any} className="action-btn primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {t('ui.publish_tender')}</Link>
      </header>

      <div className="grid gap-4">
        {tenders.length === 0 ? (
          <GlassCard elevation="raised" className="p-12 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground opacity-40" />
            <p className="mt-4 text-sm text-muted-foreground">{t('ui.no_tenders_published_yet')}</p>
          </GlassCard>
        ) : (
          (tenders as any[]).map((t) => (
            <Link key={t.id} to={"/tenders/$id" as any} params={{ id: t.id } as any}>
              <GlassCard elevation="raised" className="lift p-5 cursor-pointer">
                <div className="flex flex-wrap items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-medium",
                          STATUS_CHIP[t.status] ?? STATUS_CHIP["DRAFT"],
                        )}
                      >
                        {STATUS_LABEL[t.status] ?? t.status}
                      </span>
                    </div>

                    <p className="font-semibold">{t.title}</p>
                    {t.description && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {t.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                      {/* scope_of_work is the relevant details field */}
                      {t.scope_of_work && <span className="line-clamp-1">{t.scope_of_work}</span>}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-mono text-muted-foreground">{t.id}</p>
                    <p className="mt-1 text-sm font-semibold tabular-nums">
                      ₹{(t.estimated_budget ?? 0).toLocaleString("en-IN")}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t.published_at ? format(new Date(t.published_at), "dd MMM yyyy") : "Draft"}
                    </p>
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
