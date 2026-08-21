import { createFileRoute, Link } from "@tanstack/react-router";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { PageShell } from "@/components/site-nav";
import { AuthGate } from "@/lib/require-auth";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { SeverityBadge, StatusBadge } from "@/components/ui/badges";
import { ComplaintTimeline } from "@/components/complaint-timeline";
import { ErrorState, LoadingState } from "@/components/ui/states";
import { ClientCityMap } from "@/components/city-map-panel";
import { getComplaint } from "@/services/api";

import { clustersForCity, nearestCity } from "@/services/cities";

import { useI18n } from "@/lib/i18n";



export const Route = createFileRoute("/complaint/$id")({
  head: () => ({
    meta: [
      { title: "Complaint details — Civic Sathi" },
      {
        name: "description",
        content:
          "Full detail of a civic complaint: category, severity, location, evidence and resolution timeline.",
      },
      { property: "og:title", content: "Complaint details — Civic Sathi" },
      {
        property: "og:description",
        content: "Follow a civic complaint from submission to resolution.",
      },
    ],
  }),
  component: () => (
    <AuthGate redirectTo="/complaints">
      <ComplaintDetail />
    </AuthGate>
  ),
});

function ComplaintDetail() {
    const { t } = useI18n();
  const { id } = Route.useParams();
    const { data, isLoading, isError, error, refetch } = useQuery({

    queryKey: ["complaint", id],
    queryFn: () => getComplaint(id),
  });

  

  const isNotFound = (error as any)?.status === 404;
  const location = data?.location ?? { lat: 22.3072, lng: 73.1812, ward: "Ward 14", area: "Vadodara" };
  const city = data ? nearestCity(location.lat, location.lng) : null;
  const mapCityId = city?.id ?? "vadodara";

  return (
    <PageShell className="max-w-3xl">
      <Link
        to="/complaints"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t('ui.my_complaints')}</Link>

      <div className="mt-5">
        {isLoading && <LoadingState message="Loading complaint..." />}
        {isError && (
          <ErrorState
                        description={isNotFound ? "This complaint is no longer available to your account." : "We couldn't load this complaint. Please retry once the civic data service is available."}

            onRetry={() => void refetch()}
          />
        )}

        {data && (
          <div className="space-y-5">
            <div className="animate-rise flex flex-wrap items-center gap-3">
              <SectionLabel className="tabular-nums">{data.id}</SectionLabel>
              <StatusBadge status={data.status} />
              <SeverityBadge severity={data.severity} />
            </div>

            <GlassCard elevation="raised" className="animate-rise space-y-6 p-5 sm:p-7">
              <h1 className="text-xl font-semibold sm:text-2xl">{data.category}</h1>
              <p className="text-[0.98rem] leading-relaxed text-muted-foreground">
                {data.description}
              </p>
              {data.photo && (
                <img
                  src={data.photo}
                  alt="Evidence submitted with this complaint"
                  loading="lazy"
                  className="h-56 w-full rounded-xl object-cover sm:h-72"
                />
              )}
              <dl className="grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="label-xs">{t('ui.location')}</dt>
                  <dd className="mt-1.5 text-sm font-medium">{location.area}</dd>
                </div>
                <div>
                  <dt className="label-xs">{t('ui.submitted')}</dt>
                  <dd className="mt-1.5 text-sm font-medium">
                    {new Date(data.createdAt).toLocaleString(undefined, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="label-xs">{t('ui.related_reports')}</dt>
                  <dd className="mt-1.5 text-sm font-medium tabular-nums text-primary">
                    {data.relatedCount}
                  </dd>
                </div>
              </dl>
            </GlassCard>

            

            <GlassCard className="animate-rise overflow-hidden p-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 px-2.5 pt-2 pb-3">
                <SectionLabel>{t('ui.nearby_civic_activity')}</SectionLabel>
                <span className="text-xs text-muted-foreground">
                  {data.nearbyCount} {t('ui.similar_reports_within_500m')}</span>
              </div>
              <ClientCityMap
                cityId={mapCityId}
                clusters={clustersForCity(mapCityId)}
                className="h-[260px] sm:h-[320px]"
                focus={{ lat: location.lat, lng: location.lng, zoom: 14 }}
                ariaLabel={`Map of civic activity near ${location.ward}`}
                showLegend={false}
              />
              <div className="px-2.5 py-4">
                {data.matchingState === "pending" ? (
                  <p className="text-sm text-muted-foreground">Civic Sathi is still matching this report with nearby complaints.</p>
                ) : data.relatedComplaints.length > 0 ? (
                  <ul className="space-y-2">
                    {data.relatedComplaints.map((related) => (
                      <li key={related.id} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-critical opacity-70" />
                        <span>
                          <span className="font-medium text-foreground">{related.public_id || related.id}</span>{" "}
                          {related.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No other complaint is currently in this canonical problem group.</p>
                )}
              </div>
            </GlassCard>

            <GlassCard elevation="raised" className="animate-rise p-5 sm:p-7">
              <SectionLabel className="mb-5">{t('ui.timeline')}</SectionLabel>
              <ComplaintTimeline events={data.timeline} />
            </GlassCard>
          </div>
        )}
      </div>
    </PageShell>
  );
}

