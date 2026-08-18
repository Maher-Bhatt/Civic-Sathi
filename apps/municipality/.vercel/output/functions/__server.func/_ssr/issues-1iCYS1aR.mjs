import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { W as getSystemicIssues, l as useMuniAuth, u as useI18n } from "./router-CzUebAlT.mjs";
import { n as SectionLabel } from "./glass-card-CtvEoNHg.mjs";
import { r as LoadingState, t as EmptyState } from "./states-JpTLzdcL.mjs";
import { t as EmergingIssueCard } from "./emerging-issue-card-DChM2a7z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/issues-1iCYS1aR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function IssuesPage() {
	const { t } = useI18n();
	const { officer } = useMuniAuth();
	const [issues, setIssues] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		getSystemicIssues(officer?.city).then(setIssues).finally(() => setLoading(false));
	}, [officer?.city]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading emerging issues..." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "muni-page-enter space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.emerging_systemic_issues") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-2xl font-semibold",
				children: t("ui.patterns_janmind_has_detected")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: t("ui.prototype_intelligence_data")
			})
		] }), issues.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: t("ui.no_critical_issues"),
			description: "No emerging systemic issues at this time."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
			children: issues.map((issue, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmergingIssueCard, {
				issue,
				delay: i * 60
			}, issue.id))
		})]
	});
}
//#endregion
export { IssuesPage as component };
