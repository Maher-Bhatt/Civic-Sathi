import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as useI18n, E as useAuth, c as GlassButton, d as PageShell, f as SectionLabel, l as GlassCard } from "./router-Dm6JxT_p.mjs";
import { n as Route$2 } from "./router-Dm6JxT_p2.mjs";
import { t as GlassInput } from "./glass-input-CDTJIFw9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-D2r7FqJ2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RegisterPage() {
	const { signUp } = useAuth();
	const { t } = useI18n();
	const navigate = useNavigate();
	const { redirect } = Route$2.useSearch();
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: "",
		password: ""
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const set = (k) => (e) => setForm((f) => ({
		...f,
		[k]: e.target.value
	}));
	async function onSubmit(e) {
		e.preventDefault();
		if (form.password.length < 8) {
			setError(t("register.password.error", "Password must be at least 8 characters."));
			return;
		}
		const normalizedForm = {
			...form,
			email: form.email.trim().toLowerCase(),
			phone: form.phone.replace(/\s+/g, "")
		};
		setBusy(true);
		setError(null);
		try {
			await signUp(normalizedForm);
			toast.success(t("register.success", "Account created"));
			navigate({ to: redirect ?? "/report" });
		} catch (err) {
			const detail = err?.details || err?.message || "";
			if (detail.toLowerCase().includes("already exists") || detail.includes("409")) setError("An account with this email already exists. Sign in instead.");
			else if (detail.toLowerCase().includes("phone")) setError("Please enter a valid 10-digit phone number.");
			else setError(t("register.error", "We couldn't create your account right now."));
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("register.access", "Citizen access") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 text-2xl font-semibold",
					children: t("register.heading", "Create your account")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: t("register.subtext", "Your contact details stay private and are never shown on public maps.")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "mt-7 space-y-4",
					noValidate: true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
							label: t("register.name", "Full name"),
							required: true,
							autoComplete: "name",
							value: form.name,
							onChange: set("name"),
							placeholder: t("register.name.placeholder", "Your name")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
							label: t("register.email", "Email"),
							type: "email",
							required: true,
							autoComplete: "email",
							value: form.email,
							onChange: set("email"),
							placeholder: t("register.email.placeholder", "you@example.com")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
							label: t("register.phone", "Phone"),
							type: "tel",
							required: true,
							autoComplete: "tel",
							value: form.phone,
							onChange: set("phone"),
							placeholder: t("register.phone.placeholder", "+91 00000 00000")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
							label: t("register.password", "Password"),
							type: "password",
							required: true,
							minLength: 8,
							autoComplete: "new-password",
							value: form.password,
							onChange: set("password"),
							placeholder: t("register.password.placeholder", "At least 8 characters"),
							error: error ?? void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
							type: "submit",
							className: "w-full",
							disabled: busy,
							children: busy ? t("register.btn.busy", "Creating account...") : t("register.btn", "Create account")
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-6 text-sm text-muted-foreground",
					children: [
						t("register.existing", "Already registered?"),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							search: { redirect },
							className: "text-primary underline-offset-4 transition-opacity hover:underline hover:opacity-80",
							children: t("register.signin", "Sign in")
						})
					]
				})
			]
		})
	});
}
//#endregion
export { RegisterPage as component };
