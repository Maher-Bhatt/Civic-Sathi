import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as createTender, l as useMuniAuth, u as useI18n } from "./router-CzUebAlT.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CtvEoNHg.mjs";
import { i as ISSUE_TYPES, r as DEPARTMENTS } from "./types-CjX07JOU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-B4j34iDD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NewTenderPage() {
	const { t } = useI18n();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { officer } = useMuniAuth();
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		description: "",
		category: "Road Damage",
		department: "Public Works",
		ward: "",
		area: "",
		estimatedCost: "",
		scope: "",
		civicIssueIds: "",
		priority: "Moderate"
	});
	const set = (k) => (e) => setForm((prev) => ({
		...prev,
		[k]: e.target.value
	}));
	const submitMutation = useMutation({
		mutationFn: async () => {
			if (!officer?.city) throw new Error("Officer city is missing");
			const ids = form.civicIssueIds.split(",").map((s) => s.trim()).filter(Boolean);
			return createTender({
				title: form.title,
				description: form.description,
				city_id: officer.city,
				department_id: form.department,
				civic_issue_id: ids.length > 0 ? ids[0] : null,
				scope_of_work: form.scope,
				estimated_budget: Number(form.estimatedCost) || 0
			});
		},
		onSuccess: (tender) => {
			toast.success(`Tender published successfully!`);
			queryClient.invalidateQueries({ queryKey: ["muni-tenders"] });
			navigate({
				to: "/tenders/$id",
				params: { id: tender.id }
			});
		},
		onError: () => toast.error("Failed to publish tender")
	});
	async function handleSubmit(e) {
		e.preventDefault();
		submitMutation.mutate();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "muni-page-enter mx-auto max-w-2xl space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.publish_tender") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mt-2 text-2xl font-semibold",
			children: t("ui.define_public_procurement_requ")
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
			elevation: "raised",
			className: "p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => void handleSubmit(e),
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "label-xs",
							htmlFor: "wp-title",
							children: t("ui.title")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "wp-title",
							value: form.title,
							onChange: set("title"),
							required: true,
							className: "filter-input",
							placeholder: t("ui.road_repair_ward_14_sarvodaya_")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "label-xs",
							htmlFor: "wp-desc",
							children: t("ui.description")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "wp-desc",
							value: form.description,
							onChange: set("description"),
							rows: 3,
							className: "filter-input",
							placeholder: t("ui.describe_the_civic_issue_and_w")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "label-xs",
									htmlFor: "wp-cat",
									children: t("ui.category")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									id: "wp-cat",
									value: form.category,
									onChange: set("category"),
									className: "filter-input",
									children: ISSUE_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: t }, t))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "label-xs",
									htmlFor: "wp-dept",
									children: t("ui.department")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									id: "wp-dept",
									value: form.department,
									onChange: set("department"),
									className: "filter-input",
									children: DEPARTMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: d }, d))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "label-xs",
									htmlFor: "wp-ward",
									children: t("ui.ward")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "wp-ward",
									value: form.ward,
									onChange: set("ward"),
									className: "filter-input",
									placeholder: t("ui.ward_14")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "label-xs",
									htmlFor: "wp-area",
									children: t("ui.area")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "wp-area",
									value: form.area,
									onChange: set("area"),
									className: "filter-input",
									placeholder: t("ui.sarvodaya_nagar")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "label-xs",
									htmlFor: "wp-cost",
									children: t("ui.estimated_cost")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "wp-cost",
									type: "number",
									value: form.estimatedCost,
									onChange: set("estimatedCost"),
									className: "filter-input",
									placeholder: "850000"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "label-xs",
									htmlFor: "wp-priority",
									children: t("ui.priority")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									id: "wp-priority",
									value: form.priority,
									onChange: set("priority"),
									className: "filter-input",
									children: [
										"Low",
										"Moderate",
										"High",
										"Critical"
									].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: p }, p))
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "label-xs",
							htmlFor: "wp-scope",
							children: t("ui.scope_of_work")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "wp-scope",
							value: form.scope,
							onChange: set("scope"),
							rows: 5,
							className: "filter-input",
							placeholder: t("ui.1_pothole_patching_10_2_road_m")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "label-xs",
							htmlFor: "wp-civic-issues",
							children: t("ui.civic_issue_ids_comma_separate")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "wp-civic-issues",
							value: form.civicIssueIds,
							onChange: set("civicIssueIds"),
							className: "filter-input",
							placeholder: t("ui.ci_171850389_ci_2819030")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: submitMutation.isPending,
						className: "action-btn primary w-full",
						children: submitMutation.isPending ? "Publishing..." : "Publish Tender"
					})
				]
			})
		})]
	});
}
//#endregion
export { NewTenderPage as component };
