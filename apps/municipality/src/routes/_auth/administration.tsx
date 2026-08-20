import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Building2, CheckCircle2, Loader2, ShieldCheck, UserPlus, Users } from "lucide-react";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import {
  createMunicipalityContractor,
  createMunicipalityOfficer,
  listMunicipalityContractors,
  listMunicipalityOfficers,
  type MunicipalityContractorRecord,
  type MunicipalityOfficerRecord,
} from "@/services/api";
import { useMuniAuth } from "@/lib/muni-auth";

export const Route = createFileRoute("/_auth/administration")({
  head: () => ({ meta: [{ title: "Municipality Administration — Civic Sathi" }] }),
  component: AdministrationPage,
});

type FormMode = "officer" | "contractor";

const inputClass =
  "mt-1 w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

function AdministrationPage() {
  const { officer } = useMuniAuth();
  const [officers, setOfficers] = useState<MunicipalityOfficerRecord[]>([]);
  const [contractors, setContractors] = useState<MunicipalityContractorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<FormMode | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [officerForm, setOfficerForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    department: "",
    designation: "Ward Officer",
    ward: "",
  });
  const [contractorForm, setContractorForm] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    login_email: "",
    login_password: "",
    registration_class: "Municipal Works",
  });

  const canManage = useMemo(
    () => officer?.role === "Collector" || officer?.designation === "Collector",
    [officer?.designation, officer?.role],
  );

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [officerRows, contractorRows] = await Promise.all([
        listMunicipalityOfficers(),
        listMunicipalityContractors(),
      ]);
      setOfficers(officerRows);
      setContractors(contractorRows);
    } catch (cause: any) {
      setError(cause?.message || "The municipality administration service is unavailable.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (canManage) void load();
  }, [canManage]);

  async function submitOfficer(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting("officer");
    setError("");
    setNotice("");
    try {
      await createMunicipalityOfficer(officerForm);
      setOfficerForm({ name: "", email: "", password: "", phone: "", department: "", designation: "Ward Officer", ward: "" });
      setNotice("Officer account created inside your city scope.");
      await load();
    } catch (cause: any) {
      setError(cause?.message || "Officer creation failed. No account was created.");
    } finally {
      setSubmitting(null);
    }
  }

  async function submitContractor(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting("contractor");
    setError("");
    setNotice("");
    try {
      await createMunicipalityContractor(contractorForm);
      setContractorForm({ company_name: "", contact_person: "", email: "", phone: "", login_email: "", login_password: "", registration_class: "Municipal Works" });
      setNotice("Contractor profile created with a pending city registration.");
      await load();
    } catch (cause: any) {
      setError(cause?.message || "Contractor creation failed. No contractor was created.");
    } finally {
      setSubmitting(null);
    }
  }

  if (!canManage) {
    return (
      <div className="muni-page-enter space-y-6">
        <SectionLabel>Restricted municipal control</SectionLabel>
        <GlassCard elevation="raised" className="max-w-2xl p-6">
          <ShieldCheck className="h-8 w-8 text-warning" />
          <h1 className="mt-4 text-2xl font-semibold">Collector access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Officer and contractor provisioning is intentionally limited to the collector account for the authenticated city. This is enforced by the backend as well as the navigation.
          </p>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="muni-page-enter space-y-6">
      <header>
        <SectionLabel>Collector control room</SectionLabel>
        <h1 className="mt-2 text-2xl font-semibold">Municipality administration</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Provision staff and contractor access inside <strong className="text-foreground">{officer?.city}</strong>. The server ignores cross-city attempts and records every creation in the audit trail.
        </p>
      </header>

      {(error || notice) && (
        <div className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm ${error ? "border-critical/30 bg-critical/10 text-critical" : "border-primary/30 bg-primary/10 text-primary"}`}>
          {error ? <ShieldCheck className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          <span>{error || notice}</span>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-2">
        <GlassCard elevation="raised" className="p-5">
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-primary/15 p-2 text-primary"><UserPlus className="h-5 w-5" /></span>
            <div><h2 className="font-semibold">Add municipal officer</h2><p className="text-xs text-muted-foreground">Creates a city-bound account; collector and admin roles cannot be created here.</p></div>
          </div>
          <form className="mt-5 grid gap-3 sm:grid-cols-2" onSubmit={submitOfficer}>
            <label className="text-xs text-muted-foreground">Full name<input required className={inputClass} value={officerForm.name} onChange={(e) => setOfficerForm({ ...officerForm, name: e.target.value })} /></label>
            <label className="text-xs text-muted-foreground">Login email<input required type="email" className={inputClass} value={officerForm.email} onChange={(e) => setOfficerForm({ ...officerForm, email: e.target.value })} /></label>
            <label className="text-xs text-muted-foreground">Temporary password<input required minLength={8} type="password" className={inputClass} value={officerForm.password} onChange={(e) => setOfficerForm({ ...officerForm, password: e.target.value })} /></label>
            <label className="text-xs text-muted-foreground">Phone<input className={inputClass} value={officerForm.phone} onChange={(e) => setOfficerForm({ ...officerForm, phone: e.target.value })} /></label>
            <label className="text-xs text-muted-foreground">Department<input required className={inputClass} value={officerForm.department} onChange={(e) => setOfficerForm({ ...officerForm, department: e.target.value })} /></label>
            <label className="text-xs text-muted-foreground">Designation<input required className={inputClass} value={officerForm.designation} onChange={(e) => setOfficerForm({ ...officerForm, designation: e.target.value })} /></label>
            <label className="text-xs text-muted-foreground">Ward<input className={inputClass} value={officerForm.ward} onChange={(e) => setOfficerForm({ ...officerForm, ward: e.target.value })} /></label>
            <div className="flex items-end"><button disabled={submitting !== null} className="press w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{submitting === "officer" ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Create officer"}</button></div>
          </form>
        </GlassCard>

        <GlassCard elevation="raised" className="p-5">
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-warning/15 p-2 text-warning"><Building2 className="h-5 w-5" /></span>
            <div><h2 className="font-semibold">Register contractor</h2><p className="text-xs text-muted-foreground">Creates a contractor login and a pending registration for your city.</p></div>
          </div>
          <form className="mt-5 grid gap-3 sm:grid-cols-2" onSubmit={submitContractor}>
            <label className="text-xs text-muted-foreground">Company name<input required className={inputClass} value={contractorForm.company_name} onChange={(e) => setContractorForm({ ...contractorForm, company_name: e.target.value })} /></label>
            <label className="text-xs text-muted-foreground">Contact person<input required className={inputClass} value={contractorForm.contact_person} onChange={(e) => setContractorForm({ ...contractorForm, contact_person: e.target.value })} /></label>
            <label className="text-xs text-muted-foreground">Company email<input required type="email" className={inputClass} value={contractorForm.email} onChange={(e) => setContractorForm({ ...contractorForm, email: e.target.value })} /></label>
            <label className="text-xs text-muted-foreground">Phone<input required className={inputClass} value={contractorForm.phone} onChange={(e) => setContractorForm({ ...contractorForm, phone: e.target.value })} /></label>
            <label className="text-xs text-muted-foreground">Login email<input required type="email" className={inputClass} value={contractorForm.login_email} onChange={(e) => setContractorForm({ ...contractorForm, login_email: e.target.value })} /></label>
            <label className="text-xs text-muted-foreground">Login password<input required minLength={8} type="password" className={inputClass} value={contractorForm.login_password} onChange={(e) => setContractorForm({ ...contractorForm, login_password: e.target.value })} /></label>
            <label className="text-xs text-muted-foreground">Registration class<input required className={inputClass} value={contractorForm.registration_class} onChange={(e) => setContractorForm({ ...contractorForm, registration_class: e.target.value })} /></label>
            <div className="flex items-end"><button disabled={submitting !== null} className="press w-full rounded-xl bg-warning px-4 py-2.5 text-sm font-semibold text-warning-foreground disabled:opacity-60">{submitting === "contractor" ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Create registration"}</button></div>
          </form>
        </GlassCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <GlassCard elevation="raised" className="p-5">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" /><h2 className="font-semibold">City officers</h2></div><span className="text-xs text-muted-foreground">{loading ? "Loading…" : officers.length}</span></div>
          <div className="mt-4 space-y-2">{!loading && officers.length === 0 && <p className="rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground">No city officers have been provisioned yet.</p>}{officers.map((member) => <div key={member.id} className="flex items-center justify-between rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-3"><div><p className="text-sm font-medium">{member.name}</p><p className="text-xs text-muted-foreground">{member.designation || member.role} · {member.department || "General"}</p></div><span className="text-xs text-muted-foreground">{member.ward || "Unassigned"}</span></div>)}</div>
        </GlassCard>
        <GlassCard elevation="raised" className="p-5">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-warning" /><h2 className="font-semibold">City contractors</h2></div><span className="text-xs text-muted-foreground">{loading ? "Loading…" : contractors.length}</span></div>
          <div className="mt-4 space-y-2">{!loading && contractors.length === 0 && <p className="rounded-xl bg-muted/40 p-4 text-sm text-muted-foreground">No contractor registrations exist for this city.</p>}{contractors.map((contractor) => <div key={contractor.registration_id} className="flex items-center justify-between rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-3"><div><p className="text-sm font-medium">{contractor.company_name}</p><p className="text-xs text-muted-foreground">{contractor.contact_person} · {contractor.registration_number}</p></div><span className={`rounded-full px-2 py-1 text-[0.65rem] font-semibold ${contractor.registration_status === "APPROVED" ? "bg-primary/15 text-primary" : "bg-warning/15 text-warning"}`}>{contractor.registration_status}</span></div>)}</div>
        </GlassCard>
      </div>
    </div>
  );
}
