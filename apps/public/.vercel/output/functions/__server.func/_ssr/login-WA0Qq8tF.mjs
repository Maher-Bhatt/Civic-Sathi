import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as PageShell, b as useAuth, n as GlassButton, o as SectionLabel, r as GlassCard } from "./glass-card-BssLVty0.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as Route$6 } from "./router-BpQlMeTC2.mjs";
import { t as GlassInput } from "./glass-input-CYvQYq1E.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-WA0Qq8tF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const { signIn } = useAuth();
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
			await signIn(email, password);
			toast.success("Signed in");
			navigate({ to: redirect ?? "/complaints" });
		} catch {
			setError("We couldn't sign you in. Check your details and try again.");
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: "Citizen access" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 text-2xl font-semibold",
					children: "Sign in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Continue to your reports, notifications and complaint history."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "mt-7 space-y-4",
					noValidate: true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
							label: "Email",
							type: "email",
							autoComplete: "email",
							required: true,
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "you@example.com"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
							label: "Password",
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
							children: busy ? "Signing in..." : "Sign in"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-sm text-muted-foreground",
					children: [
						"New to JANMIND?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/register",
							search: { redirect },
							className: "text-primary underline-offset-4 transition-opacity hover:underline hover:opacity-80",
							children: "Create an account"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { LoginPage as component };
