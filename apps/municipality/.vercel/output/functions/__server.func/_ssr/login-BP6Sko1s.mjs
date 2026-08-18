import { i as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as CITIES } from "./cities-BuKc8Yb6.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { l as useMuniAuth, u as useI18n } from "./router-BJrV6yDr.mjs";
import { t as GlassCard } from "./glass-card-CtvEoNHg.mjs";
import { t as GlassButton } from "./glass-button-BU7SWYxP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BP6Sko1s.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var fieldBase = "w-full rounded-xl border border-border bg-[var(--glass)] px-4 text-sm text-foreground placeholder:text-subtle outline-none transition-[border-color,box-shadow,background-color] duration-200 ease-out hover:border-[color-mix(in_oklab,var(--foreground)_18%,transparent)] focus:border-primary focus:bg-[var(--glass-strong)] focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--primary)_18%,transparent)]";
var GlassInput = (0, import_react.forwardRef)(function GlassInput({ className, label, hint, error, id, ...props }, ref) {
	const auto = (0, import_react.useId)();
	const inputId = id ?? auto;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: inputId,
				className: "label-xs block",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: inputId,
				ref,
				"aria-invalid": !!error,
				"aria-describedby": hint || error ? `${inputId}-desc` : void 0,
				className: cn(fieldBase, "h-11", error && "border-critical", className),
				...props
			}),
			(hint || error) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				id: `${inputId}-desc`,
				className: cn("text-xs", error ? "text-critical" : "text-subtle"),
				children: error ?? hint
			})
		]
	});
});
(0, import_react.forwardRef)(function GlassTextarea({ className, label, hint, id, ...props }, ref) {
	const auto = (0, import_react.useId)();
	const areaId = id ?? auto;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: areaId,
				className: "label-xs block",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				id: areaId,
				ref,
				className: cn(fieldBase, "resize-none py-3.5 leading-relaxed", className),
				...props
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: hint
			})
		]
	});
});
function MuniLoginPage() {
	const { t } = useI18n();
	const { signIn, officer, ready } = useMuniAuth();
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("vadodara");
	const [remember, setRemember] = (0, import_react.useState)(true);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	if (ready && officer) {
		navigate({
			to: "/dashboard",
			replace: true
		});
		return null;
	}
	async function onSubmit(e) {
		e.preventDefault();
		setBusy(true);
		setError(null);
		try {
			await signIn(email.trim().toLowerCase(), password, city);
			toast.success("Signed in to Municipal Intelligence");
			navigate({ to: "/dashboard" });
		} catch {
			setError("Invalid credentials. Please check your email and password.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "ambient-field flex min-h-screen items-center justify-center bg-background p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
			elevation: "raised",
			className: "animate-rise w-full max-w-md p-6 sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-2xl font-semibold tracking-tight",
						children: t("ui.janmind")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: t("ui.municipal_intelligence")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit,
					className: "mt-8 space-y-4",
					noValidate: true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
							label: t("ui.officer_id_email"),
							type: "email",
							autoComplete: "username",
							required: true,
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: t("ui.officer_vmc_gov_in")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
							label: t("ui.password"),
							type: "password",
							autoComplete: "current-password",
							required: true,
							value: password,
							onChange: (e) => setPassword(e.target.value),
							placeholder: "••••••••",
							error: error ?? void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "label-xs mb-1.5 block",
							children: t("ui.city")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: city,
							onChange: (e) => setCity(e.target.value),
							className: "filter-input",
							children: CITIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c.id,
								children: c.name
							}, c.id))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "label-xs mb-1.5 block",
							children: t("ui.role")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: "Officer",
							readOnly: true,
							className: "filter-input opacity-70"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: remember,
								onChange: (e) => setRemember(e.target.checked),
								className: "rounded border-[var(--glass-border)]"
							}), t("ui.remember_session")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-xs text-primary hover:underline",
							onClick: () => toast.info("Password reset is not available in the prototype."),
							children: t("ui.forgot_password")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
							type: "submit",
							className: "w-full",
							disabled: busy,
							children: busy ? "Signing in..." : "Sign In"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-center text-[0.65rem] text-muted-foreground",
					children: t("ui.janmind_municipal_intelligence")
				})
			]
		})
	});
}
//#endregion
export { MuniLoginPage as component };
