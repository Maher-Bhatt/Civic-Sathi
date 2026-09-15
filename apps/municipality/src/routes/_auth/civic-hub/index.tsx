import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { Network, ArrowRightLeft, ShieldCheck, Settings2, Key, Globe2, Activity, Megaphone, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useMuniAuth } from "@/lib/muni-auth";

export const Route = createFileRoute("/_auth/civic-hub/")({
  component: CivicHubControlPage,
});

function CivicHubControlPage() {
  const { officer } = useMuniAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("civic_hub_announcements");
      if (stored) setAnnouncements(JSON.parse(stored));
    } catch {}
  }, []);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return toast.error("Please fill all fields");
    
    const newAnn = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content,
      city: officer?.city || "Vadodara",
      date: new Date().toISOString(),
      author: officer?.name || "Municipal Officer"
    };

    const updated = [newAnn, ...announcements].slice(0, 5); // Keep last 5
    localStorage.setItem("civic_hub_announcements", JSON.stringify(updated));
    setAnnouncements(updated);
    setTitle("");
    setContent("");
    toast.success("Announcement published to public Civic Hub!");
  };

  return (
    <div className="muni-page-enter space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <SectionLabel>Integration & Interoperability</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Civic Hub Control</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Manage local city API integrations, endpoints, and public broadcasts.</p>
        </div>
        <button className="action-btn primary flex items-center gap-2">
          <Key className="w-4 h-4" /> Generate API Key
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 col-span-1 md:col-span-2 space-y-6">
           <div className="flex items-center justify-between mb-2">
             <div className="flex items-center gap-2">
               <Megaphone className="w-5 h-5 text-orange-500" />
               <h2 className="text-lg font-bold">Public Civic Hub Broadcast</h2>
             </div>
             <span className="text-[10px] uppercase font-bold px-2 py-1 bg-orange-500/10 text-orange-600 rounded">Live Update</span>
           </div>
           
           <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-[var(--muted-foreground)]">Announcement Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[var(--surface)] border border-[var(--glass-border)] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[var(--primary)]"
                  placeholder="e.g. Heavy Rain Alert for Vadodara"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-[var(--muted-foreground)]">Message Content</label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={3}
                  className="w-full bg-[var(--surface)] border border-[var(--glass-border)] rounded-lg p-2.5 text-sm focus:outline-none focus:border-[var(--primary)] resize-none"
                  placeholder="Provide detailed instructions or updates for citizens..."
                />
              </div>
              <button type="submit" className="action-btn primary w-full flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Publish Broadcast to Citizens
              </button>
           </form>

           {announcements.length > 0 && (
             <div className="pt-4 border-t border-[var(--glass-border)] space-y-3">
               <h3 className="text-xs font-bold uppercase text-[var(--muted-foreground)]">Recent Broadcasts</h3>
               {announcements.map(ann => (
                 <div key={ann.id} className="p-3 rounded-lg bg-[var(--surface-elevated)] border border-[var(--glass-border)]">
                   <div className="flex justify-between items-start">
                     <p className="font-semibold text-sm">{ann.title}</p>
                     <span className="text-[10px] text-[var(--muted-foreground)]">{new Date(ann.date).toLocaleDateString()}</span>
                   </div>
                   <p className="text-xs text-[var(--muted-foreground)] mt-1">{ann.content}</p>
                 </div>
               ))}
             </div>
           )}
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="p-6">
             <div className="flex items-center gap-2 mb-6">
               <Network className="w-5 h-5 text-[var(--primary)]" />
               <h2 className="text-lg font-bold">Local Integrations</h2>
             </div>
             
             <div className="space-y-4">
               {/* Sathi Setu */}
               <div className="p-3 rounded-xl border border-[var(--glass-border)] bg-[var(--surface-elevated)] flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                     <ArrowRightLeft className="w-4 h-4" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-sm text-[var(--foreground)]">Sathi Setu</h3>
                     <p className="text-[10px] text-[var(--muted-foreground)]">PWD & Water Board</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <span className="block text-[10px] font-bold text-emerald-500">Connected</span>
                 </div>
               </div>

               {/* Smart City Cameras */}
               <div className="p-3 rounded-xl border border-[var(--glass-border)] bg-[var(--surface-elevated)] flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                     <Globe2 className="w-4 h-4" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-sm text-[var(--foreground)]">Smart CCTV</h3>
                     <p className="text-[10px] text-[var(--muted-foreground)]">AI Triage Stream</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <span className="block text-[10px] font-bold text-emerald-500">Connected</span>
                 </div>
               </div>
             </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-sm font-bold uppercase text-[var(--muted-foreground)] tracking-wider mb-4">Traffic & Sync</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--muted-foreground)]">Incoming Webhooks</span>
                  <span className="font-bold">1,204 / hr</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--surface-elevated)] overflow-hidden">
                  <div className="h-full bg-blue-500 w-[60%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--muted-foreground)]">Outgoing API Calls</span>
                  <span className="font-bold">8,432 / hr</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--surface-elevated)] overflow-hidden">
                  <div className="h-full bg-[var(--primary)] w-[85%]"></div>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 bg-emerald-500/5 border-emerald-500/20">
            <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-bold">Data Compliance</h3>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              All local endpoints are currently compliant with DEPA guidelines. No unauthorized data sharing detected.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
