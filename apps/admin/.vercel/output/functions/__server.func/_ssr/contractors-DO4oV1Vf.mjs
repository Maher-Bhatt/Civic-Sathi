import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as getContractors, d as suspendContractor, p as verifyContractor, r as useAdminAuth } from "./router-CYRUKuqz.mjs";
import { t as GlassCard } from "./glass-card-CoNgXAty.mjs";
import { c as Search, g as CircleCheck, n as TriangleAlert, o as ShieldAlert, v as Building2 } from "../_libs/lucide-react.mjs";
import { n as LoadingState } from "./states-BSypa5q_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contractors-DO4oV1Vf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ContractorsList() {
	const [contractors, setContractors] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [filter, setFilter] = (0, import_react.useState)("ALL");
	const [search, setSearch] = (0, import_react.useState)("");
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
	(0, import_react.useEffect)(() => {
		loadData();
	}, []);
	const handleVerify = async (id) => {
		if (!admin) return;
		try {
			await verifyContractor(id, admin.id, admin.name);
			toast.success("Contractor verified successfully");
			loadData();
		} catch (error) {
			toast.error("Failed to verify contractor");
		}
	};
	const handleSuspend = async (id) => {
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
	const filtered = contractors.filter((c) => {
		if (filter !== "ALL" && c.status !== filter) return false;
		if (search && !c.companyName.toLowerCase().includes(search.toLowerCase()) && !c.registrationNumber.toLowerCase().includes(search.toLowerCase())) return false;
		return true;
	});
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading contractor registry..." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 muni-page-enter",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "Contractor Registry"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[var(--muted-foreground)]",
					children: "Manage and verify platform contractors"
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "ambient-field pl-9 w-full",
						placeholder: "Search by name or registration number...",
						value: search,
						onChange: (e) => setSearch(e.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 p-1 glass rounded-md overflow-x-auto",
					children: [
						"ALL",
						"VERIFIED",
						"PENDING_VERIFICATION",
						"SUSPENDED"
					].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setFilter(f),
						className: `px-4 py-1.5 text-sm font-medium rounded-sm whitespace-nowrap transition-colors ${filter === f ? "bg-[var(--surface-elevated)] text-[var(--foreground)] shadow-sm" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"}`,
						children: f.replace("_", " ")
					}, f))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4",
				children: [filtered.map((contractor) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "p-5 flex flex-col md:flex-row gap-6 md:items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-12 rounded-full bg-[var(--surface-elevated)] border border-[var(--glass-border)] flex items-center justify-center flex-shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-6 h-6 text-[var(--muted-foreground)]" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/admin/contractors/$id",
										params: { id: contractor.id },
										className: "text-lg font-semibold hover:underline truncate",
										children: contractor.companyName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: contractor.status })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-[var(--muted-foreground)]",
									children: ["Reg: ", contractor.registrationNumber]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2 mt-3",
									children: [contractor.specializationCategories.slice(0, 2).map((spec) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "px-2 py-0.5 rounded text-xs bg-[var(--background)] border border-[var(--glass-border)]",
										children: spec
									}, spec)), contractor.specializationCategories.length > 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "px-2 py-0.5 rounded text-xs bg-[var(--background)] border border-[var(--glass-border)] text-[var(--muted-foreground)]",
										children: [
											"+",
											contractor.specializationCategories.length - 2,
											" more"
										]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row gap-3 items-center",
							children: [
								contractor.status === "PENDING_VERIFICATION" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleVerify(contractor.id),
									className: "action-btn w-full sm:w-auto flex items-center gap-2 press bg-[var(--success)]/10 text-[var(--success)] hover:bg-[var(--success)]/20 border-transparent",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4" }), " Verify"]
								}),
								contractor.status === "VERIFIED" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleSuspend(contractor.id),
									className: "action-btn w-full sm:w-auto flex items-center gap-2 press bg-[var(--critical)]/10 text-[var(--critical)] hover:bg-[var(--critical)]/20 border-transparent",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-4 h-4" }), " Suspend"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin/contractors/$id",
									params: { id: contractor.id },
									className: "action-btn w-full sm:w-auto text-center",
									children: "View Details"
								})
							]
						})
					]
				}, contractor.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-12 text-center text-[var(--muted-foreground)] border border-dashed border-[var(--glass-border)] rounded-lg",
					children: "No contractors found matching your criteria."
				})]
			})
		]
	});
}
function StatusBadge({ status }) {
	if (status === "VERIFIED") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20 flex items-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-3 h-3" }), " Verified"]
	});
	if (status === "PENDING_VERIFICATION") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/20 flex items-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-3 h-3" }), " Pending"]
	});
	if (status === "SUSPENDED") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--critical)]/10 text-[var(--critical)] border border-[var(--critical)]/20 flex items-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-3 h-3" }), " Suspended"]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-[var(--muted-foreground)]",
		children: status
	});
}
//#endregion
export { ContractorsList as component };
