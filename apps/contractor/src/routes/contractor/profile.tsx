import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useContractorAuth } from "@/lib/contractor-auth";
import { getContractor } from "@/services/api";
import { Contractor } from "@/services/types";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { Building, MapPin, Phone, Mail, FileText, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/contractor/profile")({
  head: () => ({ meta: [{ title: "Profile - Contractor Portal" }] }),
  component: ContractorProfile,
});

function ContractorProfile() {
  const { contractor: contractorAuth, signOut } = useContractorAuth();
  const [contractor, setContractor] = useState<Contractor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!contractorAuth?.contractorId) return;
      try {
        const data = await getContractor(contractorAuth.contractorId);
        setContractor(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [contractorAuth]);

  if (loading) return <LoadingState message="Loading profile..." />;
  if (error) return <ErrorState description={error?.message ?? "Error loading profile."} />;
  if (!contractor) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">Company Profile</h1>
        <p className="text-[var(--muted-foreground)] text-sm">Manage your business information and registration details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Quick Info */}
        <div className="md:col-span-1 space-y-6">
          <GlassCard className="p-6 glass-strong flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-[var(--surface-elevated)] border-2 border-[var(--primary)]/30 rounded-2xl flex items-center justify-center text-3xl font-bold text-[var(--primary)] shadow-sm mb-4">
              {contractor.companyName.substring(0, 1)}
            </div>
            <h2 className="text-lg font-semibold text-[var(--foreground)] leading-tight mb-1">{contractor.companyName}</h2>
            <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20 rounded-md text-xs font-medium mb-6">
              <CheckCircle2 size={14} />
              Verified Contractor
            </div>
            
            <button 
              onClick={() => void signOut()}
              className="w-full py-2 bg-[var(--surface)] border border-[var(--glass-border)] text-[var(--foreground)] hover:bg-[var(--critical)]/10 hover:text-[var(--critical)] hover:border-[var(--critical)]/30 transition-colors rounded-md text-sm font-medium"
            >
              Sign Out
            </button>
          </GlassCard>

          <GlassCard className="p-5 glass-strong space-y-4">
            <SectionLabel>Contact Details</SectionLabel>
            
            <div className="flex items-start gap-3">
              <Phone className="text-[var(--muted-foreground)] shrink-0 mt-0.5" size={16} />
              <div>
                <div className="text-[var(--muted-foreground)] text-xs">Phone</div>
                <div className="text-[var(--foreground)] text-sm">{contractor.phone}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Mail className="text-[var(--muted-foreground)] shrink-0 mt-0.5" size={16} />
              <div>
                <div className="text-[var(--muted-foreground)] text-xs">Email</div>
                <dd className="mt-1 font-medium break-all">{contractor.email}</dd>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="text-[var(--muted-foreground)] shrink-0 mt-0.5" size={16} />
              <div>
                <div className="text-[var(--muted-foreground)] text-xs">Address</div>
                <div className="text-[var(--foreground)] text-sm leading-relaxed">{contractor.address}</div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Registration & Legal */}
        <div className="md:col-span-2 space-y-6">
          <GlassCard className="p-6 glass-strong">
            <SectionLabel className="mb-4 flex items-center gap-2">
              <Building size={18} /> Company Information
            </SectionLabel>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="p-4 bg-[var(--surface)] border border-[var(--glass-border)] rounded-lg">
                <div className="text-[var(--muted-foreground)] text-xs mb-1">Company Name</div>
                <div className="text-[var(--foreground)] font-medium">{contractor.companyName}</div>
              </div>
              
              <div className="p-4 bg-[var(--surface)] border border-[var(--glass-border)] rounded-lg">
                <h1 className="text-2xl font-semibold mt-3 mb-1">{contractor.companyName}</h1>
                <p className="text-[var(--muted-foreground)]">ID: {contractor.id}</p>
                {contractor.contactPerson}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 glass-strong">
            <SectionLabel className="mb-4 flex items-center gap-2">
              <FileText size={18} /> Legal & Registration
            </SectionLabel>
            
            <div className="space-y-4 mt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[var(--surface)] border border-[var(--glass-border)] rounded-lg gap-2">
                <div>
                  <div className="text-[var(--muted-foreground)] text-xs mb-1">Registration Number</div>
                  <div className="text-[var(--foreground)] font-mono">{contractor.registrationNumber}</div>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded">Active</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[var(--surface)] border border-[var(--glass-border)] rounded-lg gap-2">
                <div>
                  <div className="text-[var(--muted-foreground)] text-xs mb-1">GSTIN</div>
                  <div className="text-[var(--foreground)] font-mono">{contractor.gstin}</div>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[var(--success)] bg-[var(--success)]/10 px-2 py-1 rounded">Verified</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[var(--surface)] border border-[var(--glass-border)] rounded-lg gap-2">
                <div>
                  <div className="text-[var(--muted-foreground)] text-xs mb-1">PAN</div>
                  <h3 className="font-medium text-[var(--foreground)]">{contractor.companyName} User</h3>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[var(--success)] bg-[var(--success)]/10 px-2 py-1 rounded">Verified</span>
              </div>
            </div>
          </GlassCard>
        </div>
        
      </div>
    </div>
  );
}
