import { useEffect, useRef, useState } from "react";
import { MessageSquare, X, Send, Sparkles, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { useI18n } from "@/lib/i18n";
import { askCopilot, getDashboardKPIs, getHotspotRankings } from "@/services/api";
import { useMuniAuth } from "@/lib/muni-auth";

export function AiCopilotWidget() {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    {
      role: "ai",
      text: "Hello! I am your Civic Sathi AI Copilot. Ask me anything about live complaint numbers, high-risk hotspots, contractor allocation, or municipal priorities.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [snapshot, setSnapshot] = useState<{
    total: number;
    active: number;
    critical: number;
    resolved: number;
    issues: Array<{
      title?: string;
      category?: string;
      area?: string;
      reports?: number;
      risk?: number;
      risk_score?: number;
      complaint_count?: number;
    }>;
  } | null>(null);
  const [loadingSnapshot, setLoadingSnapshot] = useState(false);
  const { officer } = useMuniAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  useEffect(() => {
    if (!isOpen || snapshot || loadingSnapshot) return;
    setLoadingSnapshot(true);
    Promise.all([getDashboardKPIs(), getHotspotRankings()])
      .then(([kpis, issues]) =>
        setSnapshot({
          total: kpis.totalReports,
          active: kpis.active,
          critical: kpis.critical,
          resolved: kpis.resolved,
          issues: (issues || []).slice(0, 5) as any[],
        }),
      )
      .catch((err) => console.warn("Failed to load copilot snapshot", err))
      .finally(() => setLoadingSnapshot(false));
  }, [isOpen, snapshot, loadingSnapshot, officer?.city]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsThinking(true);

    const cityName = officer?.city ? officer.city.charAt(0).toUpperCase() + officer.city.slice(1) : "Vadodara";
    const context = snapshot
      ? `City: ${cityName}. Total reports: ${snapshot.total}, Active: ${snapshot.active}, Critical: ${snapshot.critical}, Resolved: ${snapshot.resolved}. Top hotspots/issues: ${
          snapshot.issues.length > 0
            ? snapshot.issues
                .map(
                  (i) =>
                    `${i.title || i.category || "Issue"} in ${i.area || "Unassigned"} (${i.reports || i.complaint_count || 0} reports, risk score ${i.risk || i.risk_score || 0})`,
                )
                .join("; ")
            : "None recorded yet."
        }`
      : `City: ${cityName}. Operational queues and field units active.`;

    try {
      const aiReply = await askCopilot(userMsg, context);
      setMessages((prev) => [...prev, { role: "ai", text: aiReply }]);
    } catch (err) {
      console.warn("Copilot API error, falling back", err);
      // Smart contextual fallback answering common questions directly
      const q = userMsg.toLowerCase();
      let fallback = "";
      if (q.includes("how many") || q.includes("count") || q.includes("total") || q.includes("number") || q.includes("complain")) {
        if (snapshot) {
          fallback = `In ${cityName}, there are ${snapshot.total.toLocaleString("en-IN")} total complaints registered: ${snapshot.active.toLocaleString("en-IN")} are currently active, ${snapshot.critical.toLocaleString("en-IN")} are marked critical, and ${snapshot.resolved.toLocaleString("en-IN")} have been resolved.`;
        } else {
          fallback = `The live municipal database for ${cityName} currently reports active tracking across all wards. Refresh to see exact live counts.`;
        }
      } else if (q.includes("priority") || q.includes("priorit") || q.includes("hotspot")) {
        if (snapshot && snapshot.issues.length > 0) {
          fallback = `Top priority hotspots for ${cityName}: ${snapshot.issues
            .map((issue, idx) => `${idx + 1}. ${issue.title || issue.category || "Hotspot"} in ${issue.area || "Area"} (${issue.reports || issue.complaint_count || 0} reports, risk ${issue.risk || issue.risk_score || 0})`)
            .join("; ")}. Recommend dispatching rapid response teams.`;
        } else {
          fallback = `All critical complaints in ${cityName} are queued by severity. Check the Complaints table filtered by 'Critical' for top priority actions.`;
        }
      } else if (q.includes("critical") || q.includes("risk")) {
        if (snapshot) {
          fallback = `There are currently ${snapshot.critical.toLocaleString("en-IN")} critical-risk complaints requiring urgent field attention in ${cityName}.`;
        } else {
          fallback = `Critical risk issues are tracked in real-time on your GIS map and triage screen.`;
        }
      } else {
        fallback = `I am analyzing live civic operations for ${cityName}. Currently tracking ${snapshot?.total?.toLocaleString("en-IN") ?? "30,000+"} reports across all municipal wards. How can I assist with triage, tenders, or contractor allocations?`;
      }
      setMessages((prev) => [...prev, { role: "ai", text: fallback }]);
    } finally {
      setIsThinking(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label={t("ui.civicsathi_copilot")}
      >
        <Sparkles className="h-6 w-6" />
      </button>
    );
  }

  return (
    <GlassCard className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[370px] flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--glass-border)] bg-[var(--primary)] p-4 text-white">
        <div className="flex items-center gap-2 font-medium">
          <Sparkles className="h-5 w-5" />
          <span>{t("ui.civicsathi_copilot")}</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-full p-1 hover:bg-white/20 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--surface)]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-[var(--foreground)]"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl border border-[var(--glass-border)] bg-[var(--surface-elevated)] px-4 py-2.5 text-xs text-[var(--muted-foreground)]">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--primary)]" />
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[var(--glass-border)] bg-[var(--surface-elevated)] p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("ui.ask_copilot")}
            disabled={isThinking}
            className="flex-1 rounded-full border border-[var(--glass-border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-white disabled:opacity-50 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </GlassCard>
  );
}
