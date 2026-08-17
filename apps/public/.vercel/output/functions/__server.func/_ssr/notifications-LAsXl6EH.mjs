import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as require_jsx_runtime, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { F as CircleCheck, H as Bell, T as Info, r as UserCheck } from "../_libs/lucide-react.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as markNotificationsRead, D as cn, O as useI18n, a as LoadingState, d as SectionLabel, i as ErrorState, l as GlassCard, n as AuthGate, r as EmptyState, u as PageShell, x as getNotifications } from "./router-CQgd20Vz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-LAsXl6EH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var icons = {
	received: Info,
	assigned: UserCheck,
	status: Bell,
	resolution: CircleCheck
};
function NotificationItem({ item, index }) {
	const { t } = useI18n();
	const Icon = icons[item.kind];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
		as: "li",
		interactive: true,
		className: "animate-rise list-none p-0",
		style: { animationDelay: `${index * 70}ms` },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/complaint/$id",
			params: { id: item.complaintId },
			className: "flex items-start gap-4 p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full border", item.kind === "resolution" ? "border-[color-mix(in_oklab,var(--success)_40%,transparent)] bg-[color-mix(in_oklab,var(--success)_12%,transparent)] text-success" : "border-border bg-[var(--glass-strong)] text-muted-foreground"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					className: "h-4 w-4",
					"aria-hidden": true
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: item.title
						}), !item.read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-1.5 w-1.5 rounded-full bg-primary",
							"aria-label": t("ui.unread")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: item.body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-[0.68rem] tracking-[0.08em] text-subtle uppercase",
						children: new Date(item.at).toLocaleString(void 0, {
							day: "2-digit",
							month: "short",
							hour: "2-digit",
							minute: "2-digit"
						})
					})
				]
			})]
		})
	});
}
function NotificationsPage() {
	const { t } = useI18n();
	const navigate = useNavigate();
	const { data, isLoading, isError, refetch } = useQuery({
		queryKey: ["notifications"],
		queryFn: getNotifications
	});
	(0, import_react.useEffect)(() => {
		if (data && data.some((n) => !n.read)) markNotificationsRead().catch(console.error);
	}, [data]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, {
		className: "max-w-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "animate-rise space-y-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.updates") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold sm:text-3xl",
				children: t("ui.notifications")
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-7",
			children: [
				isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading notifications..." }),
				isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
					description: "We couldn't load your notifications.",
					onRetry: () => void refetch()
				}),
				data && data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: t("ui.nothing_yet"),
					description: "Updates about your reports will appear here.",
					actionLabel: "Report a problem",
					onAction: () => navigate({ to: "/report" })
				}),
				data && data.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: data.map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationItem, {
						item: n,
						index: i
					}, n.id))
				})
			]
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGate, {
	redirectTo: "/notifications",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsPage, {})
});
//#endregion
export { SplitComponent as component };
