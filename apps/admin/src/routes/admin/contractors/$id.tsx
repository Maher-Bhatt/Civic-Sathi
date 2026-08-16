import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getContractor, verifyContractor, suspendContractor, getContractorDocuments } from "@/services/shared-store";
import type { Contractor } from "@/services/types";
import { useAdminAuth } from "@/lib/admin-auth";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/contractors/$id")({
  head: () => ({ meta: [{ title: "Contractor Details | Admin | JANMIND" }] }),
  component: ContractorDetail,
});

function ContractorDetail() {
  const { id } = Route.useParams();
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { admin } = useAdminAuth();
  const router = useRouter();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getContractor(id);
      if (data) {
        setContractor(data);
        const docs = await getContractorDocuments(id);
        setDocuments(docs);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleVerify = async () => {
    if (!admin || !contractor) return;
    try {
      await verifyContractor(contractor.id, admin.id, admin.name);
      toast.success("Contractor verified successfully");
      loadData();
    } catch (error) {
      toast.error("Failed to verify contractor");
    }
  };

  const handleSuspend = async () => {
    if (!admin || !contractor) return;
    const reason = prompt("Enter suspension reason:");
    if (!reason) return;
    try {
      await suspendContractor(contractor.id, admin.id, admin.name, reason);
      toast.error("Contractor suspended");
      loadData();
    } catch (error) {
      toast.error("Failed to suspend contractor");
    }
  };

  if (loading) return <LoadingState message="Loading contractor..." />;
  if (!contractor) return <ErrorState title="Not Found" description="Contractor not found" />;

  return (
    <div className="space-y-6 muni-page-enter pb-10">
      <div className="flex items-center gap-4">
        <button onClick={() => router.history.back()} className="p-2 glass rounded-md hover:bg-[var(--surface-elevated)] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{contractor.companyName}</h1>
          <p className="text-[var(--muted-foreground)]">Registration: {contractor.registrationNumber}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center bg-[var(--surface-elevated)] p-4 rounded-lg border border-[var(--glass-border)]">
        <div className="flex-1 min-w-[200px]">
          <p className="text-sm text-[var(--muted-foreground)]">Current Status</p>
          <div className="mt-1">
            <StatusBadge status={contractor.status} />
          </div>
        </div>
        
        <div className="flex gap-3">
          {contractor.status === 'PENDING_VERIFICATION' && (
            <button onClick={handleVerify} className="action-btn flex items-center gap-2 press bg-[var(--success)]/10 text-[var(--success)] hover:bg-[var(--success)]/20 border-transparent">
              <CheckCircle2 className="w-4 h-4" /> Verify Contractor
            </button>
          )}
          {contractor.status === 'VERIFIED' && (
            <button onClick={handleSuspend} className="action-btn flex items-center gap-2 press bg-[var(--critical)]/10 text-[var(--critical)] hover:bg-[var(--critical)]/20 border-transparent">
              <ShieldAlert className="w-4 h-4" /> Suspend Contractor
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6">
            <SectionLabel>Company Profile</SectionLabel>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div>
                <p className="label-xs mb-1">Company Name</p>
                <p className="font-medium">{contractor.companyName}</p>
              </div>
              <div>
                <p className="label-xs mb-1">Registration Number</p>
                <p className="font-medium">{contractor.registrationNumber}</p>
              </div>
              <div>
                <p className="label-xs mb-1">Tax ID / PAN</p>
                <p className="font-medium">{contractor.pan || contractor.gstin}</p>
              </div>
              <div>
                <p className="label-xs mb-1">Contractor Tier</p>
                <p className="font-medium">Class A</p>
              </div>
              <div className="sm:col-span-2">
                <p className="label-xs mb-2">Specializations</p>
                <div className="flex flex-wrap gap-2">
                  {contractor.specializationCategories.map((spec: string) => (
                    <span key={spec} className="px-3 py-1 rounded bg-[var(--background)] border border-[var(--glass-border)] text-sm">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <SectionLabel>Registration & Compliance</SectionLabel>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--glass-border)] text-left text-[var(--muted-foreground)]">
                    <th className="pb-3 px-4 font-medium">Document Type</th>
                    <th className="pb-3 px-4 font-medium">Status</th>
                    <th className="pb-3 px-4 font-medium">Uploaded Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--glass-border)]">
                  {documents.map((doc) => (
                    <tr key={doc.id} className="hover:bg-[var(--surface-elevated)]/50 transition-colors">
                      <td className="py-3 px-4">{doc.documentType || doc.documentName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded text-xs border border-[var(--glass-border)] bg-[var(--surface-elevated)]">
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[var(--muted-foreground)]">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {documents.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-[var(--muted-foreground)] italic">
                        No documents uploaded
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-6">
            <SectionLabel>System Security Logging</SectionLabel>
            <div className="mt-6 space-y-5">
              <MetricBar label="Overall Score" value={contractor.performanceScore || 0} max={100} />
              <div className="border-t border-[var(--glass-border)] pt-5 space-y-4">
                <MetricBar label="Inspection Pass Rate" value={contractor.inspectionPassRate || 0} max={100} />
                <MetricBar label="On-Time Completion" value={contractor.onTimeCompletionRate || 0} max={100} />
                <MetricBar label="SLA Compliance" value={contractor.slaScore || 0} max={100} />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function MetricBar({ label, value, max, isDecimal = false }: { label: string, value: number, max: number, isDecimal?: boolean }) {
  const percentage = (value / max) * 100;
  const displayValue = isDecimal ? value.toFixed(1) : Math.round(value).toString();
  
  return (
    <div>
      <div className="flex justify-between items-end mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-[var(--muted-foreground)]">{displayValue}{isDecimal ? `/${max}` : '%'}</span>
      </div>
      <div className="h-2 bg-[var(--background)] rounded-full overflow-hidden border border-[var(--glass-border)]">
        <div 
          className="h-full bg-[var(--foreground)] transition-all duration-500" 
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }} 
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'VERIFIED') {
    return (
      <span className="px-2.5 py-1 rounded text-sm font-medium bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20 inline-flex items-center gap-1.5">
        <CheckCircle2 className="w-4 h-4" /> Verified
      </span>
    );
  }
  if (status === 'PENDING_VERIFICATION') {
    return (
      <span className="px-2.5 py-1 rounded text-sm font-medium bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/20 inline-flex items-center gap-1.5">
        Pending Verification
      </span>
    );
  }
  if (status === 'SUSPENDED') {
    return (
      <span className="px-2.5 py-1 rounded text-sm font-medium bg-[var(--critical)]/10 text-[var(--critical)] border border-[var(--critical)]/20 inline-flex items-center gap-1.5">
        <ShieldAlert className="w-4 h-4" /> Suspended
      </span>
    );
  }
  return <span>{status}</span>;
}
