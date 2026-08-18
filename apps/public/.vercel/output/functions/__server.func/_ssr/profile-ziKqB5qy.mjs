import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as useI18n, E as cn, c as GlassButton, d as SectionLabel, l as GlassCard, m as changePassword, n as AuthGate, r as EmptyState, u as PageShell, w as useAuth } from "./router-C39yNYps.mjs";
import { t as GlassInput } from "./glass-input-C05CvLHo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-ziKqB5qy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Toggle({ checked, onChange, label }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		role: "switch",
		"aria-checked": checked,
		onClick: () => onChange(!checked),
		className: "press flex w-full items-center justify-between gap-4 rounded-xl border border-border bg-[var(--glass)] px-4 py-3 text-left hover:bg-[var(--glass-strong)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200", checked ? "bg-primary" : "bg-[color-mix(in_oklab,var(--foreground)_18%,transparent)]"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-background transition-transform duration-200 ease-out",
				style: { transform: checked ? "translateX(16px)" : "none" }
			})
		})]
	});
}
function ProfilePage() {
	const { user, ready, save, signOut } = useAuth();
	const { t } = useI18n();
	const navigate = useNavigate();
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: "",
		ward: ""
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (user) setForm({
			name: user.name,
			email: user.email,
			phone: user.phone,
			ward: user.ward
		});
	}, [user]);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, {
		className: "max-w-2xl",
		children: null
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, {
		className: "max-w-2xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: t("profile.not_signed_in", "You're not signed in"),
			description: t("profile.sign_in_prompt", "Sign in to manage your profile and notification settings."),
			actionLabel: t("auth.sign_in", "Sign in"),
			onAction: () => navigate({
				to: "/login",
				search: { redirect: void 0 }
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, {
		className: "max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "animate-rise space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("nav.profile", "Account") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold sm:text-3xl",
					children: t("profile.title", "Profile")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
				elevation: "raised",
				className: "animate-rise mt-6 space-y-5 p-5 sm:p-7",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-4",
					onSubmit: async (e) => {
						e.preventDefault();
						setBusy(true);
						try {
							await save(form);
							toast.success("Profile updated");
						} catch (error) {
							toast.error("Failed to update profile");
						} finally {
							setBusy(false);
						}
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
							label: t("ui.name"),
							value: form.name,
							onChange: (e) => setForm((f) => ({
								...f,
								name: e.target.value
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
							label: t("ui.email"),
							type: "email",
							value: form.email,
							onChange: (e) => setForm((f) => ({
								...f,
								email: e.target.value
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
							label: t("ui.phone"),
							type: "tel",
							value: form.phone,
							onChange: (e) => setForm((f) => ({
								...f,
								phone: e.target.value
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassInput, {
							label: t("ui.preferred_ward"),
							value: form.ward,
							hint: "Used to surface civic activity near you.",
							onChange: (e) => setForm((f) => ({
								...f,
								ward: e.target.value
							}))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
							type: "submit",
							disabled: busy,
							children: busy ? "Saving..." : "Save changes"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "animate-rise mt-5 space-y-3 p-5 sm:p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.notification_settings") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: t("ui.status_updates_on_my_complaint"),
						checked: user.notifyStatus,
						onChange: (v) => void save({ notifyStatus: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: t("ui.nearby_civic_patterns_in_my_wa"),
						checked: user.notifyNearby,
						onChange: (v) => void save({ notifyNearby: v })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "animate-rise mt-5 flex flex-wrap gap-2 p-5 sm:p-7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
					variant: "glass",
					onClick: async () => {
						await changePassword();
						toast.success("Password reset link sent");
					},
					children: t("ui.change_password")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
					variant: "outline",
					onClick: async () => {
						await signOut();
						navigate({ to: "/" });
					},
					children: t("ui.log_out")
				})]
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGate, {
	redirectTo: "/profile",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfilePage, {})
});
//#endregion
export { SplitComponent as component };
