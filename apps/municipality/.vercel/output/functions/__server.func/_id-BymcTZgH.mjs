import { i as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { L as getMuniComplaint, k as getCivicIssues, l as useMuniAuth, o as Route$9, u as useI18n } from "./_ssr/router-Cf3D64gF.mjs";
import { n as SectionLabel, t as GlassCard } from "./_ssr/glass-card-CtvEoNHg.mjs";
import { U as ArrowLeft } from "./_libs/lucide-react.mjs";
import { n as ErrorState, r as LoadingState } from "./_ssr/states-JpTLzdcL.mjs";
import { r as format } from "./_libs/date-fns.mjs";
import { CivicMap } from "./_ssr/civic-map-Dr5VfU_n.mjs";
import { n as SeverityBadge, r as StatusBadge } from "./_ssr/status-badge-DreJLRai.mjs";
import { n as InvestigationTimeline } from "./_ssr/investigation-timeline-DBQT6fpr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-BymcTZgH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ComplaintDetailPage() {
	const { t } = useI18n();
	const { id } = Route$9.useParams();
	const { officer } = useMuniAuth();
	const city = officer?.city ?? "vadodara";
	const [complaint, setComplaint] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(false);
	const [civicIssues, setCivicIssues] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		getMuniComplaint(id).then((c) => {
			if (!c) setError(true);
			else setComplaint(c);
		}).catch(() => setError(true)).finally(() => setLoading(false));
		getCivicIssues().then(setCivicIssues).catch(() => {});
	}, [id]);
	const allPoints = (0, import_react.useMemo)(() => {
		return civicIssues.map((ci) => {
			let issue = "other";
			const cat = (ci.category || "").toLowerCase();
			if (cat.includes("water")) issue = "water";
			else if (cat.includes("road") || cat.includes("pothole")) issue = "roads";
			else if (cat.includes("garbage") || cat.includes("waste")) issue = "garbage";
			else if (cat.includes("drainage")) issue = "drainage";
			else if (cat.includes("light")) issue = "lighting";
			let health = "low";
			const sev = (ci.severity || "").toLowerCase();
			if (sev === "critical") health = "critical";
			else if (sev === "high") health = "high";
			else if (sev === "moderate") health = "moderate";
			return {
				id: String(ci.id),
				areaId: String(ci.area || ""),
				issue,
				health,
				daysAgo: 0,
				lat: Number(ci.lat) || 0,
				lng: Number(ci.lng) || 0
			};
		});
	}, [civicIssues]);
	async function handleAssign(dept) {
		const updated = await (await import("./_libs/_.mjs").then((n) => n.i)).assignComplaint(id, {
			department: dept,
			...officer?.name ? { officer: officer.name } : {}
		});
		setComplaint(updated);
		toast.success(`Assigned to ${dept}`);
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading complaint..." });
	if (error || !complaint) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		description: "Complaint not found.",
		onRetry: () => window.location.reload()
	});
	const point = {
		id: complaint.id,
		lat: complaint.lat,
		lng: complaint.lng,
		issue: "other",
		health: "moderate",
		daysAgo: 0,
		areaId: complaint.area
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "muni-page-enter space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/complaints",
				search: { area: "" },
				className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), t("ui.all_complaints")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
						className: "tabular-nums",
						children: complaint.id
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: complaint.status }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { severity: complaint.severity })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 xl:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 xl:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							elevation: "raised",
							className: "p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.report_details") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-3 text-xl font-semibold",
									children: complaint.category
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm leading-relaxed text-muted-foreground",
									children: complaint.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
									className: "mt-6 grid gap-4 sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "label-xs",
											children: t("ui.area")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "mt-1 text-sm font-medium",
											children: complaint.area
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "label-xs",
											children: t("ui.ward")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "mt-1 text-sm font-medium",
											children: complaint.ward
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "label-xs",
											children: t("ui.department")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "mt-1 text-sm font-medium",
											children: complaint.department
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "label-xs",
											children: t("ui.assigned_to")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "mt-1 text-sm font-medium",
											children: complaint.assignedTo ?? "—"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "label-xs",
											children: t("ui.created")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "mt-1 text-sm",
											children: format(new Date(complaint.createdAt), "dd MMM yyyy, HH:mm")
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "label-xs",
											children: t("ui.last_updated")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "mt-1 text-sm",
											children: format(new Date(complaint.updatedAt), "dd MMM yyyy, HH:mm")
										})] })
									]
								})
							]
						}),
						complaint.aiAnalysis && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							elevation: "raised",
							className: "p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.ai_intelligence_analysis") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
									className: "mt-4 grid gap-3 sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "label-xs",
											children: t("ui.detected_category")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "mt-1 text-sm font-medium",
											children: complaint.aiAnalysis.category
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "label-xs",
											children: t("ui.urgency")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "text-sm font-medium",
											children: complaint.aiAnalysis?.sentiment
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "label-xs",
											children: t("ui.similarity_match")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
											className: "mt-1 text-sm tabular-nums",
											children: [complaint.aiAnalysis.similarity, "%"]
										})] }),
										complaint.aiAnalysis.cluster && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "sm:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
												className: "label-xs",
												children: t("ui.cluster")
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
												className: "mt-1 text-sm text-muted-foreground",
												children: complaint.aiAnalysis.cluster
											})]
										})
									]
								}),
								complaint.clusterId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/issues/$id",
									params: { id: complaint.clusterId },
									className: "mt-4 inline-block text-sm text-primary hover:underline",
									children: t("ui.view_related_systemic_issue")
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							elevation: "raised",
							className: "overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border-b border-[var(--glass-border)] p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.location") })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "jm-map h-[240px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CivicMap, {
									cityId: city,
									mode: "activity",
									activities: [],
									points: [...allPoints, point],
									selectedAreaId: null,
									onSelectArea: () => {},
									compact: true
								})
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InvestigationTimeline, {
						events: complaint.timeline,
						currentStatus: complaint.status
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						elevation: "raised",
						className: "p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.officer_actions") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-col gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => void handleAssign("Water Supply"),
									className: "action-btn text-left bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20",
									children: t("ui.verify_accept_complaint")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => toast.success("Rejecting complaint..."),
									className: "action-btn text-left bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20",
									children: t("ui.reject_as_invalid")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-[var(--glass-border)] my-2" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "action-btn text-left",
									onClick: () => toast.success("Opening classification..."),
									children: t("ui.classify_route")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "action-btn text-left",
									onClick: () => toast.success("Linking to issue..."),
									children: t("ui.link_to_civic_issue")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "action-btn text-left",
									onClick: () => toast.success("Creating procurement opportunity..."),
									children: t("ui.create_procurement_opportunity")
								})
							]
						})]
					})]
				})]
			})
		]
	});
}
//#endregion
export { ComplaintDetailPage as component };
