import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/site-nav";
import { AuthGate } from "@/lib/require-auth";
import { SectionLabel } from "@/components/ui/glass-card";
import { ComplaintCard } from "@/components/complaint-card";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import { getMyComplaints } from "@/services/api";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/complaints")({
  head: () => ({
    meta: [
      { title: "My complaints — Civic Sathi" },
      {
        name: "description",
        content:
          "Track every civic complaint you submitted through Civic Sathi and its current status.",
      },
      { property: "og:title", content: "My complaints — Civic Sathi" },
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
    const { t } = useI18n();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["complaints"],
    queryFn: getMyComplaints,
  });

  return (
    <PageShell className="max-w-3xl">
      <div className="animate-rise space-y-2 p-6 rounded-[1.5rem] border border-[var(--glass-border)] bg-[var(--civic-paper)]/60 backdrop-blur-md shadow-sm mb-6 inline-block w-full">
        <SectionLabel>{t('ui.your_activity')}</SectionLabel>
        <h1 className="text-2xl font-semibold sm:text-3xl">{t('ui.my_complaints')}</h1>
        <p className="text-sm text-muted-foreground mt-2">
          {t('ui.every_report_you_submit_stays_')}</p>
      </div>

      <div className="mt-7">
        {isLoading && <LoadingState message={t("complaints.loading", "Loading your reports…")} />}
        {isError && (
          <ErrorState
            description={t("complaints.error", "We couldn't load your complaints right now.")}
            onRetry={() => void refetch()}
          />
        )}
        {data && data.length === 0 && (
          <EmptyState
            title={t('ui.no_reports_yet')}
            description={t("complaints.empty", "You haven't submitted any reports yet.")}
            actionLabel={t("nav.report", "Report a problem")}
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
