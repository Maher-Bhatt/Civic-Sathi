import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { l as useMuniAuth, u as useI18n } from "./router-DV23Twyx.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CtvEoNHg.mjs";
import { t as GlassButton } from "./glass-button-BU7SWYxP.mjs";
import { r as LoadingState } from "./states-JpTLzdcL.mjs";
import { n as CITIES } from "./cities-BuKc8Yb6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-l5hoiAz6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const { t } = useI18n();
	const { settings, updateSettings, ready } = useMuniAuth();
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading settings..." });
	const current = draft ?? settings;
	if (!current) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading settings..." });
	function patch(p) {
		setDraft((d) => ({
			...current,
			...d ?? {},
			...p
		}));
	}
	async function handleSave() {
		setSaving(true);
		try {
			await updateSettings(draft ?? {});
			setDraft(null);
			toast.success("Settings saved");
		} finally {
			setSaving(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "muni-page-enter mx-auto max-w-2xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.portal_settings") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-2xl font-semibold",
					children: t("ui.preferences")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: t("ui.settings_are_stored_locally_in")
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				elevation: "raised",
				className: "space-y-6 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "label-xs mb-1.5 block",
						children: t("ui.theme")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: current.theme,
						onChange: (e) => patch({ theme: e.target.value }),
						className: "filter-input",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "system",
								children: t("ui.system")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "dark",
								children: t("ui.dark")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "light",
								children: t("ui.light")
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "label-xs mb-1.5 block",
						children: t("ui.default_city")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: current.defaultCity,
						onChange: (e) => patch({ defaultCity: e.target.value }),
						className: "filter-input",
						children: CITIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c.id,
							children: c.name
						}, c.id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "label-xs mb-1.5 block",
						children: t("ui.default_map_mode")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: current.defaultMapMode,
						onChange: (e) => patch({ defaultMapMode: e.target.value }),
						className: "filter-input",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "health",
								children: t("ui.area_health")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "activity",
								children: t("ui.complaint_activity")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "hotspots",
								children: t("ui.hotspots")
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: current.compactMode,
							onChange: (e) => patch({ compactMode: e.target.checked }),
							className: "rounded border-[var(--glass-border)]"
						}), t("ui.compact_mode")]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				elevation: "raised",
				className: "space-y-4 p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.notifications") }), [
					["critical", "Critical alerts"],
					["assignments", "Assignment updates"],
					["riskChanges", "Risk score changes"],
					["dailyDigest", "Daily digest email"]
				].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center justify-between text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: current.notifications[key],
						onChange: (e) => patch({ notifications: {
							...current.notifications,
							[key]: e.target.checked
						} }),
						className: "rounded border-[var(--glass-border)]"
					})]
				}, key))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
				onClick: () => void handleSave(),
				disabled: saving || !draft,
				children: saving ? "Saving..." : "Save changes"
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
