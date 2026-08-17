import { i as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as Route$7, k as getDepartment } from "./_ssr/router-Cd9GNziQ.mjs";
import { n as SectionLabel, t as GlassCard } from "./_ssr/glass-card-CtvEoNHg.mjs";
import { H as ArrowLeft } from "./_libs/lucide-react.mjs";
import { n as ErrorState, r as LoadingState } from "./_ssr/states-JpTLzdcL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-CkenQrrg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DepartmentDetailPage() {
	const { id } = Route$7.useParams();
	const [dept, setDept] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getDepartment(id).then((d) => {
			if (!d) setError(true);
			else setDept(d);
		}).catch(() => setError(true)).finally(() => setLoading(false));
	}, [id]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading department..." });
	if (error || !dept) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		description: "Department not found.",
		onRetry: () => window.location.reload()
	});
	const categories = Object.entries(dept.categoryBreakdown).sort((a, b) => b[1] - a[1]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "muni-page-enter space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/departments",
				className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "All departments"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Department Detail" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-2xl font-semibold",
					children: dept.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [
						"Average response time: ",
						dept.avgResponseDays.toFixed(1),
						" days"
					]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Open",
						value: dept.open
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Critical",
						value: dept.critical,
						accent: "critical"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "In progress",
						value: dept.inProgress
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Resolved",
						value: dept.resolved,
						accent: "success"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				elevation: "raised",
				className: "p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Category Breakdown" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-3",
					children: categories.map(([cat, count]) => {
						const max = categories[0]?.[1] ?? 1;
						const pct = Math.round(count / max * 100);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cat }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-muted-foreground",
								children: count
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--glass)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-primary transition-all duration-500",
								style: { width: `${pct}%` }
							})
						})] }, cat);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/complaints",
					search: { area: "" },
					className: "action-btn",
					children: "View department complaints"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/issues",
					className: "action-btn",
					children: "View emerging issues"
				})]
			})
		]
	});
}
function StatCard({ label, value, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
		elevation: "raised",
		className: "p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "label-xs",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `mt-1 text-2xl font-semibold tabular-nums ${accent === "critical" ? "text-critical" : accent === "success" ? "text-primary" : ""}`,
			children: value
		})]
	});
}
//#endregion
export { DepartmentDetailPage as component };
