import { Suspense, lazy, useEffect, useState } from "react";
import { Radar } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CivicMapProps } from "@/components/civic-map";

const CivicMap = lazy(() =>
  import("@/components/civic-map").then((m) => ({ default: m.CivicMap })),
);

function MapSkeleton({ className }: { className?: string | undefined }) {
  return (
    <div
      className={cn(
        "glass relative flex items-center justify-center overflow-hidden rounded-2xl bg-[var(--background-secondary)]",
        className,
      )}
      role="status"
      aria-label="Loading civic map"
    >
      <div className="jm-map-scan absolute inset-0 opacity-40" aria-hidden />
      <span className="relative z-10 inline-flex items-center gap-2 text-xs tracking-[0.1em] text-subtle uppercase">
        <Radar className="h-4 w-4 animate-spin text-primary" aria-hidden />
        Initializing map
      </span>
    </div>
  );
}

/** Browser-only wrapper — Leaflet never loads during SSR. */
export function ClientCivicMap(props: CivicMapProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <MapSkeleton className={props.className} />;
  return (
    <Suspense fallback={<MapSkeleton className={props.className} />}>
      <CivicMap {...props} />
    </Suspense>
  );
}

export { MapSkeleton };
