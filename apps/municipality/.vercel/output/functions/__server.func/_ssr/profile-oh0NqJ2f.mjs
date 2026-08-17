import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { l as useMuniAuth, u as useI18n } from "./router-BQGJ9DUB.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CtvEoNHg.mjs";
import { t as GlassButton } from "./glass-button-BU7SWYxP.mjs";
import { C as LogOut } from "../_libs/lucide-react.mjs";
import { r as LoadingState } from "./states-JpTLzdcL.mjs";
import { i as getCity } from "./cities-BuKc8Yb6.mjs";
import { r as format } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-oh0NqJ2f.js
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const { t } = useI18n();
	const { officer, ready, signOut } = useMuniAuth();
	const navigate = useNavigate();
	if (!ready || !officer) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading profile..." });
	const city = getCity(officer.city);
	async function handleSignOut() {
		await signOut();
		toast.success("Signed out");
		navigate({ to: "/login" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "muni-page-enter mx-auto max-w-lg space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.officer_profile") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-2xl font-semibold",
					children: officer.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: officer.email
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
				elevation: "raised",
				className: "p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "space-y-4 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: t("ui.officer_id")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-medium tabular-nums",
								children: officer.id
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: t("ui.department")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-medium",
								children: officer.department
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: t("ui.role")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-medium",
								children: officer.role
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: t("ui.city")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-medium",
								children: city?.name ?? officer.city
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: t("ui.last_active")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: format(new Date(officer.lastActive), "dd MMM yyyy, HH:mm") })]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-xs text-muted-foreground",
				children: t("ui.frontend_only_mock_authenticat")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
				variant: "outline",
				className: "w-full",
				onClick: () => void handleSignOut(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), t("ui.sign_out")]
			})
		]
	});
}
//#endregion
export { ProfilePage as component };
