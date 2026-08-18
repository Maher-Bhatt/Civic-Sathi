import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { _ as useNavigate, f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { Q as markNotificationRead, V as getOfficerNotifications, d as LANGUAGES, l as useMuniAuth, tt as officerSearch, u as useI18n } from "./router-CzUebAlT.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as GlassCard } from "./glass-card-CtvEoNHg.mjs";
import { B as Building2, D as Globe, L as ChevronLeft, N as ClipboardList, S as MapPin, T as LayoutDashboard, V as Bell, _ as Package, a as TriangleAlert, b as Menu, d as Settings, f as Send, i as User, k as FileText, l as Sparkles, n as X, p as Search, t as Zap, x as Map, z as ChartColumn } from "../_libs/lucide-react.mjs";
import { r as LoadingState } from "./states-JpTLzdcL.mjs";
import { n as formatDistanceToNow } from "../_libs/date-fns.mjs";
import { i as getCity, n as CITIES } from "./cities-BuKc8Yb6.mjs";
import { a as SheetTitle, i as SheetHeader, n as SheetContent, t as Sheet } from "./sheet-Dn_BDnu5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-sNW8vnkW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MuniAuthGate({ children }) {
	const { officer, ready } = useMuniAuth();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (ready && !officer) navigate({
			to: "/login",
			replace: true
		});
	}, [
		ready,
		officer,
		navigate
	]);
	if (!ready || !officer) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: ready ? "Redirecting to sign in..." : "Loading municipal session..." })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var NAV = [
	{
		to: "/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/ai-triage",
		label: "AI Triage",
		icon: TriangleAlert
	},
	{
		to: "/map",
		label: "Civic Map",
		icon: Map
	},
	{
		to: "/civic-issues",
		label: "Civic Issues",
		icon: Zap
	},
	{
		to: "/complaints",
		label: "Complaints",
		icon: FileText
	},
	{
		to: "/work-packages",
		label: "Work Packages",
		icon: Package
	},
	{
		to: "/work-orders",
		label: "Work Orders",
		icon: ClipboardList
	},
	{
		to: "/alerts",
		label: "Alerts",
		icon: TriangleAlert
	},
	{
		to: "/departments",
		label: "Departments",
		icon: Building2
	},
	{
		to: "/areas",
		label: "Areas",
		icon: MapPin
	},
	{
		to: "/analytics",
		label: "Analytics",
		icon: ChartColumn
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings
	},
	{
		to: "/profile",
		label: "Profile",
		icon: User
	}
];
function MuniSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
	const { t } = useI18n();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [mobileOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-label": t("ui.close_navigation"),
		className: "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden",
		onClick: onMobileClose
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: cn("fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[var(--glass-border)] bg-[var(--glass-strong)] backdrop-blur-xl transition-all duration-300", collapsed ? "w-[4.5rem]" : "w-60", mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-16 items-center justify-between border-b border-[var(--glass-border)] px-4",
				children: [!collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold tracking-tight",
					children: t("ui.janmind")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[0.65rem] text-muted-foreground",
					children: t("ui.municipal_intelligence")
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onToggle,
					"aria-label": collapsed ? "Expand sidebar" : "Collapse sidebar",
					className: "press hidden rounded-lg p-2 text-muted-foreground hover:bg-[var(--glass)] hover:text-foreground lg:flex",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: cn("h-4 w-4 transition-transform duration-300", collapsed && "rotate-180") })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex-1 space-y-1 overflow-y-auto p-3",
				"aria-label": t("ui.municipality_navigation"),
				children: NAV.map(({ to, label, icon: Icon }) => {
					const active = pathname === to || to !== "/dashboard" && pathname.startsWith(to);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to,
						onClick: onMobileClose,
						className: cn("press flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200", active ? "bg-[var(--surface-elevated)] text-foreground shadow-[var(--shadow-soft)]" : "text-muted-foreground hover:bg-[var(--glass)] hover:text-foreground", collapsed && "justify-center px-2"),
						title: collapsed ? label : void 0,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "h-4 w-4 shrink-0",
							"aria-hidden": true
						}), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
					}, to);
				})
			}),
			!collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-[var(--glass-border)] p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[0.65rem] text-muted-foreground",
					children: t("ui.prototype_intelligence_data")
				})
			})
		]
	})] });
}
function ThemeToggle({ className }) {
	return null;
}
function LanguageToggle({ className }) {
	const { language, setLanguage, t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative inline-flex items-center", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, {
			className: "pointer-events-none absolute left-3 h-3.5 w-3.5 text-muted-foreground",
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			value: language,
			onChange: (e) => setLanguage(e.target.value),
			className: "glass press h-9 cursor-pointer appearance-none rounded-full border border-[var(--glass-border)] bg-[var(--glass)] pl-8 pr-4 text-xs font-medium uppercase tracking-[0.05em] text-muted-foreground outline-none hover:text-foreground",
			"aria-label": t("ui.select_language"),
			children: Object.entries(LANGUAGES).map(([code, name]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
				value: code,
				className: "bg-[var(--surface-elevated)] text-foreground",
				children: [
					code.toUpperCase(),
					" - ",
					name
				]
			}, code))
		})]
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
function MuniSearchCommand({ open, onOpenChange }) {
	const { t } = useI18n();
	const [query, setQuery] = (0, import_react.useState)("");
	const [results, setResults] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!query.trim()) {
			setResults(null);
			return;
		}
		setLoading(true);
		const t = setTimeout(() => {
			officerSearch(query).then(setResults).finally(() => setLoading(false));
		}, 200);
		return () => clearTimeout(t);
	}, [query]);
	(0, import_react.useEffect)(() => {
		if (!open) setQuery("");
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "glass-strong max-w-lg border-[var(--glass-border)] p-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
				className: "border-b border-[var(--glass-border)] p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2 text-sm font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" }), t("ui.officer_search")]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					autoFocus: true,
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: t("ui.complaint_id_area_ward_issue_d"),
					className: "w-full rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 max-h-72 overflow-y-auto",
					children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: t("ui.searching")
					}), !loading && query && results && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							results.complaints.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-xs mb-2",
								children: t("ui.complaints")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1",
								children: results.complaints.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/complaints/$id",
									params: { id: c.id },
									onClick: () => onOpenChange(false),
									className: "flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-[var(--glass)]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5 text-muted-foreground" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.id }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: ["— ", c.category]
										})
									]
								}) }, c.id))
							})] }),
							results.issues.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "label-xs mb-2",
								children: t("ui.emerging_issues")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1",
								children: results.issues.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/issues/$id",
									params: { id: i.id },
									onClick: () => onOpenChange(false),
									className: "flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-[var(--glass)]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3.5 w-3.5 text-muted-foreground" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: i.category }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: ["— ", i.areaName]
										})
									]
								}) }, i.id))
							})] }),
							results.complaints.length === 0 && results.issues.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: t("ui.no_results_found")
							})
						]
					})]
				})]
			})]
		})
	});
}
function NotificationDrawer({ open, onOpenChange }) {
	const { t } = useI18n();
	const [notifications, setNotifications] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (open) getOfficerNotifications().then(setNotifications);
	}, [open]);
	async function handleRead(id) {
		await markNotificationRead(id);
		setNotifications((n) => n.map((x) => x.id === id ? {
			...x,
			read: true
		} : x));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			className: "glass-strong w-full border-l border-[var(--glass-border)] sm:max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: t("ui.notifications") }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 space-y-3",
				children: notifications.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: cn("animate-rise rounded-xl border border-[var(--glass-border)] p-4 transition-colors", !n.read && "bg-[var(--glass)]"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: n.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: n.body
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-[0.65rem] text-subtle",
								children: formatDistanceToNow(new Date(n.at), { addSuffix: true })
							})
						] }), !n.read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => handleRead(n.id),
							className: "shrink-0 text-[0.65rem] text-primary hover:underline",
							children: t("ui.mark_read")
						})]
					}), n.link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: n.link,
						onClick: () => onOpenChange(false),
						className: "mt-2 inline-block text-xs text-primary hover:underline",
						children: t("ui.view_details")
					})]
				}, n.id))
			})]
		})
	});
}
function MuniHeader({ onMenuClick, sidebarCollapsed }) {
	const { t } = useI18n();
	const { officer } = useMuniAuth();
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const [notifOpen, setNotifOpen] = (0, import_react.useState)(false);
	const city = officer ? getCity(officer.city) : CITIES[0];
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "/" && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement)) {
				e.preventDefault();
				setSearchOpen(true);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: cn("sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-[var(--glass-border)] bg-[var(--glass-strong)] px-4 backdrop-blur-xl transition-all duration-300 lg:px-6", sidebarCollapsed ? "lg:pl-[calc(4.5rem+1rem)]" : "lg:pl-[calc(15rem+1rem)]"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onMenuClick,
					className: "press rounded-lg p-2 text-muted-foreground hover:bg-[var(--glass)] lg:hidden",
					"aria-label": t("ui.open_navigation"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden min-w-0 sm:block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm font-semibold",
						children: t("ui.janmind")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-[0.65rem] text-muted-foreground",
						children: t("ui.municipal_intelligence")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "ml-auto flex items-center gap-2 sm:gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-1 text-xs text-muted-foreground md:inline",
							children: city?.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSearchOpen(true),
							className: "press flex items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-2 text-xs text-muted-foreground",
							"aria-label": t("ui.search_press"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: t("ui.search")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
									className: "hidden rounded border border-[var(--glass-border)] px-1.5 py-0.5 text-[0.6rem] sm:inline",
									children: "/"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setNotifOpen(true),
							className: "press relative rounded-lg p-2 text-muted-foreground hover:bg-[var(--glass)] hover:text-foreground",
							"aria-label": t("ui.notifications"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-critical" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageToggle, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/profile",
							className: "press flex items-center gap-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-2 py-1.5 sm:px-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-7 w-7 items-center justify-center rounded-full bg-primary/20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5 text-primary" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden min-w-0 lg:block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-xs font-medium",
									children: officer?.department
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-[0.65rem] text-muted-foreground",
									children: officer?.role
								})]
							})]
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuniSearchCommand, {
			open: searchOpen,
			onOpenChange: setSearchOpen
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationDrawer, {
			open: notifOpen,
			onOpenChange: setNotifOpen
		})
	] });
}
function MuniLayout({ children }) {
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "ambient-field min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuniSidebar, {
			collapsed,
			onToggle: () => setCollapsed((c) => !c),
			mobileOpen,
			onMobileClose: () => setMobileOpen(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("min-h-screen transition-all duration-300", collapsed ? "lg:pl-[4.5rem]" : "lg:pl-60"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuniHeader, {
				onMenuClick: () => setMobileOpen(true),
				sidebarCollapsed: collapsed
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "animate-fade p-4 lg:p-6",
				children
			})]
		})]
	});
}
function AiCopilotWidget() {
	const { t } = useI18n();
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [messages, setMessages] = (0, import_react.useState)([{
		role: "ai",
		text: "Hello! I am your JANMIND AI Copilot. I can help you analyze project risks, review contractor performance, or summarize systemic issues. How can I help you today?"
	}]);
	const [input, setInput] = (0, import_react.useState)("");
	const handleSend = () => {
		if (!input.trim()) return;
		setMessages((prev) => [...prev, {
			role: "user",
			text: input
		}]);
		const currentInput = input;
		setInput("");
		setTimeout(() => {
			setMessages((prev) => [...prev, {
				role: "ai",
				text: `Based on current analytics, the issues related to "${currentInput}" show a 15% increase in the last 7 days. I recommend prioritizing work orders in the central ward to mitigate risk.`
			}]);
		}, 1e3);
	};
	if (!isOpen) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: () => setIsOpen(true),
		className: "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-lg transition-transform hover:scale-105 active:scale-95",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-6 w-6" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
		className: "fixed bottom-6 right-6 z-50 flex h-[500px] w-[350px] flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-[var(--glass-border)] bg-[var(--primary)] p-4 text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("ui.janmind_copilot") })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setIsOpen(false),
					className: "rounded-full p-1 hover:bg-white/20 transition-colors",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--surface)]",
				children: messages.map((msg, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.role === "user" ? "bg-[var(--primary)] text-white" : "bg-[var(--surface-elevated)] border border-[var(--glass-border)] text-[var(--foreground)]"}`,
						children: msg.text
					})
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-t border-[var(--glass-border)] bg-[var(--surface-elevated)] p-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						handleSend();
					},
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: input,
						onChange: (e) => setInput(e.target.value),
						placeholder: t("ui.ask_copilot"),
						className: "flex-1 rounded-full border border-[var(--glass-border)] bg-[var(--surface)] px-4 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: !input.trim(),
						className: "flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-white disabled:opacity-50 transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
					})]
				})
			})
		]
	});
}
function MuniAuthLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MuniAuthGate, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MuniLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiCopilotWidget, {})] });
}
//#endregion
export { MuniAuthLayout as component };
