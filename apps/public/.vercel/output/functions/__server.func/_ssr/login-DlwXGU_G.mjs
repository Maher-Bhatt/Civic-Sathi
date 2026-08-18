import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as useI18n, c as GlassButton, d as SectionLabel, l as GlassCard, u as PageShell, w as useAuth } from "./router-hbYygTvF.mjs";
import { r as Route$6 } from "./router-hbYygTvF2.mjs";
import { t as GlassInput } from "./glass-input-C05CvLHo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DlwXGU_G.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const { signIn } = useAuth();
	const { t } = useI18n();
	const navigate = useNavigate();
	const { redirect } = Route$6.useSearch();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			await signIn(email.trim().toLowerCase(), password);
			toast.success(t("login.success", "Signed in"));
			navigate({ to: redirect ?? "/complaints" });
		} catch {
			setError(t("login.error", "We couldn't sign you in. Check your details and try again."));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, {
		className: "max-w-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
			elevation: "raised",
			className: "animate-rise p-6 sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("login.access", "Citizen access") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 text-2xl font-semibold",
					children: t("login.heading", "Sign in")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: t("login.subtext", "Continue to your reports, notifications and complaint history.")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "mt-7 space-y-4",
					noValidate: true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
							label: t("login.email", "Email"),
							type: "email",
							autoComplete: "email",
							required: true,
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: t("login.email.placeholder", "you@example.com")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
							label: t("login.password", "Password"),
							type: "password",
							autoComplete: "current-password",
							required: true,
							value: password,
							onChange: (e) => setPassword(e.target.value),
							placeholder: "••••••••",
							error: error ?? void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
							type: "submit",
							className: "w-full",
							disabled: busy,
							children: busy ? t("login.btn.busy", "Signing in...") : t("login.btn", "Sign in")
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-sm text-muted-foreground",
					children: [
						t("login.new", "New to JANMIND?"),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/register",
							search: { redirect },
							className: "text-primary underline-offset-4 transition-opacity hover:underline hover:opacity-80",
							children: t("login.createaccount", "Create an account")
						})
					]
				})
			]
		})
	});
}
//#endregion
export { LoginPage as component };
