import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { H as getSystemicIssues, l as useMuniAuth } from "./router-Cd9GNziQ.mjs";
import { n as SectionLabel } from "./glass-card-CtvEoNHg.mjs";
import { r as LoadingState, t as EmptyState } from "./states-JpTLzdcL.mjs";
import { t as EmergingIssueCard } from "./emerging-issue-card-DZwxnAu3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/issues-Ctx2GS1X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function IssuesPage() {
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Emerging Systemic Issues" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-2xl font-semibold",
				children: "Patterns JANMIND has detected"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Prototype Intelligence Data"
			})
		] }), issues.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No critical issues",
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
