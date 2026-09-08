import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site-nav";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Vote, Users } from "lucide-react";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
});

function ProjectsPage() {
  const [votedProjects, setVotedProjects] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState("ALL");

  const projects = [
    { id: "p1", title: "Solar Streetlights in Sector 9", category: "INFRASTRUCTURE", budget: "?12.5 Lakhs", votes: 1240, total: 2000, desc: "Install 50 new solar-powered streetlights to improve safety and reduce carbon footprint." },
    { id: "p2", title: "Revitalize Central Lake Park", category: "ENVIRONMENT", budget: "?45.0 Lakhs", votes: 3420, total: 5000, desc: "Clean the lake, build a new jogging track, and plant 200 native trees." },
    { id: "p3", title: "Community Health Clinic Extension", category: "HEALTH", budget: "?30.0 Lakhs", votes: 850, total: 3000, desc: "Add a new pediatric wing to the existing community health clinic." },
    { id: "p4", title: "Smart Waste Bins Installation", category: "SANITATION", budget: "?8.5 Lakhs", votes: 2100, total: 2500, desc: "Deploy sensor-equipped smart bins to optimize waste collection routes." },
  ];

  const filtered = filter === "ALL" ? projects : projects.filter(p => p.category === filter);

  const handleVote = (id: string) => {
    setVotedProjects(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <PageShell className="max-w-5xl pb-24">
      <div className="animate-rise space-y-4 p-6 rounded-[1.5rem] border border-[var(--glass-border)] bg-[var(--civic-paper)]/60 backdrop-blur-md shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <SectionLabel>Participatory Budgeting</SectionLabel>
            <h1 className="text-2xl font-semibold sm:text-3xl text-foreground mt-1">Community Projects</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">
              Vote on local initiatives to decide how municipal funds are allocated. Your voice shapes the future of the city.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["ALL", "INFRASTRUCTURE", "ENVIRONMENT", "HEALTH", "SANITATION"].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border",
                  filter === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-[var(--surface)] text-muted-foreground border-[var(--glass-border)] hover:bg-[var(--surface-elevated)]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map(project => {
          const percentage = Math.round((project.votes / project.total) * 100);
          const isVoted = votedProjects[project.id];
          return (
            <GlassCard key={project.id} className="p-6 flex flex-col justify-between hover:border-primary/30 transition-colors group">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">{project.category}</span>
                    <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{project.title}</h3>
                  </div>
                  <span className="shrink-0 text-xs font-bold px-2 py-1 bg-green-500/10 text-green-700 dark:text-green-400 rounded-md border border-green-500/20">
                    {project.budget}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{project.desc}</p>
              </div>
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-bold uppercase text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {project.votes.toLocaleString()} Votes</span>
                    <span className="text-foreground">{percentage}% Funded</span>
                  </div>
                  <div className="h-2.5 w-full bg-[var(--surface-elevated)] rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
                <button
                  onClick={() => handleVote(project.id)}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all border shadow-sm",
                    isVoted
                      ? "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
                      : "bg-[var(--surface-elevated)] border-[var(--glass-border)] text-foreground hover:bg-[var(--glass-strong)] hover:border-primary/50"
                  )}
                >
                  <Vote className="w-4 h-4" />
                  {isVoted ? "Voted Successfully" : "Cast Your Vote"}
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </PageShell>
  );
}
