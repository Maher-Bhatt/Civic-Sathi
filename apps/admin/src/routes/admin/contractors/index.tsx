import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getContractors, verifyContractor, suspendContractor } from "@/services/shared-store";
import type { Contractor } from "@/services/types";
import { useAdminAuth } from "@/lib/admin-auth";
import { GlassCard } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/states";
import { Building2, Search, Filter, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/contractors/")({
  head: () => ({ meta: [{ title: "Contractors | Admin | JANMIND" }] }),
  component: ContractorsList,
});

function ContractorsList() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const { admin } = useAdminAuth();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getContractors();
      setContractors(data);
    } catch (error) {
      toast.error("Failed to load contractors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerify = async (id: string) => {
    if (!admin) return;
    try {
      await verifyContractor(id, admin.id, admin.name);
      toast.success("Contractor verified successfully");
      loadData();
    } catch (error) {
      toast.error("Failed to verify contractor");
    }
  };

  const handleSuspend = async (id: string) => {
    if (!admin) return;
    const reason = prompt("Enter suspension reason:");
    if (!reason) return;
    
    try {
      await suspendContractor(id, admin.id, admin.name, reason);
      toast.error("Contractor suspended");
      loadData();
    } catch (error) {
      toast.error("Failed to suspend contractor");
    }
  };

  const filtered = contractors.filter(c => {
    if (filter !== "ALL" && c.status !== filter) return false;
    if (search && !c.companyName.toLowerCase().includes(search.toLowerCase()) && 
        !c.registrationNumber.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <LoadingState message="Loading contractor registry..." />;

  return (
    <div className="space-y-6 muni-page-enter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contractor Registry</h1>
          <p className="text-[var(--muted-foreground)]">Manage and verify platform contractors</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            type="text"
            className="ambient-field pl-9 w-full"
            placeholder="Search by name or registration number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 p-1 glass rounded-md overflow-x-auto">
          {["ALL", "VERIFIED", "PENDING_VERIFICATION", "SUSPENDED"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm font-medium rounded-sm whitespace-nowrap transition-colors ${
                filter === f 
                  ? "bg-[var(--surface-elevated)] text-[var(--foreground)] shadow-sm" 
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filtered.map(contractor => (
          <GlassCard key={contractor.id} className="p-5 flex flex-col md:flex-row gap-6 md:items-center">
            <div className="w-12 h-12 rounded-full bg-[var(--surface-elevated)] border border-[var(--glass-border)] flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 text-[var(--muted-foreground)]" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <Link to={"/admin/contractors/$id" as any} params={{ id: contractor.id } as any} className="text-lg font-semibold hover:underline truncate">
                  {contractor.companyName}
                </Link>
                <StatusBadge status={contractor.status} />
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">
                Reg: {contractor.registrationNumber}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {contractor.specializationCategories.slice(0, 2).map((spec: string) => (
                  <span key={spec} className="px-2 py-0.5 rounded text-xs bg-[var(--background)] border border-[var(--glass-border)]">
                    {spec}
                  </span>
                ))}
                {contractor.specializationCategories.length > 2 && (
                  <span className="px-2 py-0.5 rounded text-xs bg-[var(--background)] border border-[var(--glass-border)] text-[var(--muted-foreground)]">
                    +{contractor.specializationCategories.length - 2} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              {contractor.status === 'PENDING_VERIFICATION' && (
                <button
                  onClick={() => handleVerify(contractor.id)}
                  className="action-btn w-full sm:w-auto flex items-center gap-2 press bg-[var(--success)]/10 text-[var(--success)] hover:bg-[var(--success)]/20 border-transparent"
                >
                  <CheckCircle2 className="w-4 h-4" /> Verify
                </button>
              )}
              {contractor.status === 'VERIFIED' && (
                <button
                  onClick={() => handleSuspend(contractor.id)}
                  className="action-btn w-full sm:w-auto flex items-center gap-2 press bg-[var(--critical)]/10 text-[var(--critical)] hover:bg-[var(--critical)]/20 border-transparent"
                >
                  <ShieldAlert className="w-4 h-4" /> Suspend
                </button>
              )}
              <Link
                to={"/admin/contractors/$id" as any}
                params={{ id: contractor.id } as any}
                className="action-btn w-full sm:w-auto text-center"
              >
                View Details
              </Link>
            </div>
          </GlassCard>
        ))}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-[var(--muted-foreground)] border border-dashed border-[var(--glass-border)] rounded-lg">
            No contractors found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'VERIFIED') {
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20 flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" /> Verified
      </span>
    );
  }
  if (status === 'PENDING_VERIFICATION') {
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/20 flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" /> Pending
      </span>
    );
  }
  if (status === 'SUSPENDED') {
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--critical)]/10 text-[var(--critical)] border border-[var(--critical)]/20 flex items-center gap-1">
        <ShieldAlert className="w-3 h-3" /> Suspended
      </span>
    );
  }
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-[var(--muted-foreground)]">
      {status}
    </span>
  );
}
