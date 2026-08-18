import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { S as Check, d as Plus, f as Pen, i as Trash2, l as Search, n as Users, t as X } from "../_libs/lucide-react.mjs";
import { a as deleteUser, i as createUser, m as listAllUsers, p as listAdminCities, v as updateUser, y as useI18n } from "./router-B101IEkm.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CoNgXAty.mjs";
import { n as LoadingState } from "./states-BSypa5q_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/users-aKWiies4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
var ROLES = [
	"admin",
	"supervisor",
	"municipality",
	"officer",
	"contractor",
	"citizen"
];
var ROLE_COLORS = {
	admin: "bg-red-500/20 text-red-400 border-red-500/30",
	supervisor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
	municipality: "bg-purple-500/20 text-purple-400 border-purple-500/30",
	officer: "bg-blue-500/20 text-blue-400 border-blue-500/30",
	contractor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
	citizen: "bg-green-500/20 text-green-400 border-green-500/30"
};
function RoleBadge({ role }) {
	const { t } = useI18n();
	const cls = ROLE_COLORS[role || "citizen"] ?? "bg-gray-500/20 text-gray-400 border-gray-500/30";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border ${cls}`,
		children: role
	});
}
var EMPTY_FORM = {
	name: "",
	email: "",
	password: "",
	role: "officer",
	city: "",
	department: "",
	phone: ""
};
function UserManagementPage() {
	const { t } = useI18n();
	const [users, setUsers] = (0, import_react.useState)([]);
	const [cities, setCities] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const [roleFilter, setRoleFilter] = (0, import_react.useState)("all");
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [editUser, setEditUser] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(EMPTY_FORM);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [deleting, setDeleting] = (0, import_react.useState)(null);
	const load = async () => {
		setLoading(true);
		try {
			const [us, cs] = await Promise.all([listAllUsers({ limit: 200 }), listAdminCities()]);
			setUsers(us);
			setCities(cs);
		} catch (e) {
			toast.error(e.message ?? "Failed to load users");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	const filtered = users.filter((u) => {
		const matchRole = roleFilter === "all" || u.role === roleFilter;
		const matchSearch = !search || [
			u.name,
			u.email,
			u.city,
			u.department
		].some((v) => v?.toLowerCase().includes(search.toLowerCase()));
		return matchRole && matchSearch;
	});
	const openCreate = () => {
		setEditUser(null);
		setForm(EMPTY_FORM);
		setShowForm(true);
	};
	const openEdit = (u) => {
		setEditUser(u);
		setForm({
			name: u.name,
			email: u.email ?? "",
			password: "",
			role: u.role,
			city: u.city ?? "",
			department: u.department ?? "",
			phone: u.phone ?? ""
		});
		setShowForm(true);
	};
	const handleSave = async () => {
		if (!form.name.trim() || !form.role) {
			toast.error("Name and role are required");
			return;
		}
		if (!editUser && (!form.email.trim() || !form.password.trim())) {
			toast.error("Email and password required for new users");
			return;
		}
		setSaving(true);
		try {
			if (editUser) {
				const patch = {
					name: form.name,
					role: form.role,
					city: form.city || void 0,
					department: form.department || void 0,
					phone: form.phone || void 0
				};
				if (form.password.trim()) patch.password = form.password;
				await updateUser(editUser.id, patch);
				toast.success("User updated");
			} else {
				await createUser({
					name: form.name,
					email: form.email,
					password: form.password,
					role: form.role,
					city: form.city || void 0,
					department: form.department || void 0,
					phone: form.phone || void 0
				});
				toast.success("User created");
			}
			setShowForm(false);
			await load();
		} catch (e) {
			toast.error(e.message ?? "Failed to save user");
		} finally {
			setSaving(false);
		}
	};
	const handleDelete = async (id, name) => {
		if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
		setDeleting(id);
		try {
			await deleteUser(id);
			toast.success(`${name} deleted`);
			setUsers((prev) => prev.filter((u) => u.id !== id));
		} catch (e) {
			toast.error(e.message ?? "Failed to delete user");
		} finally {
			setDeleting(null);
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading users..." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 muni-page-enter",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.platform_administration") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "text-2xl font-bold tracking-tight flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-6 h-6" }),
							" ",
							t("ui.user_management")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[var(--muted-foreground)] text-sm mt-1",
						children: [
							users.length,
							" ",
							t("ui.total_users_across_all_roles")
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: openCreate,
					className: "action-btn primary flex items-center gap-2 press",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }),
						" ",
						t("ui.add_user")
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 md:grid-cols-6 gap-3",
				children: ROLES.map((r) => {
					const count = users.filter((u) => u.role === r).length;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: `p-3 cursor-pointer transition-all ${roleFilter === r ? "ring-2 ring-[var(--primary)]" : ""}`,
						onClick: () => setRoleFilter(roleFilter === r ? "all" : r),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]",
							children: r
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xl font-bold mt-1",
							children: count
						})]
					}, r);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3 flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 min-w-48",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: t("ui.search_name_email_city"),
						className: "ambient-field w-full pl-10"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: roleFilter,
					onChange: (e) => setRoleFilter(e.target.value),
					className: "ambient-field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: t("ui.all_roles")
					}), ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: r,
						children: r
					}, r))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
				className: "overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-[var(--glass-border)] text-[var(--muted-foreground)] text-xs uppercase tracking-wider",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left p-4",
									children: t("ui.name")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left p-4",
									children: t("ui.email")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left p-4",
									children: t("ui.role")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left p-4",
									children: t("ui.city")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left p-4",
									children: t("ui.department")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-left p-4",
									children: t("ui.created")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right p-4",
									children: t("ui.actions")
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 7,
							className: "text-center p-8 text-[var(--muted-foreground)]",
							children: t("ui.no_users_found")
						}) }), filtered.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-[var(--glass-border)]/50 hover:bg-[var(--surface-elevated)]/30 transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-4 font-medium",
									children: u.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-4 text-[var(--muted-foreground)] text-xs",
									children: u.email ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleBadge, { role: u.role })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-4 text-[var(--muted-foreground)] capitalize",
									children: u.city ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-4 text-[var(--muted-foreground)]",
									children: u.department ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-4 text-[var(--muted-foreground)] text-xs",
									children: new Date(u.created_at).toLocaleDateString("en-IN")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "p-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-end gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => openEdit(u),
											className: "p-1.5 rounded hover:bg-[var(--surface-elevated)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors",
											title: t("ui.edit_user"),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "w-4 h-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handleDelete(u.id, u.name),
											disabled: deleting === u.id,
											className: "p-1.5 rounded hover:bg-red-500/10 text-[var(--muted-foreground)] hover:text-red-400 transition-colors disabled:opacity-50",
											title: t("ui.delete_user"),
											children: deleting === u.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
										})]
									})
								})
							]
						}, u.id))] })]
					})
				})
			}),
			showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "w-full max-w-lg p-6 space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-bold",
								children: editUser ? "Edit User" : "Create User"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setShowForm(false),
								className: "p-1.5 rounded hover:bg-[var(--surface-elevated)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "label-xs",
										children: t("ui.full_name")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										className: "ambient-field w-full mt-1",
										value: form.name,
										onChange: (e) => setForm((f) => ({
											...f,
											name: e.target.value
										})),
										placeholder: t("ui.e_g_priya_sharma")
									})]
								}),
								!editUser && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "label-xs",
										children: t("ui.email")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "email",
										className: "ambient-field w-full mt-1",
										value: form.email,
										onChange: (e) => setForm((f) => ({
											...f,
											email: e.target.value
										})),
										placeholder: t("ui.user_example_com")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "label-xs",
										children: editUser ? "New Password (leave blank to keep)" : "Password *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "password",
										className: "ambient-field w-full mt-1",
										value: form.password,
										onChange: (e) => setForm((f) => ({
											...f,
											password: e.target.value
										})),
										placeholder: t("ui.min_8_characters")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "label-xs",
									children: t("ui.role")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "ambient-field w-full mt-1",
									value: form.role,
									onChange: (e) => setForm((f) => ({
										...f,
										role: e.target.value
									})),
									children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: r,
										children: r
									}, r))
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "label-xs",
									children: t("ui.city")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "ambient-field w-full mt-1",
									value: form.city,
									onChange: (e) => setForm((f) => ({
										...f,
										city: e.target.value
									})),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: t("ui.none")
									}), cities.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c.name.toLowerCase(),
										children: c.name
									}, c.id))]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "label-xs",
									children: t("ui.department")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "ambient-field w-full mt-1",
									value: form.department,
									onChange: (e) => setForm((f) => ({
										...f,
										department: e.target.value
									})),
									placeholder: t("ui.e_g_roads")
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "label-xs",
									children: t("ui.phone")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "ambient-field w-full mt-1",
									value: form.phone,
									onChange: (e) => setForm((f) => ({
										...f,
										phone: e.target.value
									})),
									placeholder: "+91 00000 00000"
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setShowForm(false),
								className: "action-btn flex-1",
								children: t("ui.cancel")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleSave,
								disabled: saving,
								className: "action-btn primary flex-1 flex items-center justify-center gap-2",
								children: saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4" }), editUser ? "Save Changes" : "Create User"] })
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { UserManagementPage as component };
