import { Link } from "@tanstack/react-router";
import { CalendarDays, ChevronRight, MapPin } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusBadge } from "@/components/ui/badges";
import type { Complaint } from "@/services/types";

export function ComplaintCard({ complaint, index = 0 }: { complaint: Complaint; index?: number }) {
  const date = new Date(complaint.createdAt).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return (
    <GlassCard
      as="li"
      interactive
      className="animate-rise list-none p-0"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <Link
        to="/complaint/$id"
        params={{ id: complaint.id }}
        className="flex items-start gap-4 p-5 outline-none"
      >
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="label-xs">{complaint.id}</span>
            <StatusBadge status={complaint.status} />
          </div>
          <h3 className="text-[0.95rem] leading-snug font-semibold">{complaint.category}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">{complaint.description}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-subtle">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" aria-hidden />
              {complaint.location.ward}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden />
              {date}
            </span>
          </div>
        </div>
        <ChevronRight
          className="mt-1 h-4 w-4 shrink-0 text-subtle transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden
        />
      </Link>
    </GlassCard>
  );
}
