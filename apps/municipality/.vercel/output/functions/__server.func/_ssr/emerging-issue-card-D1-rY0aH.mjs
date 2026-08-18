import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as useI18n } from "./router-5cAWMaYB.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CtvEoNHg.mjs";
import { t as GlassButton } from "./glass-button-BU7SWYxP.mjs";
import { H as ArrowUpRight, o as TrendingUp, s as TrendingDown } from "../_libs/lucide-react.mjs";
import { o as riskLevel } from "./types-CjX07JOU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/emerging-issue-card-D1-rY0aH.js
var import_jsx_runtime = require_jsx_runtime();
function EmergingIssueCard({ issue, className, delay = 0 }) {
	const { t } = useI18n();
	const up = issue.trendPct >= 0;
	const level = riskLevel(issue.riskScore);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
		elevation: "raised",
		interactive: true,
		className: cn("animate-rise group p-5", className),
		style: { animationDelay: `${delay}ms` },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.emerging_systemic_issue") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-semibold tracking-tight",
					children: issue.category
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [
						issue.areaName,
						" · ",
						issue.ward
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("shrink-0 rounded-full border px-2.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider", level === "Critical" ? "border-critical/40 bg-critical/10 text-critical" : level === "High" ? "border-[#a4503f]/40 bg-[#a4503f]/10 text-[#a4503f]" : "border-warning/40 bg-warning/10 text-warning"),
					children: level
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-3 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-xs",
						children: t("ui.reports")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-xl font-semibold tabular-nums",
						children: issue.complaintCount
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-xs",
						children: t("ui.risk")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 text-xl font-semibold tabular-nums",
						children: [issue.riskScore, "/100"]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-xs",
						children: t("ui.trend")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: cn("mt-0.5 flex items-center gap-1 text-xl font-semibold tabular-nums", up ? "text-[#a4503f]" : "text-primary"),
						children: [
							up ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-4 w-4" }),
							up ? "+" : "",
							issue.trendPct,
							"%"
						]
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-2 border-t border-[var(--glass-border)] pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-xs",
					children: t("ui.dominant_issue")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-foreground",
					children: issue.dominantIssue
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "label-xs",
					children: t("ui.possible_cause")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: issue.possibleCause
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
				variant: "glass",
				size: "sm",
				className: "mt-5 w-full",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/issues/$id",
					params: { id: issue.id },
					children: [t("ui.view_intelligence"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" })]
				})
			})
		]
	});
}
//#endregion
export { EmergingIssueCard as t };
