import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Check, b as Copy, d as Plus, m as MapPin, n as Users, o as Shield, t as X, v as Key, w as Building2, x as ClipboardList, y as FileText } from "../_libs/lucide-react.mjs";
import { S as useI18n, a as createUser, c as getCachedPlatformStats, i as createRealContractor, l as getCachedWorkOrders, p as getPlatformStats, v as listRealWorkOrders } from "./router-BfY5w09t.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CoNgXAty.mjs";
import { a as Bar, c as Tooltip, i as CartesianGrid, n as YAxis, o as Cell, r as XAxis, s as ResponsiveContainer, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-BWwdzq6g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_COLORS = {
	"DRAFT": "#6c757d",
	"PUBLISHED": "#3498db",
	"IN PROGRESS": "#f39c12",
	"COMPLETED": "#27ae60",
	"INSPECTION PENDING": "#9b59b6",
	"INSPECTION FAILED": "#e74c3c",
	"REWORK": "#e67e22",
	"CANCELLED": "#95a5a6",
	"CLOSED": "#1abc9c"
};
var DEMO_LOGINS = [
	{
		role: "Super Admin",
		portal: "Admin Portal",
		url: "https://janmind-admin.vercel.app",
		email: "admin@janmind.in",
		pass: "Janmind@2026",
		badge: "bg-red-500/20 text-red-400 border-red-500/30"
	},
	{
		role: "Municipal Officer (Vadodara)",
		portal: "Municipality Console",
		url: "https://janmind-municipality.vercel.app",
		email: "officer@vmc.gov.in",
		pass: "Janmind@2026",
		badge: "bg-blue-500/20 text-blue-400 border-blue-500/30"
	},
	{
		role: "Municipal Officer (Bengaluru)",
		portal: "Municipality Console",
		url: "https://janmind-municipality.vercel.app",
		email: "officer@bbmp.gov.in",
		pass: "Janmind@2026",
		badge: "bg-blue-500/20 text-blue-400 border-blue-500/30"
	},
	{
		role: "Municipal Supervisor",
		portal: "Municipality Console",
		url: "https://janmind-municipality.vercel.app",
		email: "supervisor@vmc.gov.in",
		pass: "Janmind@2026",
		badge: "bg-orange-500/20 text-orange-400 border-orange-500/30"
	},
	{
		role: "Municipality Dept Head",
		portal: "Municipality Console",
		url: "https://janmind-municipality.vercel.app",
		email: "municipality@vmc.gov.in",
		pass: "Janmind@2026",
		badge: "bg-purple-500/20 text-purple-400 border-purple-500/30"
	},
	{
		role: "Contractor Field Lead",
		portal: "Contractor Portal",
		url: "https://janmind-contractor.vercel.app",
		email: "contractor@bharat.in",
		pass: "Janmind@2026",
		badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
	}
];
function AdminDashboardContent() {
	const { t } = useI18n();
	const [stats, setStats] = (0, import_react.useState)(() => getCachedPlatformStats());
	const [workOrders, setWOs] = (0, import_react.useState)(() => (getCachedWorkOrders() || []).slice(0, 8));
	const [copiedKey, setCopiedKey] = (0, import_react.useState)(null);
	const [showOfficerModal, setShowOfficerModal] = (0, import_react.useState)(false);
	const [showContractorModal, setShowContractorModal] = (0, import_react.useState)(false);
	const [savingUser, setSavingUser] = (0, import_react.useState)(false);
	const [officerForm, setOfficerForm] = (0, import_react.useState)({
		name: "",
		email: "",
		password: "Janmind@2026",
		role: "officer",
		city: "vadodara",
		department: "Roads",
		phone: ""
	});
	const [contractorForm, setContractorForm] = (0, import_react.useState)({
		company_name: "",
		contact_person: "",
		email: "",
		phone: "",
		login_email: "",
		login_password: "Janmind@2026"
	});
	(0, import_react.useEffect)(() => {
		let isMounted = true;
		const loadBackground = async () => {
			try {
				const [s, w] = await Promise.all([getPlatformStats(), listRealWorkOrders()]);
				if (isMounted) {
					if (s) setStats(s);
					if (w) setWOs(w.slice(0, 8));
				}
			} catch (e) {}
		};
		loadBackground();
		return () => {
			isMounted = false;
		};
	}, []);
	const handleCopy = (text, key) => {
		navigator.clipboard.writeText(text);
		setCopiedKey(key);
		toast.success(`Copied: ${text}`);
		setTimeout(() => setCopiedKey(null), 2e3);
	};
	const handleCreateOfficer = async (e) => {
		e.preventDefault();
		if (!officerForm.name.trim() || !officerForm.email.trim()) {
			toast.error("Please fill in name and email");
			return;
		}
		setSavingUser(true);
		try {
			await createUser(officerForm);
			toast.success(`Officer ${officerForm.name} created successfully!`);
			setShowOfficerModal(false);
			setOfficerForm({
				name: "",
				email: "",
				password: "Janmind@2026",
				role: "officer",
				city: "vadodara",
				department: "Roads",
				phone: ""
			});
			getPlatformStats().then(setStats).catch(() => {});
		} catch (err) {
			toast.error(err.message ?? "Failed to create officer");
		} finally {
			setSavingUser(false);
		}
	};
	const handleCreateContractor = async (e) => {
		e.preventDefault();
		if (!contractorForm.company_name.trim() || !contractorForm.email.trim()) {
			toast.error("Please fill in company name and email");
			return;
		}
		setSavingUser(true);
		try {
			await createRealContractor({
				...contractorForm,
				login_email: contractorForm.login_email || contractorForm.email
			});
			toast.success(`Contractor "${contractorForm.company_name}" registered successfully!`);
			setShowContractorModal(false);
			setContractorForm({
				company_name: "",
				contact_person: "",
				email: "",
				phone: "",
				login_email: "",
				login_password: "Janmind@2026"
			});
			getPlatformStats().then(setStats).catch(() => {});
		} catch (err) {
			toast.error(err.message ?? "Failed to register contractor");
		} finally {
			setSavingUser(false);
		}
	};
	const woStatusCounts = workOrders.reduce((acc, wo) => {
		acc[wo.status] = (acc[wo.status] ?? 0) + 1;
		return acc;
	}, {});
	const chartData = Object.entries(woStatusCounts).map(([status, count]) => ({
		name: status.replace(/_/g, " "),
		count
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8 muni-page-enter",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.live_platform_data") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold tracking-tight",
						children: t("ui.platform_dashboard")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[var(--muted-foreground)]",
						children: "Real-time governance, officer provisioning & civic intelligence"
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setShowOfficerModal(true),
							className: "flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), "Add Municipal Officer"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setShowContractorModal(true),
							className: "flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/30 transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-4 h-4" }), "Add Contractor"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin/users",
							className: "flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-xs font-semibold hover:bg-[var(--surface)] transition text-[var(--foreground)]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-4 h-4" }), "Manage Users"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: t("ui.total_users"),
						value: stats?.total_users ?? 0,
						icon: Users
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: t("ui.officers"),
						value: stats?.total_officers ?? 0,
						icon: Shield
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: t("ui.contractors"),
						value: stats?.total_contractors ?? 0,
						icon: Building2
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: t("ui.active_work"),
						value: stats?.active_work_orders ?? 0,
						icon: ClipboardList,
						accent: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: t("ui.open_complaints"),
						value: stats?.open_complaints ?? 0,
						icon: FileText,
						alert: (stats?.open_complaints ?? 0) > 100
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: t("ui.cities"),
						value: stats?.total_cities ?? 0,
						icon: MapPin,
						accent: "success"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-3 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[var(--muted-foreground)] text-sm",
							children: t("ui.total_complaints")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-bold mt-1",
							children: (stats?.total_complaints ?? 0).toLocaleString("en-IN")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[var(--muted-foreground)] text-sm",
							children: t("ui.resolved")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-bold mt-1",
							style: { color: "#27ae60" },
							children: (stats?.resolved_complaints ?? 0).toLocaleString("en-IN")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[var(--muted-foreground)] text-sm",
							children: t("ui.civic_issues")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-bold mt-1",
							children: (stats?.total_issues ?? 0).toLocaleString("en-IN")
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "p-6 border-blue-500/30 bg-blue-950/10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "w-5 h-5 text-blue-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold text-[var(--foreground)]",
							children: "System & Demo Login Credentials"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-[var(--muted-foreground)]",
						children: "Click copy to test any portal"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3",
					children: DEMO_LOGINS.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--glass-border)] flex flex-col justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `px-2 py-0.5 rounded text-[10px] font-semibold border ${item.badge}`,
									children: item.role
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-[var(--muted-foreground)]",
									children: item.portal
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-mono font-medium text-[var(--foreground)] truncate select-all",
								children: item.email
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] font-mono text-[var(--muted-foreground)] mt-0.5",
								children: ["Password: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[var(--foreground)] font-semibold",
									children: item.pass
								})]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 pt-1 border-t border-[var(--glass-border)]/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleCopy(item.email, `email_${idx}`),
								className: "flex-1 flex items-center justify-center gap-1 py-1 rounded bg-[var(--surface)] text-[11px] font-medium text-[var(--muted-foreground)] hover:text-white hover:bg-[var(--glass-border)] transition",
								children: [copiedKey === `email_${idx}` ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3 h-3 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-3 h-3" }), "Copy ID"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleCopy(item.pass, `pass_${idx}`),
								className: "flex-1 flex items-center justify-center gap-1 py-1 rounded bg-[var(--surface)] text-[11px] font-medium text-[var(--muted-foreground)] hover:text-white hover:bg-[var(--glass-border)] transition",
								children: [copiedKey === `pass_${idx}` ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3 h-3 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "w-3 h-3" }), "Copy Pass"]
							})]
						})]
					}, idx))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.work_order_status_distribution") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-56 mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: chartData,
								margin: {
									top: 5,
									right: 20,
									left: -15,
									bottom: 5
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: chartData.map((entry, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: `barGrad${i}`,
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "0%",
											stopColor: STATUS_COLORS[entry.name] ?? "#3d9970",
											stopOpacity: 1
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "100%",
											stopColor: STATUS_COLORS[entry.name] ?? "#3d9970",
											stopOpacity: .6
										})]
									}, entry.name)) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										vertical: false,
										stroke: "rgba(255,255,255,0.08)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "name",
										tick: {
											fontSize: 10,
											fill: "var(--muted-foreground)"
										},
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tick: {
											fontSize: 10,
											fill: "var(--muted-foreground)"
										},
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										cursor: { fill: "rgba(255,255,255,0.05)" },
										contentStyle: {
											backgroundColor: "var(--surface-elevated)",
											border: "1px solid var(--glass-border)",
											borderRadius: "10px",
											fontSize: "12px",
											boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "count",
										radius: [
											6,
											6,
											0,
											0
										],
										maxBarSize: 56,
										children: chartData.map((entry, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: `url(#barGrad${i})` }, entry.name))
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.recent_work_orders") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-2",
						children: [workOrders.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[var(--muted-foreground)] text-sm py-4 text-center",
							children: t("ui.no_work_orders_yet")
						}), workOrders.map((wo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between py-2 border-b border-[var(--glass-border)]/40 last:border-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium text-sm truncate",
									children: wo.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-[var(--muted-foreground)] truncate",
									children: [
										wo.contractor_name,
										" · ",
										wo.city
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "ml-3 flex-shrink-0 text-[10px] font-semibold px-2.5 py-0.5 rounded-full",
								style: {
									background: `${STATUS_COLORS[wo.status?.replace(/_/g, " ")] ?? "#3d9970"}20`,
									color: STATUS_COLORS[wo.status?.replace(/_/g, " ")] ?? "#3d9970",
									border: `1px solid ${STATUS_COLORS[wo.status?.replace(/_/g, " ")] ?? "#3d9970"}40`
								},
								children: wo.status?.replace(/_/g, " ")
							})]
						}, wo.id))]
					})]
				})]
			}),
			showOfficerModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-lg bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-2xl space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-[var(--glass-border)] pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-5 h-5 text-blue-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-bold",
								children: "Add Municipal Officer / Supervisor"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowOfficerModal(false),
							className: "text-[var(--muted-foreground)] hover:text-white",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreateOfficer,
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-[var(--muted-foreground)]",
									children: "Full Name *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									placeholder: "e.g. Ramesh Patel",
									value: officerForm.name,
									onChange: (e) => setOfficerForm({
										...officerForm,
										name: e.target.value
									}),
									className: "w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm focus:outline-none focus:border-[var(--primary)]"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-[var(--muted-foreground)]",
									children: "Email (Login ID) *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									required: true,
									placeholder: "officer@vmc.gov.in",
									value: officerForm.email,
									onChange: (e) => setOfficerForm({
										...officerForm,
										email: e.target.value
									}),
									className: "w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm focus:outline-none focus:border-[var(--primary)]"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-semibold text-[var(--muted-foreground)]",
										children: "Role *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: officerForm.role,
										onChange: (e) => setOfficerForm({
											...officerForm,
											role: e.target.value
										}),
										className: "w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "officer",
												children: "Officer"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "supervisor",
												children: "Supervisor"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "municipality",
												children: "Municipality"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "admin",
												children: "Admin"
											})
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-semibold text-[var(--muted-foreground)]",
										children: "City *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: officerForm.city,
										onChange: (e) => setOfficerForm({
											...officerForm,
											city: e.target.value
										}),
										className: "w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "vadodara",
												children: "Vadodara"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "bengaluru",
												children: "Bengaluru"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "mumbai",
												children: "Mumbai"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "delhi",
												children: "Delhi"
											})
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-semibold text-[var(--muted-foreground)]",
										children: "Department"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: officerForm.department,
										onChange: (e) => setOfficerForm({
											...officerForm,
											department: e.target.value
										}),
										className: "w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Roads",
												children: "Roads"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Water Supply",
												children: "Water Supply"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Sanitation",
												children: "Sanitation"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Drainage",
												children: "Drainage"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Electricity",
												children: "Electricity"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Administration",
												children: "Administration"
											})
										]
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-[var(--muted-foreground)]",
									children: "Password *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									required: true,
									value: officerForm.password,
									onChange: (e) => setOfficerForm({
										...officerForm,
										password: e.target.value
									}),
									className: "w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm font-mono"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-[var(--muted-foreground)]",
									children: "Phone"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "+91 98250 12345",
									value: officerForm.phone,
									onChange: (e) => setOfficerForm({
										...officerForm,
										phone: e.target.value
									}),
									className: "w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2 pt-3 border-t border-[var(--glass-border)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowOfficerModal(false),
									className: "px-4 py-2 rounded-lg text-xs font-semibold text-[var(--muted-foreground)] hover:bg-[var(--surface)]",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: savingUser,
									className: "px-5 py-2 rounded-lg bg-[var(--primary)] text-white text-xs font-semibold hover:opacity-90 transition disabled:opacity-50",
									children: savingUser ? "Saving..." : "Create Officer Account"
								})]
							})
						]
					})]
				})
			}),
			showContractorModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-lg bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-2xl p-6 shadow-2xl space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-[var(--glass-border)] pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-5 h-5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-bold",
								children: "Add / Register Contractor"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowContractorModal(false),
							className: "text-[var(--muted-foreground)] hover:text-white",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreateContractor,
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-[var(--muted-foreground)]",
									children: "Company Name *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									placeholder: "e.g. Apex Civil Works Ltd",
									value: contractorForm.company_name,
									onChange: (e) => setContractorForm({
										...contractorForm,
										company_name: e.target.value
									}),
									className: "w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-[var(--muted-foreground)]",
									children: "Contact Person *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									placeholder: "e.g. Rajesh Shah",
									value: contractorForm.contact_person,
									onChange: (e) => setContractorForm({
										...contractorForm,
										contact_person: e.target.value
									}),
									className: "w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-[var(--muted-foreground)]",
									children: "Company Email *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									required: true,
									placeholder: "contact@apex.in",
									value: contractorForm.email,
									onChange: (e) => setContractorForm({
										...contractorForm,
										email: e.target.value
									}),
									className: "w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-[var(--muted-foreground)]",
									children: "Phone *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									required: true,
									placeholder: "+91 98254 99887",
									value: contractorForm.phone,
									onChange: (e) => setContractorForm({
										...contractorForm,
										phone: e.target.value
									}),
									className: "w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3 pt-2 border-t border-[var(--glass-border)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-[var(--muted-foreground)]",
									children: "Portal Login Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "email",
									placeholder: "Leave empty to use company email",
									value: contractorForm.login_email,
									onChange: (e) => setContractorForm({
										...contractorForm,
										login_email: e.target.value
									}),
									className: "w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm font-mono"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-[var(--muted-foreground)]",
									children: "Portal Password"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "password",
									required: true,
									value: contractorForm.login_password,
									onChange: (e) => setContractorForm({
										...contractorForm,
										login_password: e.target.value
									}),
									className: "w-full mt-1 px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--glass-border)] text-sm font-mono"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2 pt-3 border-t border-[var(--glass-border)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowContractorModal(false),
									className: "px-4 py-2 rounded-lg text-xs font-semibold text-[var(--muted-foreground)] hover:bg-[var(--surface)]",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									disabled: savingUser,
									className: "px-5 py-2 rounded-lg bg-amber-500 text-black font-bold text-xs hover:opacity-90 transition disabled:opacity-50",
									children: savingUser ? "Registering..." : "Register Contractor"
								})]
							})
						]
					})]
				})
			})
		]
	});
}
function StatCard({ title, value, icon: Icon, suffix = "", alert = false, accent = "default" }) {
	const { t } = useI18n();
	const accentColor = alert ? "var(--critical)" : accent === "success" ? "#27ae60" : accent === "warning" ? "#f39c12" : "var(--primary)";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
		className: "p-4 relative overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-0 left-0 w-1 h-full rounded-l-xl",
				style: { background: accentColor }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-2 pl-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-1.5 rounded-lg",
					style: { background: `${accentColor}20` },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						className: "w-3.5 h-3.5",
						style: { color: accentColor }
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-2xl font-bold pl-2",
				style: { color: alert ? accentColor : void 0 },
				children: [value.toLocaleString("en-IN"), suffix]
			})
		]
	});
}
//#endregion
export { AdminDashboardContent as component };
