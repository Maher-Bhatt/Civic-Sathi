import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { ShieldAlert, Flame, Ambulance, Megaphone, MapPin, Wind, Droplets, Sun, Trophy, ArrowRight, Vote, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/site-nav";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/hub")({
  component: CityHubPage,
});

function CityHubPage() {
  const [votedProjects, setVotedProjects] = useState<Record<string, boolean>>({});

  const handleCall = (num: string) => {
    window.location.href = `tel:${num}`;
  };

  const handleVote = (id: string) => {
    setVotedProjects(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <PageShell className="max-w-4xl pb-24">
      <div className="animate-rise space-y-2 p-6 rounded-[1.5rem] border border-[var(--glass-border)] bg-[var(--civic-paper)]/60 backdrop-blur-md shadow-sm mb-6 inline-block w-full">
        <div className="flex items-center justify-between">
          <div>
            <SectionLabel>City Info</SectionLabel>
            <h1 className="text-2xl font-semibold sm:text-3xl text-foreground">City Hub</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Emergency contacts, live environment stats, and participatory budgeting.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-700 dark:text-green-400 rounded-xl border border-green-500/20">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-wide">CITY ONLINE</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        
        {/* Environmental Dashboard */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <SectionLabel>Live Environment Metrics</SectionLabel>
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Data
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <GlassCard className="p-4 flex flex-col items-center justify-center text-center gap-2">
              <Wind className="w-6 h-6 text-emerald-500" />
              <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground">42</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">AQI (Good)</p>
              </div>
            </GlassCard>
            <GlassCard className="p-4 flex flex-col items-center justify-center text-center gap-2">
              <Sun className="w-6 h-6 text-amber-500" />
              <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground">32°C</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Temperature</p>
              </div>
            </GlassCard>
            <GlassCard className="p-4 flex flex-col items-center justify-center text-center gap-2">
              <Droplets className="w-6 h-6 text-blue-500" />
              <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground">94%</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Water Supply</p>
              </div>
            </GlassCard>
            <GlassCard className="p-4 flex flex-col items-center justify-center text-center gap-2">
              <ShieldAlert className="w-6 h-6 text-orange-500" />
              <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Active Alerts</p>
              </div>
            </GlassCard>
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
              { id: "p1", title: "Solar Streetlights in Sector 9", budget: "₹12.5 Lakhs", votes: 1240, total: 2000, desc: "Install 50 new solar-powered streetlights to improve safety and reduce carbon footprint." },
              { id: "p2", title: "Revitalize Central Lake Park", budget: "₹45.0 Lakhs", votes: 3420, total: 5000, desc: "Clean the lake, build a new jogging track, and plant 200 native trees." }
            ].map((project) => {
              const percentage = Math.round((project.votes / project.total) * 100);
              const isVoted = votedProjects[project.id];
              return (
                <GlassCard key={project.id} className="p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-foreground leading-tight">{project.title}</h3>
                      <span className="shrink-0 text-xs font-bold px-2 py-1 bg-green-500/10 text-green-700 dark:text-green-400 rounded-md">
                        {project.budget}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{project.desc}</p>
                  </div>
                  <div className="mt-5 space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                        <span>{project.votes} Votes</span>
                        <span>{percentage}% Funded</span>
                      </div>
                      <div className="h-2 w-full bg-[var(--surface-elevated)] rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                    <button
                      onClick={() => handleVote(project.id)}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all border",
                        isVoted
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "bg-[var(--surface-elevated)] border-[var(--glass-border)] text-foreground hover:bg-[var(--glass-strong)]"
                      )}
                    >
                      <Vote className="w-4 h-4" />
                      {isVoted ? "Voted" : "Cast Your Vote"}
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </section>

        {/* Emergency Services */}
        <section>
          <SectionLabel>Emergency Services</SectionLabel>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <GlassCard 
              className="flex flex-col items-center justify-center p-4 gap-2 cursor-pointer hover:bg-[var(--glass-strong)] transition-colors text-red-600"
              onClick={() => handleCall("100")}
            >
              <ShieldAlert className="w-8 h-8" />
              <span className="font-semibold text-sm sm:text-base">Police</span>
              <span className="text-xs font-medium opacity-80">100</span>
            </GlassCard>
            <GlassCard 
              className="flex flex-col items-center justify-center p-4 gap-2 cursor-pointer hover:bg-[var(--glass-strong)] transition-colors text-orange-600"
              onClick={() => handleCall("101")}
            >
              <Flame className="w-8 h-8" />
              <span className="font-semibold text-sm sm:text-base">Fire</span>
              <span className="text-xs font-medium opacity-80">101</span>
            </GlassCard>
            <GlassCard 
              className="flex flex-col items-center justify-center p-4 gap-2 cursor-pointer hover:bg-[var(--glass-strong)] transition-colors text-blue-600"
              onClick={() => handleCall("108")}
            >
              <Ambulance className="w-8 h-8" />
              <span className="font-semibold text-sm sm:text-base">Medical</span>
              <span className="text-xs font-medium opacity-80">108</span>
            </GlassCard>
          </div>
        </section>

        {/* Civic Leaderboard & Announcements */}
        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <SectionLabel>Top Citizen Contributors</SectionLabel>
            <div className="flex flex-col gap-3 mt-4">
              {[
                { name: "Rahul S.", points: 4250, role: "Civic Champion" },
                { name: "Priya M.", points: 3820, role: "Community Lead" },
                { name: "Amit K.", points: 3100, role: "Active Citizen" }
              ].map((user, idx) => (
                <GlassCard key={idx} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">{user.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                    <Trophy className="w-4 h-4" />
                    <span className="font-bold text-sm">{user.points}</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </section>

          <section>
            <SectionLabel>Live Announcements</SectionLabel>
            <div className="flex flex-col gap-3 mt-4">
              <GlassCard className="p-4 flex gap-4 items-start border-l-4 border-l-orange-500">
                <Megaphone className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-sm sm:text-base text-foreground">Water Supply Interruption</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">Scheduled maintenance in Ward 4 tomorrow from 10:00 AM to 4:00 PM. Please store sufficient water.</p>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground mt-2 block">2 hours ago</span>
                </div>
              </GlassCard>
              
              <GlassCard className="p-4 flex gap-4 items-start border-l-4 border-l-blue-500">
                <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-sm sm:text-base text-foreground">New Park Opening</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">The revitalized Heritage Park in Sector 12 is now open to the public.</p>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground mt-2 block">1 day ago</span>
                </div>
              </GlassCard>
            </div>
          </section>
        </div>

      </div>
    </PageShell>
  );
}
