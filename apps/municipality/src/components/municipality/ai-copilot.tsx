import { useEffect, useState } from "react";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { useI18n } from "@/lib/i18n";
import { getDashboardKPIs, getHotspotRankings } from "@/services/api";
import { useMuniAuth } from "@/lib/muni-auth";

export function AiCopilotWidget() {
    const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hello! I am your Civic Sathi AI Copilot. I can help you analyze project risks, review contractor performance, or summarize systemic issues. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [snapshot, setSnapshot] = useState<{ total: number; active: number; critical: number; resolved: number; issues: Array<{ title?: string; category?: string; area?: string; reports?: number; risk?: number; risk_score?: number; complaint_count?: number }> } | null>(null);
  const [loadingSnapshot, setLoadingSnapshot] = useState(false);
  const { officer } = useMuniAuth();

  useEffect(() => {
    if (!isOpen || snapshot || loadingSnapshot) return;
    setLoadingSnapshot(true);
    Promise.all([getDashboardKPIs(), getHotspotRankings()])
      .then(([kpis, issues]) => setSnapshot({ total: kpis.totalReports, active: kpis.active, critical: kpis.critical, resolved: kpis.resolved, issues: issues.slice(0, 5) as any[] }))
      .finally(() => setLoadingSnapshot(false));
  }, [isOpen, snapshot, loadingSnapshot, officer?.city]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: input }]);
    const currentInput = input;
    setInput("");
    
    const query = currentInput.toLowerCase();
    const response = loadingSnapshot
      ? "I am loading the live city snapshot. Please ask again in a moment."
      : !snapshot
        ? "The live city snapshot is unavailable. I will not invent a priority or risk estimate; please refresh and try again."
        : query.includes("priority") || query.includes("priorit")
          ? snapshot.issues.length > 0
            ? `Evidence-based priority list for ${officer?.city ?? "this city"}: ${snapshot.issues.map((issue, index) => `${index + 1}. ${issue.title ?? issue.category ?? "Civic hotspot"} near ${issue.area ?? "an unassigned area"} (${Number(issue.reports ?? issue.complaint_count ?? 0).toLocaleString("en-IN")} reports; risk ${Number(issue.risk ?? issue.risk_score ?? 0)})`).join("; ")} Review the linked issue records before dispatching work.`
            : "No authoritative hotspot aggregates are available for this city yet. Review the complaint queue before assigning priority."
          : query.includes("risk") || query.includes("critical")
            ? `Current ${officer?.city ?? "city"} snapshot: ${snapshot.critical.toLocaleString("en-IN")} critical reports, ${snapshot.active.toLocaleString("en-IN")} active reports, ${snapshot.resolved.toLocaleString("en-IN")} resolved, and ${snapshot.total.toLocaleString("en-IN")} total. These are backend counts; a human officer should confirm the operational response.`
            : `I can summarize the live ${officer?.city ?? "city"} snapshot, create a priority list, or explain risk counts. Current totals are ${snapshot.total.toLocaleString("en-IN")} reports and ${snapshot.active.toLocaleString("en-IN")} active. Ask about priority or risk for evidence-based guidance.`;
    setMessages(prev => [...prev, { role: "ai", text: response }]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <Sparkles className="h-6 w-6" />
      </button>
    );
  }

  return (
    <GlassCard className="fixed bottom-6 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--glass-border)] bg-[var(--primary)] p-4 text-white">
        <div className="flex items-center gap-2 font-medium">
          <Sparkles className="h-5 w-5" />
          <span>{t('ui.civicsathi_copilot')}</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="rounded-full p-1 hover:bg-white/20 transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--surface)]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.role === "user" ? "bg-[var(--primary)] text-white" : "bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-[var(--foreground)]"}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-[var(--glass-border)] bg-[var(--surface-elevated)] p-3">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('ui.ask_copilot')}
            className="flex-1 rounded-full border border-[var(--glass-border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-white disabled:opacity-50 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </GlassCard>
  );
}
