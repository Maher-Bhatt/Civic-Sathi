import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { I as Clock, J as ArrowLeft, M as HardHat, R as CircleCheck, V as Check, W as Building2 } from "../_libs/lucide-react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as PageShell, m as getComplaint, o as SectionLabel, r as GlassCard } from "./glass-card-BssLVty0.mjs";
import { i as LoadingState, r as ErrorState, t as AuthGate } from "./require-auth-U5VF4pEa.mjs";
import { n as StatusBadge, t as SeverityBadge } from "./badges-DpyCGGYj.mjs";
import { a as clustersForCity, s as nearestCity } from "./cities-DkNmkOQx.mjs";
import { r as cn } from "./router-BpQlMeTC.mjs";
import { t as Route } from "./router-BpQlMeTC2.mjs";
import { n as ClientCityMap } from "./city-map-panel-mVJWF3dV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/complaint._id-CZOGzLjh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ComplaintTimeline({ events }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "relative space-y-0",
		children: events.map((e, i) => {
			const last = i === events.length - 1;
			const current = !e.done && (i === 0 || !!events[i - 1]?.done);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "animate-rise relative flex gap-4 pb-7 last:pb-0",
				style: { animationDelay: `${i * 90}ms` },
				children: [
					!last && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						className: "absolute top-7 left-[13px] h-[calc(100%-1.75rem)] w-px",
						style: { background: e.done ? "color-mix(in oklab, var(--primary) 45%, transparent)" : "var(--border)" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": true,
						className: cn("z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-300", e.done ? "border-[color-mix(in_oklab,var(--primary)_55%,transparent)] bg-[color-mix(in_oklab,var(--primary)_18%,transparent)] text-primary" : current ? "border-primary bg-[var(--glass-strong)] text-primary shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_12%,transparent)]" : "border-border bg-[var(--glass)] text-subtle"),
						children: e.done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-current" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 pt-0.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: cn("text-sm font-medium", e.done || current ? "text-foreground" : "text-muted-foreground"),
								children: [e.label, current && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 rounded-full border border-[color-mix(in_oklab,var(--primary)_45%,transparent)] px-2 py-0.5 text-[0.6rem] tracking-[0.12em] text-primary uppercase",
									children: "Current"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-xs text-subtle",
								children: e.description
							}),
							e.at && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[0.68rem] tracking-[0.08em] text-subtle uppercase",
								children: new Date(e.at).toLocaleString(void 0, {
									day: "2-digit",
									month: "short",
									hour: "2-digit",
									minute: "2-digit"
								})
							})
						]
					})
				]
			}, e.label);
		})
	});
}
function useWorkExecutionStatus(complaintId) {
	const [info, setInfo] = (0, import_react.useState)({ hasWorkOrder: false });
	(0, import_react.useEffect)(() => {
		try {
			const wo = JSON.parse(localStorage.getItem("janmind.work_orders") ?? "[]").find((o) => o.relatedComplaintIds.includes(complaintId));
			if (!wo) return;
			const progress = JSON.parse(localStorage.getItem("janmind.field_progress") ?? "[]");
			const woFull = JSON.parse(localStorage.getItem("janmind.work_orders") ?? "[]").find((o) => o.relatedComplaintIds.includes(complaintId));
			const latestProgress = woFull ? progress.filter((p) => p.workOrderId === woFull.id).sort((a, b) => b.percentComplete - a.percentComplete)[0] : null;
			setInfo({
				hasWorkOrder: true,
				contractorCompany: wo.contractorName,
				workOrderStatus: wo.status,
				...latestProgress?.percentComplete !== void 0 ? { progressPercent: latestProgress.percentComplete } : {},
				department: wo.department
			});
		} catch {}
	}, [complaintId]);
	return info;
}
var WO_STATUS_PUBLIC = {
	PENDING_ACCEPTANCE: {
		label: "Contractor Notified",
		desc: "A contractor has been assigned and notified."
	},
	ACCEPTED: {
		label: "Contractor Assigned",
		desc: "Contractor has confirmed and is preparing to mobilize."
	},
	MOBILIZATION: {
		label: "Mobilization",
		desc: "Contractor is mobilizing equipment and materials."
	},
	IN_PROGRESS: {
		label: "Work In Progress",
		desc: "Physical work is underway at the site."
	},
	SUBMITTED_FOR_INSPECTION: {
		label: "Inspection Pending",
		desc: "Work submitted. Municipal inspection is scheduled."
	},
	INSPECTION_FAILED: {
		label: "Rework Required",
		desc: "Inspection identified issues. Contractor is addressing them."
	},
	REWORK: {
		label: "Rework In Progress",
		desc: "Contractor is correcting identified issues."
	},
	INSPECTION_PASSED: {
		label: "Inspection Passed",
		desc: "Work passed municipal quality inspection."
	},
	COMPLETED: {
		label: "Work Completed",
		desc: "Physical work has been completed and verified."
	},
	CLOSED: {
		label: "Resolved",
		desc: "Work is complete and complaint has been resolved."
	}
};
function ComplaintDetail() {
	const { id } = Route.useParams();
	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ["complaint", id],
		queryFn: () => getComplaint(id)
	});
	const workInfo = useWorkExecutionStatus(id);
	const city = data ? nearestCity(data.location.lat, data.location.lng) : null;
	const getRelatedSamples = (category) => {
		const cat = category.toLowerCase();
		if (cat.includes("water")) return [
			"No water supply for 2 days",
			"Contaminated drinking water",
			"Low water pressure in morning"
		];
		if (cat.includes("garbage") || cat.includes("waste")) return [
			"Garbage not collected",
			"Overflowing community bin",
			"Debris dumped on sidewalk"
		];
		if (cat.includes("drainage") || cat.includes("sewage")) return [
			"Sewage overflow on street",
			"Blocked storm drain",
			"Foul smell from open drain"
		];
		if (cat.includes("light")) return [
			"Streetlights not working",
			"Pole leaning dangerously",
			"Lights blinking continuously"
		];
		return [
			"Pothole on main road",
			"Road cave-in near circle",
			"Broken asphalt after rain"
		];
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, {
		className: "max-w-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/complaints",
			className: "inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
				className: "h-4 w-4",
				"aria-hidden": true
			}), "My complaints"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5",
			children: [
				isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading complaint..." }),
				isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
					description: "We couldn't load this complaint.",
					onRetry: () => void refetch()
				}),
				data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "animate-rise flex flex-wrap items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
									className: "tabular-nums",
									children: data.id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: data.status }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { severity: data.severity })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							elevation: "raised",
							className: "animate-rise space-y-6 p-5 sm:p-7",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-xl font-semibold sm:text-2xl",
									children: data.category
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[0.98rem] leading-relaxed text-muted-foreground",
									children: data.description
								}),
								data.photo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: data.photo,
									alt: "Evidence submitted with this complaint",
									loading: "lazy",
									className: "h-56 w-full rounded-xl object-cover sm:h-72"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
									className: "grid gap-4 sm:grid-cols-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "label-xs",
											children: "Location"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "mt-1.5 text-sm font-medium",
											children: data.location.area
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "label-xs",
											children: "Submitted"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "mt-1.5 text-sm font-medium",
											children: new Date(data.createdAt).toLocaleString(void 0, {
												day: "2-digit",
												month: "short",
												year: "numeric",
												hour: "2-digit",
												minute: "2-digit"
											})
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "label-xs",
											children: "Related reports"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "mt-1.5 text-sm font-medium tabular-nums text-primary",
											children: data.relatedCount
										})] })
									]
								})
							]
						}),
						workInfo.hasWorkOrder && workInfo.workOrderStatus && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							elevation: "raised",
							className: "animate-rise p-5 sm:p-7",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardHat, { className: "h-4 w-4 text-[var(--primary)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Work Execution Status" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("rounded-full px-3 py-1 text-xs font-medium", workInfo.workOrderStatus === "CLOSED" || workInfo.workOrderStatus === "COMPLETED" ? "bg-[color-mix(in_oklab,var(--success)_15%,transparent)] text-[var(--success)]" : workInfo.workOrderStatus?.includes("FAIL") || workInfo.workOrderStatus === "REWORK" ? "bg-[color-mix(in_oklab,var(--warning)_15%,transparent)] text-[var(--warning)]" : "bg-[color-mix(in_oklab,var(--primary)_12%,transparent)] text-[var(--primary)]"),
											children: WO_STATUS_PUBLIC[workInfo.workOrderStatus]?.label ?? workInfo.workOrderStatus.replace(/_/g, " ")
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: WO_STATUS_PUBLIC[workInfo.workOrderStatus]?.desc ?? "Work is in progress."
									}),
									workInfo.contractorCompany && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4 text-muted-foreground" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Contractor:"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: workInfo.contractorCompany
											})
										]
									}),
									workInfo.progressPercent !== void 0 && workInfo.progressPercent > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-xs text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), " Work progress"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-semibold tabular-nums text-foreground",
												children: [workInfo.progressPercent, "%"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-2 overflow-hidden rounded-full bg-[var(--glass-border)]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-full rounded-full bg-[var(--primary)] transition-all duration-700",
												style: { width: `${workInfo.progressPercent}%` }
											})
										})]
									}),
									workInfo.workOrderStatus === "INSPECTION_PASSED" || workInfo.workOrderStatus === "COMPLETED" || workInfo.workOrderStatus === "CLOSED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 text-[var(--success)] text-sm font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), "Inspection passed — work quality verified by municipal engineer"]
									}) : null
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "animate-rise overflow-hidden p-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2 px-2.5 pt-2 pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Nearby civic activity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground",
										children: [data.nearbyCount, " similar reports within ~500m"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientCityMap, {
									cityId: city.id,
									clusters: clustersForCity(city.id),
									className: "h-[260px] sm:h-[320px]",
									focus: {
										lat: data.location.lat,
										lng: data.location.lng,
										zoom: 14
									},
									ariaLabel: `Map of civic activity near ${data.location.ward}`,
									showLegend: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-2 px-2.5 py-4",
									children: getRelatedSamples(data.category).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-start gap-2.5 text-sm text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-critical opacity-70" }),
											"\"",
											s,
											"\""
										]
									}, s))
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							elevation: "raised",
							className: "animate-rise p-5 sm:p-7",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
								className: "mb-5",
								children: "Timeline"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComplaintTimeline, { events: data.timeline })]
						})
					]
				})
			]
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGate, {
	redirectTo: "/complaints",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComplaintDetail, {})
});
//#endregion
export { SplitComponent as component };
