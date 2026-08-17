import { i as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { v as useRouter } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { d as suspendContractor, n as Route, o as getContractor, p as verifyContractor, r as useAdminAuth, s as getContractorDocuments } from "./_ssr/router-CYRUKuqz.mjs";
import { n as SectionLabel, t as GlassCard } from "./_ssr/glass-card-CoNgXAty.mjs";
import { b as ArrowLeft, g as CircleCheck, o as ShieldAlert } from "./_libs/lucide-react.mjs";
import { n as LoadingState, t as ErrorState } from "./_ssr/states-BSypa5q_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-DoXp-MJT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ContractorDetail() {
	const { id } = Route.useParams();
	const [contractor, setContractor] = (0, import_react.useState)(null);
	const [documents, setDocuments] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const { admin } = useAdminAuth();
	const router = useRouter();
	const loadData = async () => {
		setLoading(true);
		try {
			const data = await getContractor(id);
			if (data) {
				setContractor(data);
				const docs = await getContractorDocuments(id);
				setDocuments(docs);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadData();
	}, [id]);
	const handleVerify = async () => {
		if (!admin || !contractor) return;
		try {
			await verifyContractor(contractor.id, admin.id, admin.name);
			toast.success("Contractor verified successfully");
			loadData();
		} catch (error) {
			toast.error("Failed to verify contractor");
		}
	};
	const handleSuspend = async () => {
		if (!admin || !contractor) return;
		const reason = prompt("Enter suspension reason:");
		if (!reason) return;
		try {
			await suspendContractor(contractor.id, admin.id, admin.name, reason);
			toast.error("Contractor suspended");
			loadData();
		} catch (error) {
			toast.error("Failed to suspend contractor");
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading contractor..." });
	if (!contractor) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		title: "Not Found",
		description: "Contractor not found"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 muni-page-enter pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => router.history.back(),
					className: "p-2 glass rounded-md hover:bg-[var(--surface-elevated)] transition-colors",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: contractor.companyName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[var(--muted-foreground)]",
					children: ["Registration: ", contractor.registrationNumber]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-4 items-center bg-[var(--surface-elevated)] p-4 rounded-lg border border-[var(--glass-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-[200px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-[var(--muted-foreground)]",
						children: "Current Status"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: contractor.status })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3",
					children: [contractor.status === "PENDING_VERIFICATION" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleVerify,
						className: "action-btn flex items-center gap-2 press bg-[var(--success)]/10 text-[var(--success)] hover:bg-[var(--success)]/20 border-transparent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4" }), " Verify Contractor"]
					}), contractor.status === "VERIFIED" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleSuspend,
						className: "action-btn flex items-center gap-2 press bg-[var(--critical)]/10 text-[var(--critical)] hover:bg-[var(--critical)]/20 border-transparent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-4 h-4" }), " Suspend Contractor"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2 space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Company Profile" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "label-xs mb-1",
									children: "Company Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: contractor.companyName
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "label-xs mb-1",
									children: "Registration Number"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: contractor.registrationNumber
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "label-xs mb-1",
									children: "Tax ID / PAN"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: contractor.pan || contractor.gstin
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "label-xs mb-1",
									children: "Contractor Tier"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: "Class A"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "label-xs mb-2",
										children: "Specializations"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-2",
										children: contractor.specializationCategories.map((spec) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-3 py-1 rounded bg-[var(--background)] border border-[var(--glass-border)] text-sm",
											children: spec
										}, spec))
									})]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Registration & Compliance" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-[var(--glass-border)] text-left text-[var(--muted-foreground)]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-3 px-4 font-medium",
											children: "Document Type"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-3 px-4 font-medium",
											children: "Status"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "pb-3 px-4 font-medium",
											children: "Uploaded Date"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
									className: "divide-y divide-[var(--glass-border)]",
									children: [documents.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-[var(--surface-elevated)]/50 transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3 px-4",
												children: doc.documentType || doc.documentName
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3 px-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "px-2 py-1 rounded text-xs border border-[var(--glass-border)] bg-[var(--surface-elevated)]",
													children: doc.status
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3 px-4 text-[var(--muted-foreground)]",
												children: new Date(doc.uploadedAt).toLocaleDateString()
											})
										]
									}, doc.id)), documents.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 3,
										className: "py-6 text-center text-[var(--muted-foreground)] italic",
										children: "No documents uploaded"
									}) })]
								})]
							})
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "System Security Logging" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 space-y-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricBar, {
								label: "Overall Score",
								value: contractor.performanceScore || 0,
								max: 100
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-[var(--glass-border)] pt-5 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricBar, {
										label: "Inspection Pass Rate",
										value: contractor.inspectionPassRate || 0,
										max: 100
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricBar, {
										label: "On-Time Completion",
										value: contractor.onTimeCompletionRate || 0,
										max: 100
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricBar, {
										label: "SLA Compliance",
										value: contractor.slaScore || 0,
										max: 100
									})
								]
							})]
						})]
					})
				})]
			})
		]
	});
}
function MetricBar({ label, value, max, isDecimal = false }) {
	const percentage = value / max * 100;
	const displayValue = isDecimal ? value.toFixed(1) : Math.round(value).toString();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between items-end mb-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-medium",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-sm text-[var(--muted-foreground)]",
			children: [displayValue, isDecimal ? `/${max}` : "%"]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-2 bg-[var(--background)] rounded-full overflow-hidden border border-[var(--glass-border)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full bg-[var(--foreground)] transition-all duration-500",
			style: { width: `${Math.min(100, Math.max(0, percentage))}%` }
		})
	})] });
}
function StatusBadge({ status }) {
	if (status === "VERIFIED") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "px-2.5 py-1 rounded text-sm font-medium bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20 inline-flex items-center gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4" }), " Verified"]
	});
	if (status === "PENDING_VERIFICATION") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "px-2.5 py-1 rounded text-sm font-medium bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/20 inline-flex items-center gap-1.5",
		children: "Pending Verification"
	});
	if (status === "SUSPENDED") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "px-2.5 py-1 rounded text-sm font-medium bg-[var(--critical)]/10 text-[var(--critical)] border border-[var(--critical)]/20 inline-flex items-center gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "w-4 h-4" }), " Suspended"]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: status });
}
//#endregion
export { ContractorDetail as component };
