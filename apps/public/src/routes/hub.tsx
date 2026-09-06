import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { ShieldAlert, Flame, Ambulance, Megaphone, MapPin } from "lucide-react";

export const Route = createFileRoute("/hub")({
  component: CityHubPage,
});

function CityHubPage() {
  const handleCall = (num: string) => {
    window.location.href = `tel:${num}`;
  };

  return (
    <div className="flex flex-col gap-6 pb-24 pt-4">
      <header className="px-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">City Hub</h1>
        <p className="mt-1 text-sm text-muted-foreground">Emergency contacts and civic announcements.</p>
      </header>

      <section className="px-4">
        <SectionLabel>Emergency Services</SectionLabel>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <GlassCard 
            className="flex flex-col items-center justify-center p-4 gap-2 cursor-pointer hover:bg-[var(--glass-strong)] transition-colors text-red-600"
            onClick={() => handleCall("100")}
          >
            <ShieldAlert className="w-8 h-8" />
            <span className="font-semibold">Police</span>
            <span className="text-xs text-muted-foreground">100</span>
          </GlassCard>
          <GlassCard 
            className="flex flex-col items-center justify-center p-4 gap-2 cursor-pointer hover:bg-[var(--glass-strong)] transition-colors text-orange-600"
            onClick={() => handleCall("101")}
          >
            <Flame className="w-8 h-8" />
            <span className="font-semibold">Fire</span>
            <span className="text-xs text-muted-foreground">101</span>
          </GlassCard>
          <GlassCard 
            className="flex flex-col items-center justify-center p-4 gap-2 cursor-pointer hover:bg-[var(--glass-strong)] transition-colors text-blue-600"
            onClick={() => handleCall("108")}
          >
            <Ambulance className="w-8 h-8" />
            <span className="font-semibold">Medical</span>
            <span className="text-xs text-muted-foreground">108</span>
          </GlassCard>
        </div>
      </section>

      <section className="px-4">
        <SectionLabel>Live Announcements</SectionLabel>
        <div className="flex flex-col gap-3 mt-4">
          <GlassCard className="p-4 flex gap-4 items-start border-l-4 border-l-orange-500">
            <Megaphone className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground">Water Supply Interruption</h3>
              <p className="text-sm text-muted-foreground mt-1">Scheduled maintenance in Ward 4 tomorrow from 10:00 AM to 4:00 PM. Please store sufficient water.</p>
              <span className="text-xs text-subtle mt-2 block">2 hours ago</span>
            </div>
          </GlassCard>
          
          <GlassCard className="p-4 flex gap-4 items-start border-l-4 border-l-blue-500">
            <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground">New Park Opening</h3>
              <p className="text-sm text-muted-foreground mt-1">The revitalized Heritage Park in Sector 12 is now open to the public.</p>
              <span className="text-xs text-subtle mt-2 block">1 day ago</span>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
