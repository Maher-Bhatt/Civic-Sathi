import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Trash2 } from "../_libs/lucide-react.mjs";
import { r as useAdminAuth, y as useI18n } from "./router-D6dif84W.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CoNgXAty.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-BRKSCf2X.js
var import_jsx_runtime = require_jsx_runtime();
function AdminSettings() {
	const { t } = useI18n();
	const { admin } = useAdminAuth();
	const handleClearData = () => {
		if (confirm("WARNING: This will clear all shared prototype data from local storage. This action cannot be undone. Are you sure?")) {
			[
				"jm_shared_contractors",
				"jm_shared_work_orders",
				"jm_shared_audit_logs",
				"jm_shared_sla_rules"
			].forEach((key) => localStorage.removeItem(key));
			toast.success("Prototype data cleared successfully. Reload the page to re-initialize defaults.");
			setTimeout(() => window.location.reload(), 1500);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 muni-page-enter max-w-4xl mx-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-bold tracking-tight",
			children: t("ui.platform_settings")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[var(--muted-foreground)]",
			children: t("ui.system_configuration_and_admin")
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.global_notification_settings") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-md bg-[var(--surface-elevated)] border border-[var(--glass-border)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-[var(--muted-foreground)] mb-1",
									children: t("ui.platform_name")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: t("ui.janmind_civic_infrastructure_p")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-md bg-[var(--surface-elevated)] border border-[var(--glass-border)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-[var(--muted-foreground)] mb-1",
									children: t("ui.environment")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: t("ui.prototype_demo")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-md bg-[var(--surface-elevated)] border border-[var(--glass-border)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-[var(--muted-foreground)] mb-1",
									children: t("ui.version")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium font-mono",
									children: t("ui.v1_0_0_prototype")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-md bg-[var(--surface-elevated)] border border-[var(--glass-border)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-[var(--muted-foreground)] mb-1",
									children: t("ui.storage_mode")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: t("ui.browser_localstorage")
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.security_authentication") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center gap-4 p-4 rounded-md bg-[var(--surface-elevated)] border border-[var(--glass-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-12 rounded-full bg-[var(--background)] border border-[var(--glass-border)] flex items-center justify-center text-lg font-bold",
							children: admin?.name?.charAt(0) || "A"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium text-lg",
								children: admin?.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-[var(--muted-foreground)]",
								children: admin?.email
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 inline-flex px-2 py-0.5 rounded text-xs bg-[var(--background)] border border-[var(--glass-border)]",
								children: admin?.role
							})
						] })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "p-6 border-[var(--critical)]/30",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, {
						className: "text-[var(--critical)]",
						children: t("ui.danger_zone")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 p-4 rounded-md bg-[var(--critical)]/5 border border-[var(--critical)]/20",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-medium text-[var(--critical)] mb-2",
								children: t("ui.reset_prototype_data")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-[var(--muted-foreground)] mb-4",
								children: t("ui.this_will_clear_all_shared_pro")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleClearData,
								className: "action-btn flex items-center gap-2 bg-[var(--critical)]/10 text-[var(--critical)] hover:bg-[var(--critical)]/20 border-transparent press",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" }),
									" ",
									t("ui.clear_all_data")
								]
							})
						]
					})]
				})
			]
		})]
	});
}
//#endregion
export { AdminSettings as component };
