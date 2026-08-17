import { i as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { E as getBill, G as getWorkOrderEvents, P as getMeasurement, W as getWorkOrder, at as submitMeasurement, et as recordInspection, g as approveBill, j as getEvidence, l as useMuniAuth, n as Route, q as inspectWorkOrder, st as updateWorkOrderStatus } from "./_ssr/router-Cd9GNziQ.mjs";
import { t as cn } from "./_ssr/utils-C_uf36nf.mjs";
import { n as SectionLabel, t as GlassCard } from "./_ssr/glass-card-CtvEoNHg.mjs";
import { H as ArrowLeft, N as ClipboardCheck, O as FileText, P as CircleCheck, S as MapPin, a as TriangleAlert, j as Clock, z as Building2 } from "./_libs/lucide-react.mjs";
import { n as ErrorState, r as LoadingState } from "./_ssr/states-JpTLzdcL.mjs";
import { c as workOrderStatusColor, l as workOrderStatusLabel, s as validateWorkOrderTransition } from "./_ssr/types-CjX07JOU.mjs";
import { n as formatDistanceToNow, r as format, t as isPast } from "./_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-BZlgq1QY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_COLOR_MAP = {
	success: "text-[var(--success)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)]",
	warning: "text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_12%,transparent)]",
	primary: "text-[var(--primary)] bg-[color-mix(in_oklab,var(--primary)_12%,transparent)]",
	muted: "text-[var(--muted-foreground)] bg-[var(--muted)]"
};
var EVENT_ICONS = {
	STATUS_CHANGE: CircleCheck,
	PROGRESS_UPDATE: Clock,
	INSPECTION: ClipboardCheck,
	MEASUREMENT: FileText,
	BILL: FileText,
	NOTE: FileText,
	PHOTO_UPLOADED: FileText
};
function WorkOrderDetailPage() {
	const { id } = Route.useParams();
	const { officer } = useMuniAuth();
	const role = officer?.role === "Department Head" ? "department_head" : "supervisor";
	const [wo, setWo] = (0, import_react.useState)(null);
	const [events, setEvents] = (0, import_react.useState)([]);
	const [measurement, setMeasurement] = (0, import_react.useState)(null);
	const [bill, setBill] = (0, import_react.useState)(null);
	const [evidenceList, setEvidenceList] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(false);
	const [acting, setActing] = (0, import_react.useState)(false);
	const [inspPanel, setInspPanel] = (0, import_react.useState)(false);
	const [inspResult, setInspResult] = (0, import_react.useState)("PASSED");
	const [inspNotes, setInspNotes] = (0, import_react.useState)("");
	const [measPanel, setMeasPanel] = (0, import_react.useState)(false);
	const [measTotal, setMeasTotal] = (0, import_react.useState)("");
	(officer?.role === "Department Head" || officer?.role === "Administrator") && wo?.status;
	(0, import_react.useEffect)(() => {
		Promise.all([
			getWorkOrder(id),
			getWorkOrderEvents(id),
			getMeasurement(id),
			getBill(id),
			getEvidence(id)
		]).then(([order, evts, meas, b, evds]) => {
			if (!order) {
				setError(true);
				return;
			}
			setWo(order);
			setEvents(evts);
			setMeasurement(meas);
			setBill(b);
			setEvidenceList(evds);
		}).catch(() => setError(true)).finally(() => setLoading(false));
	}, [id]);
	async function transition(toStatus) {
		if (!wo || !officer) return;
		const check = validateWorkOrderTransition(wo.status, toStatus, role);
		if (!check.valid) {
			toast.error(check.reason);
			return;
		}
		setActing(true);
		try {
			const updated = await updateWorkOrderStatus(id, toStatus, officer.id, officer.name, role);
			setWo(updated);
			const evts = await getWorkOrderEvents(id);
			setEvents(evts);
			toast.success(`Status updated to: ${workOrderStatusLabel(toStatus)}`);
		} catch {
			toast.error("Failed to update status");
		} finally {
			setActing(false);
		}
	}
	async function handleInspection() {
		if (!officer) return;
		setActing(true);
		try {
			const insp = {
				workOrderId: id,
				result: inspResult,
				inspectedBy: officer.id,
				inspectedByName: officer.name,
				inspectionDate: (/* @__PURE__ */ new Date()).toISOString(),
				notes: inspNotes
			};
			try {
				await inspectWorkOrder(id, inspResult, inspNotes);
			} catch (e) {
				console.warn("Backend API not found for this mock ID, proceeding with local update");
			}
			await recordInspection(insp, officer.id, officer.name);
			await transition(inspResult === "PASSED" ? "INSPECTION_PASSED" : "INSPECTION_FAILED");
			setInspPanel(false);
			setInspNotes("");
			toast.success("Inspection recorded");
		} catch {
			toast.error("Failed to record inspection");
		} finally {
			setActing(false);
		}
	}
	async function handleVerifyMeasurement() {
		if (!officer || !wo) return;
		setActing(true);
		try {
			const meas = await submitMeasurement({
				workOrderId: id,
				items: wo.boqItems.map((b, i) => ({
					id: `mi_${i}`,
					description: b.description,
					unit: b.unit,
					plannedQuantity: b.quantity,
					executedQuantity: b.quantity,
					unitRate: b.unitRate,
					amount: b.amount
				})),
				totalAmount: Number(measTotal) || wo.estimatedCost,
				measuredBy: officer.id,
				measuredByName: officer.name,
				measurementDate: (/* @__PURE__ */ new Date()).toISOString(),
				verificationStatus: "VERIFIED",
				verifiedBy: officer.id,
				verifiedAt: (/* @__PURE__ */ new Date()).toISOString(),
				contractorAcknowledged: false
			}, officer.id, officer.name);
			setMeasurement(meas);
			await transition("BILL_SUBMITTED");
			setMeasPanel(false);
			toast.success("Measurement verified");
		} catch {
			toast.error("Failed to verify measurement");
		} finally {
			setActing(false);
		}
	}
	async function handleApproveBill() {
		if (!officer || !bill) return;
		setActing(true);
		try {
			const updated = await approveBill(bill.id, id, officer.id, officer.name, bill.submittedAmount);
			setBill(updated);
			await transition("PAYMENT_APPROVED");
			toast.success("Bill approved");
		} catch {
			toast.error("Failed to approve bill");
		} finally {
			setActing(false);
		}
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading work order..." });
	if (error || !wo) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		description: "Work order not found.",
		onRetry: () => window.location.reload()
	});
	const colorKey = workOrderStatusColor(wo.status);
	const isOverdue = isPast(new Date(wo.slaDeadline)) && wo.status !== "CLOSED";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "muni-page-enter space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/work-orders",
				className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " All work orders"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
						className: "tabular-nums",
						children: wo.id
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_COLOR_MAP[colorKey] ?? STATUS_COLOR_MAP["muted"]),
						children: workOrderStatusLabel(wo.status)
					}),
					isOverdue && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--critical)_12%,transparent)] px-2.5 py-0.5 text-xs font-medium text-[var(--critical)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3" }), " OVERDUE"]
					})
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Work Order Details" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-3 text-xl font-semibold",
									children: wo.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: wo.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
									className: "mt-6 grid gap-4 sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "label-xs",
											children: "Contractor"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "mt-1 text-sm font-medium",
											children: wo.contractorName
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "label-xs",
											children: "Department"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "mt-1 text-sm",
											children: wo.department
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "label-xs",
											children: "Assigned Engineer"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "mt-1 text-sm",
											children: wo.assignedEngineerName ?? "—"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "label-xs",
											children: "Location"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
											className: "mt-1 flex items-center gap-1 text-sm",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3 shrink-0" }),
												wo.area,
												", ",
												wo.ward
											]
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "label-xs",
											children: "Start Date"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "mt-1 text-sm",
											children: wo.actualStartDate ? format(new Date(wo.actualStartDate), "dd MMM yyyy") : format(new Date(wo.startDate), "dd MMM yyyy")
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "label-xs",
											children: "SLA Deadline"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
											className: cn("mt-1 text-sm font-medium", isOverdue && "text-[var(--critical)]"),
											children: [
												format(new Date(wo.slaDeadline), "dd MMM yyyy"),
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-normal text-muted-foreground",
													children: [
														"(",
														formatDistanceToNow(new Date(wo.slaDeadline), { addSuffix: true }),
														")"
													]
												})
											]
										})] })
									]
								})
							]
						}),
						wo.boqItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							elevation: "raised",
							className: "p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Bill of Quantities" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "border-b border-[var(--glass-border)] text-left",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "label-xs pb-2 pr-4",
													children: "Description"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "label-xs pb-2 pr-4 text-right",
													children: "Unit"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "label-xs pb-2 pr-4 text-right",
													children: "Qty"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "label-xs pb-2 pr-4 text-right",
													children: "Rate"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "label-xs pb-2 text-right",
													children: "Amount"
												})
											]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
											className: "divide-y divide-[var(--glass-border)]",
											children: wo.boqItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-2 pr-4 text-sm",
													children: item.description
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-2 pr-4 text-right text-xs text-muted-foreground",
													children: item.unit
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-2 pr-4 text-right tabular-nums",
													children: item.quantity
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "py-2 pr-4 text-right tabular-nums",
													children: ["₹", item.unitRate.toLocaleString("en-IN")]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "py-2 text-right font-medium tabular-nums",
													children: ["₹", item.amount.toLocaleString("en-IN")]
												})
											] }, item.id))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tfoot", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "border-t-2 border-[var(--glass-border)] font-semibold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												colSpan: 4,
												className: "pt-2 pr-4",
												children: "Total"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "pt-2 text-right tabular-nums",
												children: ["₹", wo.boqItems.reduce((s, i) => s + i.amount, 0).toLocaleString("en-IN")]
											})]
										}), wo.approvedAmount && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "text-[var(--success)]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												colSpan: 4,
												className: "pr-4 text-xs font-medium",
												children: "Approved Amount"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "text-right text-sm tabular-nums font-semibold",
												children: ["₹", wo.approvedAmount.toLocaleString("en-IN")]
											})]
										})] })
									]
								})
							})]
						}),
						wo.status === "SUBMITTED_FOR_INSPECTION" || wo.status === "RESUBMITTED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							elevation: "raised",
							className: "p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Record Inspection" }), !inspPanel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setInspPanel(true),
								className: "action-btn primary mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardCheck, { className: "mr-2 inline h-4 w-4" }), "Record Site Inspection"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex gap-3",
										children: ["PASSED", "FAILED"].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setInspResult(r),
											className: cn("flex-1 rounded-xl border py-3 text-sm font-medium transition-colors", inspResult === r ? r === "PASSED" ? "border-[var(--success)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)] text-[var(--success)]" : "border-[var(--critical)] bg-[color-mix(in_oklab,var(--critical)_12%,transparent)] text-[var(--critical)]" : "border-[var(--glass-border)] bg-[var(--glass)] text-muted-foreground hover:bg-[var(--glass-strong)]"),
											children: r === "PASSED" ? "✓ Pass" : "✗ Fail"
										}, r))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "label-xs",
											children: "Inspection Notes"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: inspNotes,
											onChange: (e) => setInspNotes(e.target.value),
											rows: 3,
											className: "filter-input",
											placeholder: "Describe findings, quality observations, deficiencies..."
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => void handleInspection(),
											disabled: acting,
											className: "action-btn primary flex-1",
											children: acting ? "Saving..." : "Submit Inspection"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setInspPanel(false),
											className: "action-btn flex-1",
											children: "Cancel"
										})]
									})
								]
							})]
						}) : null,
						wo.status === "MEASUREMENT_PENDING" && !measurement ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							elevation: "raised",
							className: "p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Verify Measurement" }), !measPanel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setMeasPanel(true),
								className: "action-btn primary mt-4",
								children: "Verify Measurement & Proceed to Billing"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "label-xs",
										children: "Verified Total Amount (₹)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: measTotal,
										onChange: (e) => setMeasTotal(e.target.value),
										className: "filter-input",
										placeholder: String(wo.approvedAmount ?? wo.estimatedCost)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => void handleVerifyMeasurement(),
										disabled: acting,
										className: "action-btn primary flex-1",
										children: acting ? "Saving..." : "Verify & Proceed"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setMeasPanel(false),
										className: "action-btn flex-1",
										children: "Cancel"
									})]
								})]
							})]
						}) : null,
						bill && bill.status === "SUBMITTED" && wo.status === "BILL_SUBMITTED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							elevation: "raised",
							className: "p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Bill Approval" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: [
										"Contractor submitted bill for",
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-foreground",
											children: ["₹", bill.submittedAmount.toLocaleString("en-IN")]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => void handleApproveBill(),
									disabled: acting,
									className: "action-btn primary mt-4",
									children: acting ? "Approving..." : "Approve Bill & Initiate Payment"
								})
							]
						}) : null,
						wo.status === "PAYMENT_APPROVED" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							elevation: "raised",
							className: "p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Close Work Order" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted-foreground",
									children: "Payment approved. Close the work order to resolve all linked complaints."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => void transition("CLOSED"),
									disabled: acting,
									className: "action-btn primary mt-4",
									children: acting ? "Closing..." : "Close Work Order & Resolve Complaints"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							elevation: "raised",
							className: "p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Work Order Timeline" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "relative mt-6 border-l border-[var(--glass-border)] pl-6 space-y-6",
								children: events.map((evt) => {
									const Icon = EVENT_ICONS[evt.eventType] ?? CircleCheck;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute -left-[1.625rem] flex h-5 w-5 items-center justify-center rounded-full bg-[var(--surface-elevated)] ring-1 ring-[var(--glass-border)]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3 w-3 text-[var(--primary)]" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-medium",
												children: evt.title
											}),
											evt.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-0.5 text-xs text-muted-foreground",
												children: evt.description
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-1 flex gap-3 text-[0.65rem] text-muted-foreground",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: evt.actorName }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "capitalize",
														children: evt.actorRole
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: format(new Date(evt.at), "dd MMM yyyy, HH:mm") })
												]
											})
										] })]
									}, evt.id);
								})
							})]
						}),
						Boolean(wo.civicIssueIds && wo.civicIssueIds.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							elevation: "raised",
							className: "p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionLabel, { children: [
								"Linked Civic Issues (",
								(wo.civicIssueIds ?? []).length,
								")"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 space-y-2",
								children: (wo.civicIssueIds ?? []).map((cid) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/civic-issues/$id",
									params: { id: cid },
									className: "rounded-lg border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-1.5 text-xs font-mono hover:bg-[var(--glass-strong)] transition-colors",
									children: cid
								}) }, cid))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "p-0 glass-strong overflow-hidden mt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-5 border-b border-[var(--glass-border)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Evidence & AI Validation" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
								children: [evidenceList.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border border-[var(--glass-border)] rounded-md overflow-hidden bg-[var(--surface-elevated)] flex flex-col",
									children: [e.fileUrl && e.fileUrl.length > 20 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-40 w-full bg-black/10 overflow-hidden flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: e.fileUrl,
											alt: e.stage,
											className: "object-cover h-full w-full opacity-80 hover:opacity-100 transition-opacity"
										})
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-40 w-full flex items-center justify-center bg-black/10 text-[var(--muted-foreground)]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 32 })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-3 text-sm flex flex-col gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-bold",
												children: e.stage
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-[var(--muted-foreground)]",
												children: new Date(e.captureTimestamp).toLocaleString()
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-2 text-xs",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `inline-block px-2 py-1 rounded font-medium ${e.status === "FLAGGED" ? "bg-[var(--critical)]/20 text-[var(--critical)]" : "bg-[var(--success)]/20 text-[var(--success)]"}`,
													children: e.status
												})
											}),
											e.aiAnalysis && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2 pt-2 border-t border-[var(--glass-border)] text-xs text-[var(--muted-foreground)] space-y-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["AI Relevance: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[var(--foreground)] font-medium",
														children: [e.aiAnalysis.relevanceScore, "%"]
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Tamper Risk: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[var(--foreground)] font-medium",
														children: e.aiAnalysis.tamperRisk
													})] }),
													e.distanceFromSite !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["GPS Distance: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[var(--foreground)] font-medium",
														children: [Math.round(e.distanceFromSite), "m"]
													})] }),
													e.aiAnalysis.flags?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[var(--critical)] mt-1 font-medium",
														children: e.aiAnalysis.flags.join(", ")
													})
												]
											})
										]
									})]
								}, e.id)), evidenceList.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm text-[var(--muted-foreground)] p-4 col-span-full text-center",
									children: "No evidence submitted yet."
								})]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						elevation: "raised",
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Financial Summary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "label-xs",
									children: "Estimated"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
									className: "mt-1 font-semibold tabular-nums",
									children: ["₹", wo.estimatedCost.toLocaleString("en-IN")]
								})] }),
								wo.approvedAmount && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "label-xs",
									children: "Approved"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
									className: "mt-1 font-semibold tabular-nums text-[var(--success)]",
									children: ["₹", wo.approvedAmount.toLocaleString("en-IN")]
								})] }),
								bill?.approvedAmount && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "label-xs",
									children: "Bill Approved"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
									className: "mt-1 font-semibold tabular-nums",
									children: ["₹", bill.approvedAmount.toLocaleString("en-IN")]
								})] })
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						elevation: "raised",
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Quick Actions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 space-y-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/work-packages/$id",
								params: { id: wo.workPackageId },
								className: "action-btn flex w-full items-center gap-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3.5 w-3.5" }), "View Work Package"]
							})
						})]
					})]
				})]
			})
		]
	});
}
//#endregion
export { WorkOrderDetailPage as component };
