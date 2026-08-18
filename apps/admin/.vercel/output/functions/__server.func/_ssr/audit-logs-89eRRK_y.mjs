import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { l as Search, u as RefreshCw } from "../_libs/lucide-react.mjs";
import { S as useI18n, s as getAuditLogs } from "./router-BSWPfuIR.mjs";
import { t as GlassCard } from "./glass-card-CoNgXAty.mjs";
import { n as LoadingState } from "./states-BSypa5q_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/audit-logs-89eRRK_y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuditLogsPage() {
	const { t } = useI18n();
	const [logs, setLogs] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [roleFilter, setRoleFilter] = (0, import_react.useState)("ALL");
	const [entityFilter, setEntityFilter] = (0, import_react.useState)("ALL");
	const [search, setSearch] = (0, import_react.useState)("");
	const [lastRefreshed, setLastRefreshed] = (0, import_react.useState)(/* @__PURE__ */ new Date());
	const loadData = async () => {
		setLoading(true);
		try {
			const data = await getAuditLogs();
			setLogs(data);
			setLastRefreshed(/* @__PURE__ */ new Date());
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadData();
		const interval = setInterval(loadData, 3e4);
		return () => clearInterval(interval);
	}, []);
	const filteredLogs = logs.filter((log) => {
		if (roleFilter !== "ALL" && log.actorRole !== roleFilter) return false;
		if (entityFilter !== "ALL" && log.entityType !== entityFilter) return false;
		if (search && !log.actorName.toLowerCase().includes(search.toLowerCase()) && !log.action.toLowerCase().includes(search.toLowerCase())) return false;
		return true;
	});
	const uniqueRoles = Array.from(new Set(logs.map((l) => l.actorRole)));
	const uniqueEntities = Array.from(new Set(logs.map((l) => l.entityType)));
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading audit logs..." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 muni-page-enter",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: t("ui.system_audit_logs")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[var(--muted-foreground)]",
					children: t("ui.immutable_record_of_platform_a")
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 text-sm text-[var(--muted-foreground)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [t("ui.last_updated"), lastRefreshed.toLocaleTimeString()] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: loadData,
						className: "p-2 glass rounded-md hover:bg-[var(--surface-elevated)] transition-colors",
						title: t("ui.refresh"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-4 h-4 ${loading ? "animate-spin" : ""}` })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
				className: "p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								className: "ambient-field pl-9 w-full",
								placeholder: t("ui.search_actor_or_action"),
								value: search,
								onChange: (e) => setSearch(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "ambient-field min-w-[150px]",
							value: roleFilter,
							onChange: (e) => setRoleFilter(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "ALL",
								children: t("ui.all_roles")
							}), uniqueRoles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: r,
								children: r
							}, r))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "ambient-field min-w-[150px]",
							value: entityFilter,
							onChange: (e) => setEntityFilter(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "ALL",
								children: t("ui.all_entities")
							}), uniqueEntities.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: e,
								children: e
							}, e))]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
				className: "p-0 overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-[var(--glass-border)] text-left text-[var(--muted-foreground)] bg-[var(--surface-elevated)]/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 font-medium",
									children: t("ui.timestamp")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 font-medium",
									children: t("ui.actor")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 font-medium",
									children: t("ui.action")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 font-medium",
									children: t("ui.target_entity")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-3 px-4 font-medium",
									children: t("ui.details")
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
							className: "divide-y divide-[var(--glass-border)]",
							children: [filteredLogs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-[var(--surface-elevated)]/30 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 whitespace-nowrap font-mono text-xs text-[var(--muted-foreground)]",
										children: new Date(log.at).toLocaleString("en-IN")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: log.actorName
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider bg-[var(--background)] border border-[var(--glass-border)] text-[var(--muted-foreground)]",
												children: log.actorRole
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4 whitespace-nowrap",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "px-2 py-1 rounded text-xs font-medium border border-[var(--glass-border)] bg-[var(--surface-elevated)]",
											children: log.action
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: log.entityType }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs text-[var(--muted-foreground)] font-mono",
												children: [log.entityId.substring(0, 8), "..."]
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-3 px-4",
										children: log.reason ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-mono bg-[var(--background)] p-2 rounded border border-[var(--glass-border)] overflow-x-auto max-w-xs",
											children: log.reason
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[var(--muted-foreground)] italic text-xs",
											children: t("ui.no_details")
										})
									})
								]
							}, log.id)), filteredLogs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 5,
								className: "py-12 text-center text-[var(--muted-foreground)]",
								children: t("ui.no_audit_logs_match_your_crite")
							}) })]
						})]
					})
				})
			})
		]
	});
}
//#endregion
export { AuditLogsPage as component };
