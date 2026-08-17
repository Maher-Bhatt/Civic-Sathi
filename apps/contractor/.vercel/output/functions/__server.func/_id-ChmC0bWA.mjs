import { i as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { h as Link, v as useRouter } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { c as getWorkOrder, d as submitFieldEvidence, f as updateWorkOrderStatus, i as useContractorAuth, n as Route, p as useI18n } from "./_ssr/router-CHoH6_H7.mjs";
import { S as ArrowLeft, _ as CircleCheck, d as IndianRupee, h as Clock, p as FileText, y as Calendar } from "./_libs/lucide-react.mjs";
import { n as SectionLabel, t as GlassCard } from "./_ssr/glass-card-CoNgXAty.mjs";
import { n as LoadingState, t as ErrorState } from "./_ssr/states-BSypa5q_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-ChmC0bWA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_LABEL = {
	ISSUED: "Issued — Action Required",
	ACCEPTED: "Accepted",
	IN_PROGRESS: "In Progress",
	INSPECTION_PENDING: "Awaiting Municipal Inspection",
	INSPECTION_FAILED: "Inspection Failed",
	REWORK: "Rework Required",
	COMPLETED: "Completed",
	CLOSED: "Closed"
};
var STATUS_COLOR = {
	ISSUED: "var(--primary)",
	ACCEPTED: "var(--primary)",
	IN_PROGRESS: "var(--warning)",
	INSPECTION_PENDING: "var(--warning)",
	INSPECTION_FAILED: "var(--critical)",
	REWORK: "var(--critical)",
	COMPLETED: "var(--success)",
	CLOSED: "var(--muted-foreground)"
};
var CONTRACTOR_NEXT_STATUS = {
	ISSUED: "ACCEPTED",
	ACCEPTED: "IN_PROGRESS",
	IN_PROGRESS: "INSPECTION_PENDING",
	REWORK: "INSPECTION_PENDING"
};
var CONTRACTOR_NEXT_LABEL = {
	ISSUED: "Accept Work Order",
	ACCEPTED: "Start Work",
	IN_PROGRESS: "Submit for Inspection",
	REWORK: "Resubmit for Inspection"
};
function ContractorWorkOrderDetail() {
	const { t } = useI18n();
	const { id } = Route.useParams();
	const { contractor } = useContractorAuth();
	useRouter();
	const [wo, setWo] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [actionLoading, setActionLoading] = (0, import_react.useState)(false);
	const [evidenceStage, setEvidenceStage] = (0, import_react.useState)("COMPLETION");
	const [fileData, setFileData] = (0, import_react.useState)("");
	const [evidenceDesc, setEvidenceDesc] = (0, import_react.useState)("");
	const loadData = async () => {
		try {
			setLoading(true);
			const data = await getWorkOrder(id);
			if (!data) throw new Error("Work order not found.");
			setWo(data);
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (contractor?.id) loadData();
	}, [id, contractor?.id]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading work order details..." });
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { description: error.message });
	if (!wo) return null;
	const nextStatus = CONTRACTOR_NEXT_STATUS[wo.status] ?? null;
	const nextLabel = CONTRACTOR_NEXT_LABEL[wo.status] ?? "";
	const isOverdue = wo.target_completion_date && new Date(wo.target_completion_date) < /* @__PURE__ */ new Date() && !["COMPLETED", "CLOSED"].includes(wo.status);
	const handleStatusChange = async (status) => {
		setActionLoading(true);
		try {
			await updateWorkOrderStatus(wo.id, status);
			toast.success(`Work order updated to: ${STATUS_LABEL[status] ?? status}`);
			await loadData();
		} catch (err) {
			toast.error(err.message || "Failed to update status.");
		} finally {
			setActionLoading(false);
		}
	};
	const handleEvidenceSubmit = async (e) => {
		e.preventDefault();
		if (!fileData) {
			toast.error("Please select a photo.");
			return;
		}
		setActionLoading(true);
		try {
			await submitFieldEvidence(wo.id, fileData, evidenceDesc || evidenceStage);
			toast.success("Evidence uploaded. Work order is now pending inspection.");
			setFileData("");
			setEvidenceDesc("");
			await loadData();
		} catch (err) {
			toast.error(err.message || "Failed to upload evidence.");
		} finally {
			setActionLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 animate-fade pb-12 max-w-5xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/contractor/work-orders",
				className: "inline-flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { size: 15 }),
					" ",
					t("ui.back_to_work_orders")
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row md:items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3 mb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-semibold text-[var(--foreground)] tracking-tight",
						children: wo.title ?? "Work Order"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex items-center px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider border border-[var(--glass-border)] bg-[var(--surface-elevated)]",
						style: { color: STATUS_COLOR[wo.status] ?? "var(--foreground)" },
						children: STATUS_LABEL[wo.status] ?? wo.status
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-mono text-[var(--muted-foreground)]",
					children: [t("ui.id"), wo.id]
				})] }), nextStatus && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => handleStatusChange(nextStatus),
					disabled: actionLoading,
					className: "shrink-0 px-5 py-2.5 rounded-md font-medium text-sm text-white bg-[var(--primary)] hover:opacity-90 transition-opacity disabled:opacity-50",
					children: actionLoading ? "Updating..." : nextLabel
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2 space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-5 glass-strong space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.work_order_details") }),
							wo.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-[var(--foreground)] leading-relaxed",
								children: wo.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[var(--muted-foreground)] text-xs mb-0.5",
											children: t("ui.contract_value")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-semibold text-[var(--foreground)]",
											children: ["₹", (wo.award_value ?? 0).toLocaleString("en-IN")]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[var(--muted-foreground)] text-xs mb-0.5",
											children: t("ui.estimated_budget")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[var(--foreground)]",
											children: ["₹", (wo.estimated_budget ?? wo.award_value ?? 0).toLocaleString("en-IN")]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[var(--muted-foreground)] text-xs mb-0.5",
											children: t("ui.risk_level")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium uppercase text-xs",
											style: { color: wo.risk_level === "HIGH" || wo.risk_level === "CRITICAL" ? "var(--critical)" : "var(--muted-foreground)" },
											children: wo.risk_level ?? "LOW"
										})] })
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
											size: 15,
											className: "text-[var(--muted-foreground)] mt-0.5 shrink-0"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[var(--muted-foreground)] text-xs",
											children: t("ui.issued_on")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[var(--foreground)]",
											children: wo.created_at ? new Date(wo.created_at).toLocaleDateString("en-IN") : "—"
										})] })]
									}), wo.target_completion_date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
											size: 15,
											className: `mt-0.5 shrink-0 ${isOverdue ? "text-[var(--critical)]" : "text-[var(--muted-foreground)]"}`
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: `text-xs ${isOverdue ? "text-[var(--critical)]" : "text-[var(--muted-foreground)]"}`,
											children: t("ui.target_completion")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `font-medium ${isOverdue ? "text-[var(--critical)]" : "text-[var(--foreground)]"}`,
											children: [new Date(wo.target_completion_date).toLocaleDateString("en-IN"), isOverdue && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "ml-2 text-xs font-normal",
												children: t("ui.overdue")
											})]
										})] })]
									})]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-5 glass-strong",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.execution_progress") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 space-y-3",
							children: [
								{
									label: "Reported by You",
									pct: wo.reported_progress_pct ?? 0,
									color: "var(--primary)"
								},
								{
									label: "Verified by Officer",
									pct: wo.verified_progress_pct ?? 0,
									color: "var(--success)"
								},
								{
									label: "Planned",
									pct: wo.planned_progress_pct ?? 0,
									color: "var(--muted-foreground)"
								}
							].map(({ label, pct, color }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-xs mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[var(--muted-foreground)]",
									children: label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									style: { color },
									className: "font-medium",
									children: [pct.toFixed(0), "%"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-1.5 bg-[var(--surface)] rounded-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full transition-all duration-500",
									style: {
										width: `${pct}%`,
										backgroundColor: color
									}
								})
							})] }, label))
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						["IN_PROGRESS", "REWORK"].includes(wo.status) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "p-5 border border-[var(--primary)]/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionLabel, {
								className: "flex items-center gap-2 text-[var(--primary)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 16 }),
									" ",
									t("ui.submit_field_evidence")
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleEvidenceSubmit,
								className: "mt-4 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "label-xs block mb-1",
										children: t("ui.stage")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: evidenceStage,
										onChange: (e) => setEvidenceStage(e.target.value),
										className: "w-full px-3 py-2 rounded-md bg-[var(--surface-elevated)] text-[var(--foreground)] border border-[var(--glass-border)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "BEFORE",
												children: t("ui.before_repair")
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "START",
												children: t("ui.start_of_work")
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "DURING",
												children: t("ui.during_execution")
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "COMPLETION",
												children: t("ui.completion")
											})
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "label-xs block mb-1",
										children: t("ui.description_optional")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: evidenceDesc,
										onChange: (e) => setEvidenceDesc(e.target.value),
										placeholder: t("ui.brief_note_about_the_photo"),
										className: "w-full px-3 py-2 rounded-md bg-[var(--surface)] text-[var(--foreground)] border border-[var(--glass-border)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "label-xs block mb-1",
										children: t("ui.photo")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*",
										onChange: (e) => {
											const file = e.target.files?.[0];
											if (file) {
												const reader = new FileReader();
												reader.onloadend = () => setFileData(reader.result);
												reader.readAsDataURL(file);
											}
										},
										className: "w-full text-sm text-[var(--muted-foreground)] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-[var(--surface-elevated)] file:text-[var(--foreground)] hover:file:bg-[var(--primary)]/10",
										required: true
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										disabled: actionLoading || !fileData,
										className: "w-full py-2 rounded-md text-sm font-medium text-white bg-[var(--primary)] hover:opacity-90 transition-opacity disabled:opacity-50",
										children: actionLoading ? "Uploading…" : "Upload Evidence"
									})
								]
							})]
						}),
						wo.status === "INSPECTION_PENDING" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
							className: "p-5 border border-[var(--warning)]/40 bg-[color-mix(in_oklab,var(--warning)_5%,transparent)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
									size: 20,
									className: "text-[var(--warning)] shrink-0 mt-0.5"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold text-[var(--foreground)]",
									children: t("ui.awaiting_municipal_inspection")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-[var(--muted-foreground)]",
									children: t("ui.evidence_has_been_submitted_a_")
								})] })]
							})
						}),
						wo.status === "REWORK" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
							className: "p-5 border border-[var(--critical)]/40 bg-[color-mix(in_oklab,var(--critical)_5%,transparent)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, {
									size: 20,
									className: "text-[var(--critical)] shrink-0 mt-0.5"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold text-[var(--critical)]",
										children: t("ui.rework_required")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-[var(--muted-foreground)]",
										children: t("ui.the_municipal_inspection_did_n")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleStatusChange("INSPECTION_PENDING"),
										disabled: actionLoading,
										className: "mt-3 px-4 py-1.5 rounded-md text-xs font-medium text-white bg-[var(--critical)] hover:opacity-90 disabled:opacity-50",
										children: t("ui.resubmit_for_inspection")
									})
								] })]
							})
						}),
						wo.status === "COMPLETED" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
							className: "p-5 border border-[var(--success)]/40 bg-[color-mix(in_oklab,var(--success)_5%,transparent)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
									size: 20,
									className: "text-[var(--success)] shrink-0 mt-0.5"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold text-[var(--success)]",
									children: t("ui.work_completed")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-[var(--muted-foreground)]",
									children: t("ui.this_work_order_has_been_inspe")
								})] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "p-5 glass-strong space-y-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.quick_info") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[var(--muted-foreground)]",
											children: t("ui.awarded_by")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium truncate max-w-[55%] text-right",
											children: wo.contractor_name ?? "Municipality"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[var(--muted-foreground)]",
											children: t("ui.award_value")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-medium",
											children: ["₹", (wo.award_value ?? 0).toLocaleString("en-IN")]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[var(--muted-foreground)]",
											children: t("ui.tender_id")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs truncate max-w-[55%] text-right",
											children: wo.tender_id
										})]
									})
								]
							})]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { ContractorWorkOrderDetail as component };
