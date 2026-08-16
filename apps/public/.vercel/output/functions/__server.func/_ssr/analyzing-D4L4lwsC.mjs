import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { E as LoaderCircle, T as MapPin, V as Check, u as Sparkles, z as CircleAlert } from "../_libs/lucide-react.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as linkToCivicIssue, a as PageShell, c as analyzeComplaint, d as createCivicIssue, f as createComplaint, n as GlassButton, o as SectionLabel, p as detectDuplicateIssues, r as GlassCard } from "./glass-card-BssLVty0.mjs";
import { r as ErrorState, t as AuthGate } from "./require-auth-U5VF4pEa.mjs";
import { n as StatusBadge, t as SeverityBadge } from "./badges-DpyCGGYj.mjs";
import { r as loadDraft, t as clearDraft } from "./report-draft-BNrUyQJo.mjs";
import { r as cn } from "./router-BpQlMeTC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analyzing-D4L4lwsC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STAGES = [
	"Understanding complaint",
	"Detecting civic category",
	"Evaluating severity",
	"Checking location",
	"Scanning for duplicate reports",
	"Preparing your report"
];
function AnalyzingPage() {
	const navigate = useNavigate();
	const [stage, setStage] = (0, import_react.useState)(0);
	const [result, setResult] = (0, import_react.useState)(null);
	const [complaint, setComplaint] = (0, import_react.useState)(null);
	const [duplicates, setDuplicates] = (0, import_react.useState)([]);
	const [draftData, setDraftData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(false);
	const started = (0, import_react.useRef)(false);
	async function run() {
		setError(false);
		setStage(0);
		const draft = loadDraft();
		if (!draft.description) {
			navigate({ to: "/report" });
			return;
		}
		setDraftData(draft);
		const timer = window.setInterval(() => setStage((s) => Math.min(STAGES.length - 2, s + 1)), 450);
		try {
			const analysis = await analyzeComplaint({
				description: draft.description,
				location: draft.location,
				imageCategory: draft.category
			});
			setResult(analysis);
			if (draft.location) {
				const matches = await detectDuplicateIssues({
					lat: draft.location.lat,
					lng: draft.location.lng,
					category: analysis.category,
					description: draft.description
				});
				if (matches.length > 0) {
					window.clearInterval(timer);
					setStage(4);
					setDuplicates(matches);
					return;
				}
			}
			await proceedWithNewIssue(draft, analysis);
			window.clearInterval(timer);
		} catch (err) {
			console.error(err);
			window.clearInterval(timer);
			setError(true);
		}
	}
	async function proceedWithNewIssue(draft, analysis) {
		setStage(STAGES.length - 1);
		const created = await createComplaint({
			description: draft.description,
			category: analysis.category,
			severity: analysis.severity,
			location: analysis.location,
			photo: draft.photo,
			relatedCount: analysis.relatedCount,
			nearbyCount: analysis.nearbyCount
		});
		const issue = await createCivicIssue({
			title: `${analysis.category} at ${analysis.location.ward}`,
			category: analysis.category,
			description: draft.description,
			lat: analysis.location.lat,
			lng: analysis.location.lng,
			ward: analysis.location.ward,
			area: analysis.location.area,
			cityId: "vadodara",
			status: "OPEN",
			priority: analysis.severity,
			severity: analysis.severity,
			impactScore: 10,
			reportCount: 0,
			uniqueReporterCount: 0,
			confirmationCount: 0,
			firstReportedAt: (/* @__PURE__ */ new Date()).toISOString(),
			lastReportedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		await linkToCivicIssue(issue.id, created.id, "PRIMARY_REPORT", 100, "Citizen");
		setComplaint(created);
		setStage(STAGES.length);
		clearDraft();
	}
	async function handleLinkExisting(match) {
		setStage(STAGES.length - 1);
		setDuplicates([]);
		const created = await createComplaint({
			description: draftData.description,
			category: result.category,
			severity: result.severity,
			location: result.location,
			photo: draftData.photo,
			relatedCount: result.relatedCount,
			nearbyCount: result.nearbyCount
		});
		await linkToCivicIssue(match.issue.id, created.id, "DUPLICATE", match.confidence, "Citizen");
		setComplaint(created);
		setStage(STAGES.length);
		clearDraft();
	}
	(0, import_react.useEffect)(() => {
		if (started.current) return;
		started.current = true;
		run();
	}, []);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, {
		className: "max-w-2xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
			title: "We couldn't analyze your report right now.",
			description: "Your description is safe. Try again in a moment.",
			onRetry: () => void run()
		})
	});
	if (duplicates.length > 0 && result) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, {
		className: "max-w-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "animate-rise space-y-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
					className: "text-warning",
					children: "Wait a moment"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold sm:text-3xl",
					children: "Similar issues found nearby"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "JANMIND has detected existing active reports in this exact location that match your description. Are you reporting the same problem?"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "animate-rise mt-8 space-y-4",
			children: [duplicates.map((match) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "p-5 flex flex-col sm:flex-row sm:items-center gap-4 border-[color-mix(in_oklab,var(--primary)_30%,transparent)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { severity: match.issue.severity }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium text-foreground",
									children: match.issue.category
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground ml-auto",
									children: [match.distance, "m away"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-subtle line-clamp-2",
							children: match.issue.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 mt-2 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-3.5 h-3.5" }),
									" ",
									match.issue.reportCount,
									" other reports"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-3.5 h-3.5" }),
									" ",
									match.issue.ward
								]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sm:border-l border-border sm:pl-5 sm:ml-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
						variant: "primary",
						className: "w-full sm:w-auto",
						onClick: () => handleLinkExisting(match),
						children: "Yes, I'm also affected"
					})
				})]
			}, match.issue.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-6 border-t border-border flex flex-col items-center justify-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-subtle mb-3",
					children: "Is your issue completely different?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
					variant: "ghost",
					onClick: () => proceedWithNewIssue(draftData, result),
					children: "No, report as a new issue"
				})]
			})]
		})]
	});
	if (result && complaint && stage === STAGES.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "animate-rise space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Your report" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold sm:text-3xl",
					children: "Analysis complete"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				elevation: "raised",
				className: "animate-rise mt-6 space-y-6 p-5 sm:p-7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[0.98rem] leading-relaxed",
					children: complaint.description
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "label-xs",
							children: "AI-suggested category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1.5 text-sm font-medium",
							children: result.category
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "label-xs",
							children: "Severity"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { severity: result.severity })
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "label-xs",
							children: "Location"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1.5 text-sm font-medium",
							children: result.location.ward
						})] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				elevation: "raised",
				className: "animate-rise mt-5 space-y-5 p-5 sm:p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-9 w-9 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--success)_18%,transparent)] text-success",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
								className: "h-4 w-4",
								"aria-hidden": true
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Complaint received" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-sm text-muted-foreground",
							children: "Your report is now on record and routed for review."
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "grid gap-4 sm:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "label-xs",
								children: "Complaint ID"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1.5 text-sm font-medium tabular-nums",
								children: complaint.id
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "label-xs",
								children: "Category"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1.5 text-sm font-medium",
								children: complaint.category
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "label-xs",
								children: "Location"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1.5 text-sm font-medium",
								children: complaint.location.ward
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "label-xs",
								children: "Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: complaint.status })
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/complaint/$id",
							params: { id: complaint.id },
							children: "Track complaint"
						})
					})
				]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, {
		className: "max-w-xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
			elevation: "raised",
			className: "animate-rise p-7 sm:p-9",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
						className: "h-4 w-4 animate-pulse text-primary",
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "JANMIND Intelligence" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 text-xl font-semibold",
					children: "Analyzing your report..."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-7 space-y-3.5",
					"aria-live": "polite",
					children: STAGES.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300", i < stage ? "border-[color-mix(in_oklab,var(--primary)_55%,transparent)] bg-[color-mix(in_oklab,var(--primary)_18%,transparent)] text-primary" : "border-border text-subtle"),
							children: i < stage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : i === stage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1 w-1 rounded-full bg-current" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("text-sm transition-colors duration-300", i < stage ? "text-foreground" : "text-muted-foreground"),
							children: s
						})]
					}, s))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-7 h-1 overflow-hidden rounded-full bg-[var(--glass-strong)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-primary transition-[width] duration-300 ease-out",
						style: { width: `${stage / STAGES.length * 100}%` }
					})
				})
			]
		})
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGate, {
	redirectTo: "/report",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalyzingPage, {})
});
//#endregion
export { SplitComponent as component };
