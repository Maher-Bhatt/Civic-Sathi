import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate, d as Outlet, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useContractorAuth } from "./router-jtyPcFVN.mjs";
import { c as LogOut, g as ClipboardList, p as FileText, r as TrendingUp, t as User, u as LayoutDashboard } from "../_libs/lucide-react.mjs";
import { n as LoadingState } from "./states-BSypa5q_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-Dpxkwn4E.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ContractorAuthGate({ children }) {
	const { contractor, ready } = useContractorAuth();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (ready && !contractor) navigate({
			to: "/login",
			replace: true
		});
	}, [
		ready,
		contractor,
		navigate
	]);
	if (!ready || !contractor) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: ready ? "Redirecting to contractor sign in..." : "Loading contractor session..." })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function ContractorLayoutRoute() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContractorAuthGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContractorLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) });
}
function ContractorLayout({ children }) {
	const { contractor, signOut } = useContractorAuth();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-64 border-r border-[var(--glass-border)] bg-[var(--surface)] flex flex-col glass z-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "h-16 flex items-center px-6 border-b border-[var(--glass-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xl font-bold tracking-tight text-[var(--foreground)]",
						children: "JANMIND"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 text-xs px-2 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20",
						children: "Contractor"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex-1 py-4 px-3 space-y-1 overflow-y-auto",
					children: [
						{
							label: "Dashboard",
							icon: LayoutDashboard,
							to: "/contractor/dashboard"
						},
						{
							label: "Tenders & Bids",
							icon: FileText,
							to: "/contractor/tenders"
						},
						{
							label: "Work Orders",
							icon: ClipboardList,
							to: "/contractor/work-orders"
						},
						{
							label: "Performance",
							icon: TrendingUp,
							to: "/contractor/performance"
						},
						{
							label: "Profile",
							icon: User,
							to: "/contractor/profile"
						}
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: item.to,
						className: "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-[var(--surface-elevated)] text-[var(--muted-foreground)] [&.active]:text-[var(--foreground)] [&.active]:bg-[var(--surface-elevated)] [&.active]:border [&.active]:border-[var(--glass-border)]",
						activeProps: { className: "active" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { size: 18 }), item.label]
					}, item.to))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-t border-[var(--glass-border)] bg-[var(--surface-elevated)]/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-8 h-8 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center font-semibold text-sm border border-[var(--primary)]/30",
							children: contractor?.name?.substring(0, 2).toUpperCase() || "CN"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium truncate",
								children: contractor?.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-[var(--muted-foreground)] truncate",
								children: contractor?.email
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => signOut(),
						className: "flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--critical)] hover:bg-[var(--critical)]/10 rounded-md transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { size: 16 }), "Sign Out"]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "flex-1 flex flex-col min-w-0 overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "h-16 border-b border-[var(--glass-border)] bg-[var(--surface)]/80 backdrop-blur-md flex items-center px-6 shrink-0 z-10 glass-strong",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-medium text-[var(--muted-foreground)]",
					children: "Contractor Portal"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto p-6 md:p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-w-6xl mx-auto w-full",
					children
				})
			})]
		})]
	});
}
//#endregion
export { ContractorLayoutRoute as component };
