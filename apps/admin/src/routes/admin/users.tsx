/**
 * User Management Page — Admin Portal
 *
 * Allows super admin (Maher Bhatt) and supervisors to:
 * - View all users (officers, municipality, contractors, citizens, admins)
 * - Create new users of any role
 * - Edit user details (name, role, city, department, password)
 * - Delete users
 *
 * All operations call the real backend via /api/v1/admin/users
 */

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Users, Plus, Search, Trash2, Edit2, X, Check, Shield, Building2, User, ChevronDown,
} from "lucide-react";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState } from "@/components/ui/states";
import { listAllUsers, createUser, updateUser, deleteUser, listAdminCities } from "@/services/shared-store";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "User Management | Civic Sathi Admin" }] }),
  component: UserManagementPage,
});

const ROLES = ["admin", "supervisor", "municipality", "officer", "contractor", "citizen"] as const;
type Role = typeof ROLES[number];

const ROLE_COLORS: Record<Role, string> = {
  admin:        "bg-red-500/20 text-red-400 border-red-500/30",
  supervisor:   "bg-orange-500/20 text-orange-400 border-orange-500/30",
  municipality: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  officer:      "bg-blue-500/20 text-blue-400 border-blue-500/30",
  contractor:   "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  citizen:      "bg-green-500/20 text-green-400 border-green-500/30",
};

const ROLE_ICONS: Record<Role, typeof Shield> = {
  admin: Shield, supervisor: Shield, municipality: Building2,
  officer: Shield, contractor: Building2, citizen: User,
};

function RoleBadge({ role }: { role: string }) {
    const { t } = useI18n();
  const r = (role as Role) || "citizen";
  const cls = ROLE_COLORS[r] ?? "bg-gray-500/20 text-gray-400 border-gray-500/30";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border ${cls}`}>
      {role}
    </span>
  );
}

interface UserRow {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  city: string | null;
  department: string | null;
  created_at: string;
}

interface FormState {
  name: string;
  email: string;
  password: string;
  role: Role;
  city: string;
  department: string;
  phone: string;
}

const EMPTY_FORM: FormState = {
  name: "", email: "", password: "", role: "officer",
  city: "", department: "", phone: "",
};

function UserManagementPage() {
    const { t } = useI18n();
  const [users, setUsers]         = useState<UserRow[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("civicsathi_admin_users");
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });
  const [cities, setCities]       = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading]     = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch]       = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [showForm, setShowForm]   = useState(false);
  const [editUser, setEditUser]   = useState<UserRow | null>(null);
  const [form, setForm]           = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState<string | null>(null);

  const load = async () => {
    if (!admin) return;
    setLoading(true);
    setLoadError(null);
    try {
      const [us, cs] = await Promise.all([listAllUsers({ limit: 200 }), listAdminCities()]);
      if (us && Array.isArray(us)) setUsers(us);
      if (cs && Array.isArray(cs)) setCities(cs);
    } catch (e: any) {
      const message = e?.message ?? "Failed to load users";
      setLoadError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (admin) load(); }, [admin?.id]);

  const filtered = users.filter(u => {
    const matchRole   = roleFilter === "all" || u.role === roleFilter;
    const matchSearch = !search || [u.name, u.email, u.city, u.department].some(
      v => v?.toLowerCase().includes(search.toLowerCase())
    );
    return matchRole && matchSearch;
  });

  const openCreate = () => { setEditUser(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit   = (u: UserRow) => {
    setEditUser(u);
    setForm({ name: u.name, email: u.email ?? "", password: "", role: u.role as Role, city: u.city ?? "", department: u.department ?? "", phone: u.phone ?? "" });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.role) { toast.error("Name and role are required"); return; }
    if (!editUser && (!form.email.trim() || !form.password.trim())) {
      toast.error("Email and password required for new users"); return;
    }
    setSaving(true);
    try {
      if (editUser) {
        const patch: any = { name: form.name, email: form.email, role: form.role, city: form.city || '', department: form.department || '', phone: form.phone || '' };
        if (form.password.trim()) patch.password = form.password;
        await updateUser(editUser.id, patch);
        toast.success("User updated");
      } else {
        await createUser({ name: form.name, email: form.email, password: form.password, role: form.role, city: form.city || '', department: form.department || '', phone: form.phone || '' });
        toast.success("User created");
      }
      setShowForm(false);
      await load();
    } catch (e: any) {
      toast.error(e.message ?? "Failed to save user");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteUser(id);
      toast.success(`${name} deleted`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (e: any) {
      toast.error(e.message ?? "Failed to delete user");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <LoadingState message="Loading users..." />;
  if (loadError && users.length === 0) {
    return (
      <div className="space-y-4 muni-page-enter">
        <h1 className="text-2xl font-bold tracking-tight">{t('ui.user_management')}</h1>
        <div className="rounded-lg border border-[var(--critical)]/30 bg-[var(--critical)]/10 p-6 text-sm">
          <p className="font-medium">Unable to load live users</p>
          <p className="mt-1 text-[var(--muted-foreground)]">{loadError}</p>
          <button onClick={load} className="action-btn primary mt-4">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 muni-page-enter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <SectionLabel>{t('ui.platform_administration')}</SectionLabel>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6" /> {t('ui.user_management')}</h1>
          <p className="text-[var(--muted-foreground)] text-sm mt-1">
            {users.length} {t('ui.total_users_across_all_roles')}</p>
        </div>
        <button
          onClick={openCreate}
          className="action-btn primary flex items-center gap-2 press"
        >
          <Plus className="w-4 h-4" /> {t('ui.add_user')}</button>
      </div>

      {/* Role count cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {ROLES.map(r => {
          const count = users.filter(u => u.role === r).length;
          return (
            <GlassCard
              key={r}
              className={`p-3 cursor-pointer transition-all ${roleFilter === r ? "ring-2 ring-[var(--primary)]" : ""}`}
              onClick={() => setRoleFilter(roleFilter === r ? "all" : r)}
            >
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">{r}</p>
              <p className="text-xl font-bold mt-1">{count}</p>
            </GlassCard>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('ui.search_name_email_city')}
            className="ambient-field w-full pl-10"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="ambient-field"
        >
          <option value="all">{t('ui.all_roles')}</option>
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* User Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--glass-border)] text-[var(--muted-foreground)] text-xs uppercase tracking-wider">
                <th className="text-left p-4">{t('ui.name')}</th>
                <th className="text-left p-4">{t('ui.email')}</th>
                <th className="text-left p-4">{t('ui.role')}</th>
                <th className="text-left p-4">{t('ui.city')}</th>
                <th className="text-left p-4">{t('ui.department')}</th>
                <th className="text-left p-4">{t('ui.created')}</th>
                <th className="text-right p-4">{t('ui.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center p-8 text-[var(--muted-foreground)]">{t('ui.no_users_found')}</td></tr>
              )}
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-[var(--glass-border)]/50 hover:bg-[var(--surface-elevated)]/30 transition-colors">
                  <td className="p-4 font-medium">{u.name}</td>
                  <td className="p-4 text-[var(--muted-foreground)] text-xs">{u.email ?? "—"}</td>
                  <td className="p-4"><RoleBadge role={u.role} /></td>
                  <td className="p-4 text-[var(--muted-foreground)] capitalize">{u.city ?? "—"}</td>
                  <td className="p-4 text-[var(--muted-foreground)]">{u.department ?? "—"}</td>
                  <td className="p-4 text-[var(--muted-foreground)] text-xs">
                    {new Date(u.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(u)}
                        className="p-1.5 rounded hover:bg-[var(--surface-elevated)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                        title={t('ui.edit_user')}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id, u.name)}
                        disabled={deleting === u.id}
                        className="p-1.5 rounded hover:bg-red-500/10 text-[var(--muted-foreground)] hover:text-red-400 transition-colors disabled:opacity-50"
                        title={t('ui.delete_user')}
                      >
                        {deleting === u.id
                          ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          : <Trash2 className="w-4 h-4" />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <GlassCard className="w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{editUser ? "Edit User" : "Create User"}</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded hover:bg-[var(--surface-elevated)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label-xs">{t('ui.full_name')}</label>
                <input className="ambient-field w-full mt-1" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder={t('ui.e_g_priya_sharma')} />
              </div>
              <div className="col-span-2">
                <label className="label-xs">{t('ui.email')} *</label>
                <input type="email" className="ambient-field w-full mt-1" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} placeholder={t('ui.user_example_com')} />
              </div>
              <div className="col-span-2">
                <label className="label-xs">{editUser ? "New Password (leave blank to keep)" : "Password *"}</label>
                <input type="password" className="ambient-field w-full mt-1" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} placeholder={t('ui.min_8_characters')} />
              </div>
              <div>
                <label className="label-xs">{t('ui.role')}</label>
                <select className="ambient-field w-full mt-1" value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value as Role}))}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="label-xs">{t('ui.city')}</label>
                <select className="ambient-field w-full mt-1" value={form.city} onChange={e => setForm(f => ({...f, city: e.target.value}))}>
                  <option value="">{t('ui.none')}</option>
                  {cities.map(c => <option key={c.id} value={c.name.toLowerCase()}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="label-xs">{t('ui.department')}</label>
                <input className="ambient-field w-full mt-1" value={form.department} onChange={e => setForm(f => ({...f, department: e.target.value}))} placeholder={t('ui.e_g_roads')} />
              </div>
              <div>
                <label className="label-xs">{t('ui.phone')}</label>
                <input className="ambient-field w-full mt-1" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="+91 00000 00000" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="action-btn flex-1">{t('ui.cancel')}</button>
              <button onClick={handleSave} disabled={saving} className="action-btn primary flex-1 flex items-center justify-center gap-2">
                {saving
                  ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  : <><Check className="w-4 h-4" />{editUser ? "Save Changes" : "Create User"}</>
                }
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

