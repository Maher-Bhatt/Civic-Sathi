import { Suspense, lazy, useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { CITIES, clustersForCity, type CityId, type MapCluster } from "@/services/cities";
import type { CityMapProps } from "@/components/city-map";

const CityMap = lazy(() => import("@/components/city-map").then((m) => ({ default: m.CityMap })));

function MapSkeleton({ className }: { className?: string | undefined }) {
  return (
    <div
      className={cn(
        "glass relative flex items-center justify-center overflow-hidden rounded-2xl bg-[var(--background-secondary)]",
        className,
      )}
      role="status"
      aria-label="Loading map"
    >
      <span className="inline-flex items-center gap-2 text-xs tracking-[0.1em] text-subtle uppercase">
        <MapPin className="h-3.5 w-3.5 animate-pulse" aria-hidden />
        Loading map
      </span>
    </div>
  );
}

/** Browser-only wrapper: Leaflet is never imported during SSR. */
export function ClientCityMap(props: CityMapProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <MapSkeleton className={props.className} />;
  return (
    <Suspense fallback={<MapSkeleton className={props.className} />}>
      <CityMap {...props} />
    </Suspense>
  );
}

export function CitySelector({
  cityId,
  onChange,
  className,
}: {
  cityId: CityId;
  onChange: (id: CityId) => void;
  className?: string | undefined;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="label-xs shrink-0">City</span>
      <div
        role="radiogroup"
        aria-label="City"
        className="inline-flex items-center gap-0.5 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] p-0.5 backdrop-blur-md"
      >
        {CITIES.map((c) => (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={cityId === c.id}
            onClick={() => onChange(c.id)}
            className={cn(
              "press min-h-9 rounded-full px-3.5 text-[0.7rem] font-medium tracking-[0.06em] uppercase",
              cityId === c.id
                ? "bg-[var(--glass-strong)] text-foreground shadow-[var(--shadow-soft)]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Complete citizen map surface: city selector + real geographic map.
 * Extra clusters (e.g. the citizen's own report area) can be appended.
 */
export function CityMapPanel({
  className,
  mapClassName,
  extraClusters = [],
  initialCity = "vadodara",
  caption,
  onCityChange,
  ...mapProps
}: {
  className?: string | undefined;
  mapClassName?: string | undefined;
  extraClusters?: MapCluster[] | undefined;
  initialCity?: CityId | undefined;
  caption?: string | undefined;
  onCityChange?: ((id: CityId) => void) | undefined;
} & Omit<CityMapProps, "cityId" | "clusters" | "className">) {
  const [cityId, setCityId] = useState<CityId>(initialCity);
  const clusters = [...clustersForCity(cityId), ...extraClusters.filter((c) => c.city === cityId)];

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <CitySelector
          cityId={cityId}
          onChange={(id) => {
            setCityId(id);
            onCityChange?.(id);
          }}
        />
        {caption && (
          <span className="hidden truncate text-[0.68rem] tracking-[0.08em] text-subtle uppercase sm:inline">
            {caption}
          </span>
        )}
      </div>

      <ClientCityMap cityId={cityId} clusters={clusters} className={mapClassName} {...mapProps} />
    </div>
  );
}
