import { createFileRoute } from '@tanstack/react-router';
import { GlassCard, SectionLabel } from '@/components/ui/glass-card';
import { Building2, Star, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';

export const Route = createFileRoute('/_auth/contractors/')({
  component: MuniContractorsPage,
});

function MuniContractorsPage() {
  const { data: contractors = [], isLoading } = useQuery({
    queryKey: ['contractors-list'],
    queryFn: () => api.contractors.list(),
  });

  return (
    <div className="muni-page-enter space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <SectionLabel>Ecosystem</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Contractor Performance</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">Review vendor trust scores, ratings, and execution history.</p>
        </div>
      </header>

      {isLoading ? (
        <div className="p-8 text-center text-slate-400">Loading contractors...</div>
      ) : contractors.length === 0 ? (
        <div className="p-8 text-center text-slate-400">No contractors found.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {contractors.map((c: any) => (
            <GlassCard key={c.id} className="p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{c.company_name}</h3>
                    <p className="text-xs text-[var(--muted-foreground)] font-mono">{c.id}</p>
                  </div>
                </div>
                {c.ai_rating < 3.0 && (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-rose-500/10 text-rose-500 text-[10px] font-bold uppercase">
                    <AlertTriangle className="w-3 h-3" /> Risk
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-[var(--background)]/50 border border-[var(--border)]/50">
                <div className="text-center">
                  <p className="text-[10px] text-[var(--muted-foreground)] uppercase font-bold mb-1">Public Rating</p>
                  <div className="flex items-center justify-center gap-1 font-bold text-amber-500">
                    <Star className="w-3 h-3 fill-current" /> {c.public_rating?.toFixed(1) || 'N/A'}
                  </div>
                </div>
                <div className="text-center border-l border-[var(--border)]/50">
                  <p className="text-[10px] text-[var(--muted-foreground)] uppercase font-bold mb-1">AI Rating</p>
                  <div className="flex items-center justify-center gap-1 font-bold text-blue-500">
                    <Star className="w-3 h-3 fill-current" /> {c.ai_rating?.toFixed(1) || 'N/A'}
                  </div>
                </div>
                <div className="text-center border-l border-[var(--border)]/50">
                  <p className="text-[10px] text-[var(--muted-foreground)] uppercase font-bold mb-1">Officer Rating</p>
                  <div className="flex items-center justify-center gap-1 font-bold text-emerald-500">
                    <Star className="w-3 h-3 fill-current" /> {c.officer_rating?.toFixed(1) || 'N/A'}
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
