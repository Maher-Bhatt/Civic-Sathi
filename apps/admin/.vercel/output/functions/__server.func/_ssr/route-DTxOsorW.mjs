import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate, d as Outlet, h as Link, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Building2, _ as LayoutDashboard, a as Timer, c as Settings, h as LogOut, n as Users, o as Shield, p as Menu, t as X, y as ClipboardList } from "../_libs/lucide-react.mjs";
import { r as useAdminAuth, y as useI18n } from "./router-D6dif84W.mjs";
import { n as LoadingState } from "./states-BSypa5q_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-DTxOsorW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminAuthGate({ children }) {
	const { admin, ready } = useAdminAuth();
	useNavigate();
	(0, import_react.useEffect)(() => {
		if (ready && !admin) window.location.replace("/login");
	}, [ready, admin]);
	if (!ready || !admin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: ready ? "Redirecting to admin sign in..." : "Loading admin session..." })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function AdminLayout() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminAuthGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminDashboard, {}) });
}
var navItems = [
	{
		label: "Dashboard",
		icon: LayoutDashboard,
		to: "/admin/dashboard"
	},
	{
		label: "Users",
		icon: Users,
		to: "/admin/users"
	},
	{
		label: "Contractors",
		icon: Building2,
		to: "/admin/contractors/"
	},
	{
		label: "Work Orders",
		icon: ClipboardList,
		to: "/admin/work-orders-overview"
	},
	{
		label: "SLA Config",
		icon: Timer,
		to: "/admin/sla"
	},
	{
		label: "Audit Logs",
		icon: Shield,
		to: "/admin/audit-logs"
	},
	{
		label: "Settings",
		icon: Settings,
		to: "/admin/settings"
	}
];
function AdminDashboard() {
	const { t } = useI18n();
	const { admin, signOut } = useAdminAuth();
	const { navigate } = useRouter();
	const [mobileMenuOpen, setMobileMenuOpen] = (0, import_react.useState)(false);
	const handleSignOut = () => {
		signOut();
		toast.success("Signed out successfully");
		navigate({
			to: "/admin/login",
			replace: true
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[var(--background)] text-[var(--foreground)] flex",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: `
        fixed inset-y-0 left-0 z-50 w-64 glass-strong border-r border-[var(--glass-border)]
        transform transition-transform duration-200 ease-in-out lg:translate-x-0
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        flex flex-col
      `,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "h-16 flex items-center px-6 border-b border-[var(--glass-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-6 h-6 mr-3 text-[var(--foreground)]" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold tracking-wide text-lg",
							children: t("ui.janmind_admin")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "ml-auto lg:hidden p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
							onClick: () => setMobileMenuOpen(false),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex-1 overflow-y-auto p-4 space-y-1",
					children: navItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						onClick: () => setMobileMenuOpen(false),
						className: "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-[var(--surface-elevated)]",
						activeProps: { className: "bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-[var(--foreground)]" },
						inactiveProps: { className: "text-[var(--muted-foreground)]" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "w-5 h-5" }), item.label]
					}, item.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-t border-[var(--glass-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 px-3 py-3 rounded-md bg-[var(--surface-elevated)] border border-[var(--glass-border)] mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-8 h-8 rounded-full bg-[var(--background)] border border-[var(--glass-border)] flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold",
								children: admin?.name?.charAt(0) || "A"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium truncate",
								children: admin?.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[var(--muted-foreground)] truncate",
								children: admin?.role
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleSignOut,
						className: "w-full flex items-center gap-2 justify-center px-4 py-2 text-sm text-[var(--critical)] hover:bg-[var(--critical)]/10 rounded-md transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-4 h-4" }), t("ui.sign_out")]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "flex-1 lg:pl-64 min-w-0 flex flex-col min-h-screen relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "h-16 glass sticky top-0 z-40 border-b border-[var(--glass-border)] flex items-center px-4 lg:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "lg:hidden p-2 mr-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-md hover:bg-[var(--surface-elevated)]",
					onClick: () => setMobileMenuOpen(true),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "w-5 h-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 p-4 lg:p-8 w-full max-w-7xl mx-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			})]
		})]
	});
}
//#endregion
export { AdminLayout as component };
