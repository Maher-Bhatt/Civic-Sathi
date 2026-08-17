import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as Shield, w as ArrowRight } from "../_libs/lucide-react.mjs";
import { r as useAdminAuth, y as useI18n } from "./router-85yTTTOo.mjs";
import { t as GlassCard } from "./glass-card-CoNgXAty.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BVd6dbrI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminLogin() {
	const { t } = useI18n();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const navigate = useNavigate();
	const { signIn } = useAdminAuth();
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			if (await signIn(email.trim().toLowerCase(), password)) {
				toast.success("Signed in successfully");
				navigate({
					to: "/admin/dashboard",
					replace: true
				});
			} else toast.error("Invalid credentials");
		} catch (error) {
			toast.error("An error occurred during sign in");
		} finally {
			setIsLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen flex items-center justify-center bg-[var(--background)] p-4 muni-page-enter",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
			className: "w-full max-w-md p-8 relative overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/10 rounded-bl-full -z-10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center text-center mb-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-16 h-16 rounded-full bg-[var(--surface-elevated)] border border-[var(--glass-border)] flex items-center justify-center mb-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-8 h-8 text-[var(--foreground)]" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-bold tracking-tight mb-2",
							children: t("ui.janmind_admin")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[var(--muted-foreground)]",
							children: t("ui.platform_administration")
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "label-xs",
								htmlFor: "email",
								children: t("ui.email_address")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "email",
								type: "email",
								required: true,
								className: "ambient-field w-full",
								placeholder: t("ui.admin_janmind_gov_in"),
								value: email,
								onChange: (e) => setEmail(e.target.value),
								disabled: isLoading
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "label-xs",
								htmlFor: "password",
								children: t("ui.password")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "password",
								type: "password",
								required: true,
								className: "ambient-field w-full",
								placeholder: "••••••••",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								disabled: isLoading
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: isLoading,
							className: "action-btn primary w-full flex items-center justify-center gap-2 press",
							children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("ui.sign_in_to_platform") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4" })] })
						})
					]
				})
			]
		})
	});
}
//#endregion
export { AdminLogin as component };
