import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { u as useI18n } from "./router-BreDjdEy.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CtvEoNHg.mjs";
import { t as COMPLAINT_STATUSES } from "./types-CjX07JOU.mjs";
import { r as format } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/investigation-timeline-DcBH90C_.js
var import_jsx_runtime = require_jsx_runtime();
function InvestigationTimeline({ events, currentStatus }) {
	const { t } = useI18n();
	const statusIdx = currentStatus ? COMPLAINT_STATUSES.indexOf(currentStatus) : -1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
		elevation: "raised",
		className: "p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.officer_activity_timeline") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mt-5 space-y-0",
			children: COMPLAINT_STATUSES.map((step, i) => {
				const event = events.find((e) => e.label.toLowerCase().includes(step.toLowerCase().split(" ")[0] ?? ""));
				const done = statusIdx >= i;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "relative flex gap-4 pb-6 last:pb-0",
					children: [
						i < COMPLAINT_STATUSES.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute left-[11px] top-6 h-full w-px", done ? "bg-primary/40" : "bg-[var(--glass-border)]") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.65rem] font-medium transition-colors duration-300", done ? "border-primary bg-primary/20 text-primary" : "border-[var(--glass-border)] bg-[var(--glass)] text-muted-foreground"),
							children: i + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1 pt-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn("text-sm font-medium", !done && "text-muted-foreground"),
								children: step
							}), event && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [format(new Date(event.at), "HH:mm"), event.actor && ` · ${event.actor}`]
							}) })]
						})
					]
				}, step);
			})
		})]
	});
}
function FieldActionCard({ area, priority, recommendations, onAssign, onAcknowledge, onStart, onComplete }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
		elevation: "raised",
		className: "p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.field_action") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: t("ui.area")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: area
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: t("ui.priority")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-critical",
							children: priority
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "label-xs mb-2",
						children: t("ui.recommended")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1",
						children: recommendations.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-sm text-muted-foreground",
							children: ["· ", r]
						}, r))
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap gap-2",
				children: [
					onAssign && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onAssign,
						className: "action-btn",
						children: t("ui.assign")
					}),
					onAcknowledge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onAcknowledge,
						className: "action-btn",
						children: t("ui.acknowledge")
					}),
					onStart && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onStart,
						className: "action-btn primary",
						children: t("ui.start")
					}),
					onComplete && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onComplete,
						className: "action-btn",
						children: t("ui.complete")
					})
				]
			})
		]
	});
}
//#endregion
export { InvestigationTimeline as n, FieldActionCard as t };
