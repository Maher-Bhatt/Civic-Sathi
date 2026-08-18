import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSLARules, updateSLARule } from "@/services/shared-store";
import type { SLARule } from "@/services/types";
import { useAdminAuth } from "@/lib/admin-auth";
import { GlassCard } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/states";
import { Timer, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/sla")({
  head: () => ({ meta: [{ title: "SLA Configuration | Admin | CivicSathi" }] }),
  component: SLAConfig,
});

function SLAConfig() {
    const { t } = useI18n();
  const [rules, setRules] = useState<SLARule[]>([]);
  const [loading, setLoading] = useState(true);
  const { admin } = useAdminAuth();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getSLARules();
      setRules(data);
    } catch (error) {
      toast.error("Failed to load SLA rules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdate = async (ruleId: string, field: keyof SLARule, value: any) => {
    if (!admin) return;
    try {
      await updateSLARule(ruleId, { [field]: value }, admin.id, admin.name);
      toast.success("SLA Rule updated");
      loadData();
    } catch (error) {
      toast.error("Failed to update rule");
    }
  };

  if (loading) return <LoadingState message="Loading SLA rules..." />;

  // Group rules by category
  const groupedRules = rules.reduce<Record<string, SLARule[]>>((acc, rule) => {
    if (!acc[rule.category]) acc[rule.category] = [];
    acc[rule.category]!.push(rule);
    return acc;
  }, {});

  return (
    <div className="space-y-8 muni-page-enter">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('ui.sla_configuration')}</h1>
        <p className="text-[var(--muted-foreground)]">{t('ui.define_response_and_resolution')}</p>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedRules).map(([category, categoryRules]) => (
          <GlassCard key={category} className="p-0 overflow-hidden">
            <div className="bg-[var(--surface-elevated)] p-4 border-b border-[var(--glass-border)] flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--background)] border border-[var(--glass-border)] flex items-center justify-center">
                <Timer className="w-4 h-4 text-[var(--foreground)]" />
              </div>
              <h2 className="text-lg font-semibold">{category}</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--glass-border)] text-left text-[var(--muted-foreground)] bg-[var(--background)]/50">
                    <th className="py-3 px-4 font-medium">{t('ui.severity')}</th>
                    <th className="py-3 px-4 font-medium">{t('ui.response_hrs')}</th>
                    <th className="py-3 px-4 font-medium">{t('ui.resolution_hrs')}</th>
                    <th className="py-3 px-4 font-medium">{t('ui.escalation_hrs')}</th>
                    <th className="py-3 px-4 font-medium">{t('ui.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--glass-border)]">
                  {(categoryRules as SLARule[]).map((rule) => (
                    <tr key={rule.id} className="hover:bg-[var(--surface-elevated)]/30 transition-colors">
                      <td className="py-3 px-4">
                        <SeverityBadge severity={rule.severity} />
                      </td>
                      <td className="py-3 px-4">
                        <EditableNumber 
                          value={rule.responseHours} 
                          onSave={(val) => handleUpdate(rule.id, 'responseHours', val)} 
                        />
                      </td>
                      <td className="py-3 px-4">
                        <EditableNumber 
                          value={rule.resolutionHours} 
                          onSave={(val) => handleUpdate(rule.id, 'resolutionHours', val)} 
                        />
                      </td>
                      <td className="py-3 px-4">
                        <EditableNumber 
                          value={rule.escalationHours} 
                          onSave={(val) => handleUpdate(rule.id, 'escalationHours', val)} 
                        />
                      </td>
                      <td className="py-3 px-4">
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input 
                              type="checkbox" 
                              className="sr-only" 
                              checked={rule.active}
                              onChange={(e) => handleUpdate(rule.id, 'active', e.target.checked)}
                            />
                            <div className={`block w-10 h-6 rounded-full transition-colors ${rule.active ? 'bg-[var(--foreground)]' : 'bg-[var(--surface-elevated)] border border-[var(--glass-border)]'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-[var(--background)] w-4 h-4 rounded-full transition-transform ${rule.active ? 'transform translate-x-4' : ''}`}></div>
                          </div>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

function EditableNumber({ value, onSave }: { value: number, onSave: (val: number) => void }) {
    const { t } = useI18n();
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value.toString());

  const handleBlur = () => {
    setIsEditing(false);
    const num = parseInt(tempValue, 10);
    if (!isNaN(num) && num !== value) {
      onSave(num);
    } else {
      setTempValue(value.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleBlur();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setTempValue(value.toString());
    }
  };

  if (isEditing) {
    return (
      <input
        type="number"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="ambient-field w-20 py-1 px-2 text-sm"
        autoFocus
        min="1"
      />
    );
  }

  return (
    <div 
      className="flex items-center gap-2 group cursor-pointer hover:text-[var(--foreground)]"
      onClick={() => setIsEditing(true)}
    >
      <span className="font-medium font-mono">{value}</span>
      <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--muted-foreground)]" />
    </div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
    const { t } = useI18n();
  let colors = "bg-[var(--surface-elevated)] border-[var(--glass-border)] text-[var(--foreground)]";
  if (severity === 'CRITICAL') colors = "bg-[var(--critical)]/10 border-[var(--critical)]/20 text-[var(--critical)]";
  if (severity === 'HIGH') colors = "bg-[var(--warning)]/10 border-[var(--warning)]/20 text-[var(--warning)]";
  if (severity === 'MODERATE') colors = "bg-[var(--surface-elevated)] border-[var(--glass-border)] text-[var(--foreground)]";
  if (severity === 'LOW') colors = "bg-[var(--background)] border-[var(--glass-border)] text-[var(--muted-foreground)]";

  return (
    <span className={`px-2.5 py-1 rounded text-xs font-medium border ${colors}`}>
      {severity}
    </span>
  );
}
