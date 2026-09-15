import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { ShieldAlert, Flame, Ambulance, Megaphone, MapPin, Wind, Droplets, Sun, Trophy, ArrowRight, Vote, CheckCircle2, Loader2, CloudRain } from "lucide-react";
import { PageShell } from "@/components/site-nav";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getCityEnvironment, type CityEnvironment } from "@/services/api";

const CITIES = [
  { id: "vadodara", name: "Vadodara" },
  { id: "mumbai", name: "Mumbai" },
  { id: "bengaluru", name: "Bengaluru" },
  { id: "delhi", name: "Delhi" },
] as const;

export const Route = createFileRoute("/hub")({
  component: CityHubPage,
});

function CityHubPage() {
  const [votedProjects, setVotedProjects] = useState<Record<string, boolean>>({});
  const [selectedCity, setSelectedCity] = useState("vadodara");
  const [envData, setEnvData] = useState<CityEnvironment | null>(null);
  const [envLoading, setEnvLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    let active = true;
    setEnvLoading(true);
    getCityEnvironment(selectedCity)
      .then((data) => { if (active) setEnvData(data); })
      .catch(() => { if (active) setEnvData(null); })
      .finally(() => { if (active) setEnvLoading(false); });
    
    // Poll for localStorage broadcasts from Municipality portal
    const fetchAnn = () => {
      try {
        const stored = localStorage.getItem("civic_hub_announcements");
        if (stored) {
          const parsed = JSON.parse(stored);
          setAnnouncements(parsed.filter((a: any) => a.city.toLowerCase() === selectedCity.toLowerCase()));
        }
      } catch {}
    };
    fetchAnn();
    const iv = setInterval(fetchAnn, 3000);
    return () => { active = false; clearInterval(iv); };
  }, [selectedCity]);

  const handleCall = (num: string) => {
    window.location.href = `tel:${num}`;
  };

  const handleVote = (id: string) => {
    setVotedProjects(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <PageShell className="max-w-4xl pb-24">
      <div className="animate-rise space-y-2 p-6 rounded-[1.5rem] border border-[var(--glass-border)] bg-[var(--civic-paper)]/60 backdrop-blur-md shadow-sm mb-6 inline-block w-full">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--primary)]/10 text-[var(--primary)] rounded-2xl">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <SectionLabel>City Hub</SectionLabel>
              <h1 className="text-2xl font-semibold sm:text-3xl text-foreground">Community Center</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Live environment stats, municipal broadcasts, and participatory budgeting.
              </p>
            </div>
          </div>
          
          <select 
            className="p-3 bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-xl font-bold shadow-sm focus:outline-none focus:border-[var(--primary)]"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-10">

          {/* Municipal Broadcasts */}
          {announcements.length > 0 && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2 mb-4">
                <Megaphone className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-bold">Official Broadcasts</h2>
              </div>
              <div className="space-y-4">
                {announcements.map((ann, i) => (
                  <GlassCard key={i} className="p-5 border-orange-500/20 bg-orange-500/5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-foreground">{ann.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{ann.content}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="text-[10px] uppercase font-bold text-orange-600 bg-orange-500/20 px-2 py-1 rounded">Live Alert</span>
                        <span className="text-[10px] text-muted-foreground">{new Date(ann.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </section>
          )}

          {/* Environmental Dashboard */}
          <section>
            <div className="flex items-center justify-between mb-4 px-4 py-2 rounded-xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-700/50">
              <SectionLabel className="!text-zinc-800 dark:!text-zinc-100 font-bold">Live Environment Metrics</SectionLabel>
              <span className="text-xs text-zinc-700 dark:text-zinc-200 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                {envLoading ? "Loading..." : "Live Data"}
              </span>
            </div>
            
            {envLoading ? (
              <GlassCard className="p-12 flex flex-col items-center justify-center text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p>Connecting to weather satellites for {CITIES.find(c => c.id === selectedCity)?.name}...</p>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <GlassCard className="p-4 flex flex-col items-center justify-center text-center gap-2">
                  <Wind className="w-6 h-6 text-emerald-500" />
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-foreground">{envData?.air_quality.aqi ?? "--"}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">AQI ({envData?.air_quality.status ?? "--"})</p>
                  </div>
                </GlassCard>
                <GlassCard className="p-4 flex flex-col items-center justify-center text-center gap-2">
                  <Sun className="w-6 h-6 text-amber-500" />
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-foreground">{envData?.weather.temperature_c != null ? `${Math.round(envData.weather.temperature_c)}°C` : "--"}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">{envData?.weather.condition ?? "Temperature"}</p>
                  </div>
                </GlassCard>
                <GlassCard className="p-4 flex flex-col items-center justify-center text-center gap-2">
                  <Droplets className="w-6 h-6 text-blue-500" />
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-foreground">{envData?.weather.humidity_percent != null ? `${Math.round(envData.weather.humidity_percent)}%` : "--"}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Humidity</p>
                  </div>
                </GlassCard>
                <GlassCard className="p-4 flex flex-col items-center justify-center text-center gap-2">
                  <CloudRain className="w-6 h-6 text-teal-500" />
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-foreground">{envData?.weather.wind_speed_kmh != null ? `${Math.round(envData.weather.wind_speed_kmh)}` : "--"}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Wind (km/h)</p>
                  </div>
                </GlassCard>
              </div>
            )}
            {envData?.last_updated && !envLoading && (
              <p className="text-[10px] text-muted-foreground mt-2 text-right">
                Last updated: {new Date(envData.last_updated).toLocaleTimeString()} | Source: Open-Meteo
              </p>
            )}
          </section>

          {/* Emergency Contacts */}
          <section>
            <SectionLabel className="mb-4">Emergency Contacts</SectionLabel>
            <div className="grid sm:grid-cols-3 gap-4">
              <button 
                onClick={() => handleCall('112')}
                className="p-4 rounded-2xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors flex items-center gap-4 text-left"
              >
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-600">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-red-600">112</h3>
                  <p className="text-xs text-red-600/70 font-semibold">National Emergency</p>
                </div>
              </button>
              <button 
                onClick={() => handleCall('101')}
                className="p-4 rounded-2xl border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 transition-colors flex items-center gap-4 text-left"
              >
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-600">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-orange-600">101</h3>
                  <p className="text-xs text-orange-600/70 font-semibold">Fire Brigade</p>
                </div>
              </button>
              <button 
                onClick={() => handleCall('108')}
                className="p-4 rounded-2xl border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-colors flex items-center gap-4 text-left"
              >
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600">
                  <Ambulance className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-600">108</h3>
                  <p className="text-xs text-blue-600/70 font-semibold">Ambulance</p>
                </div>
              </button>
            </div>
          </section>

          {/* Participatory Budgeting */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <SectionLabel>Participatory Budgeting</SectionLabel>
              <Link to="/projects" className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { id: "p1", title: "Solar Streetlights in Sector 9", budget: "₹112.5 Lakhs", votes: 1240, total: 2000, desc: "Install 50 new solar-powered streetlights to improve safety and reduce carbon footprint." },
                { id: "p2", title: "Lake Rejuvenation Project", budget: "₹345.0 Lakhs", votes: 890, total: 1000, desc: "Clean and restore the local lake, adding walking paths and seating areas for citizens." }
              ].map(project => {
                const isVoted = votedProjects[project.id];
                const pct = (project.votes / project.total) * 100;
                
                return (
                  <GlassCard key={project.id} className="p-5 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-[var(--foreground)]">{project.title}</h3>
                      <span className="text-xs font-bold px-2 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded">{project.budget}</span>
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)] mb-6 flex-grow">{project.desc}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-[var(--primary)]">{project.votes} Votes</span>
                          <span className="text-[var(--muted-foreground)]">Goal: {project.total}</span>
                        </div>
                        <div className="h-2 w-full bg-[var(--surface-elevated)] rounded-full overflow-hidden">
                          <div className="h-full bg-[var(--primary)] rounded-full transition-all duration-1000" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleVote(project.id)}
                        className={cn(
                          "w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
                          isVoted 
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" 
                            : "bg-[var(--primary)] text-white hover:opacity-90 shadow-sm"
                        )}
                      >
                        {isVoted ? (
                          <><CheckCircle2 className="w-4 h-4" /> Voted</>
                        ) : (
                          <><Vote className="w-4 h-4" /> Vote for this project</>
                        )}
                      </button>
                    </div>
                  </GlassCard>
                )
              })}
            </div>
          </section>

        </div>
      </div>
    </PageShell>
  );
}
