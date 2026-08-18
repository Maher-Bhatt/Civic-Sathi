import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { H as getSavedViews, R as getMuniComplaints, l as useMuniAuth, s as Route$10, u as useI18n, x as bulkUpdateComplaints } from "./router-5cAWMaYB.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CtvEoNHg.mjs";
import { t as GlassButton } from "./glass-button-BU7SWYxP.mjs";
import { A as Download, O as Funnel } from "../_libs/lucide-react.mjs";
import { r as LoadingState } from "./states-JpTLzdcL.mjs";
import { n as SeverityBadge, r as StatusBadge } from "./status-badge-DreJLRai.mjs";
import { r as format } from "../_libs/date-fns.mjs";
import { n as DEFAULT_COMPLAINT_FILTERS } from "./types-CjX07JOU.mjs";
import { t as FilterDrawer } from "./filter-drawer-BOUyq0gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/complaints-C2uPFF6w.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Table = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "relative w-full overflow-auto",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
		ref,
		className: cn("w-full caption-bottom text-sm", className),
		...props
	})
}));
Table.displayName = "Table";
var TableHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
	ref,
	className: cn("[&_tr]:border-b", className),
	...props
}));
TableHeader.displayName = "TableHeader";
var TableBody = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
	ref,
	className: cn("[&_tr:last-child]:border-0", className),
	...props
}));
TableBody.displayName = "TableBody";
var TableFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", {
	ref,
	className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
	...props
}));
TableFooter.displayName = "TableFooter";
var TableRow = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
	ref,
	className: cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className),
	...props
}));
TableRow.displayName = "TableRow";
var TableHead = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
	ref,
	className: cn("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableHead.displayName = "TableHead";
var TableCell = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
	ref,
	className: cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableCell.displayName = "TableCell";
var TableCaption = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
	ref,
	className: cn("mt-4 text-sm text-muted-foreground", className),
	...props
}));
TableCaption.displayName = "TableCaption";
function ComplaintTable({ complaints, selected, onSelect, sortKey, sortDir, onSort }) {
	const { t } = useI18n();
	function toggleAll() {
		if (selected.size === complaints.length) onSelect(/* @__PURE__ */ new Set());
		else onSelect(new Set(complaints.map((c) => c.id)));
	}
	function toggleOne(id) {
		const next = new Set(selected);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		onSelect(next);
	}
	const SortHead = ({ k, children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => onSort(k),
		className: "flex items-center gap-1 text-left hover:text-foreground",
		children: [children, sortKey === k && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[0.6rem]",
			children: sortDir === "asc" ? "↑" : "↓"
		})]
	}) });
	if (complaints.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-2xl border border-[var(--glass-border)] bg-[var(--surface)] p-12 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: t("ui.no_complaints_match_the_select")
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto rounded-2xl border border-[var(--glass-border)] bg-[var(--surface)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
			className: "hover:bg-transparent",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "w-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: selected.size === complaints.length && complaints.length > 0,
						onChange: toggleAll,
						"aria-label": t("ui.select_all")
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
					k: "id",
					children: t("ui.complaint_id")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
					k: "category",
					children: t("ui.category")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
					k: "area",
					children: t("ui.area")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
					k: "ward",
					children: t("ui.ward")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
					k: "severity",
					children: t("ui.severity")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
					k: "department",
					children: t("ui.department")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
					k: "status",
					children: t("ui.status")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHead, {
					k: "createdAt",
					children: t("ui.created")
				})
			]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: complaints.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
			className: cn("transition-colors duration-150 hover:bg-[var(--glass)]", selected.has(c.id) && "bg-[var(--glass)]"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: selected.has(c.id),
					onChange: () => toggleOne(c.id),
					"aria-label": `Select ${c.id}`
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/complaints/$id",
					params: { id: c.id },
					className: "font-medium text-primary hover:underline",
					children: c.id
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-sm",
					children: c.category
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-sm text-muted-foreground",
					children: c.area
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-sm text-muted-foreground",
					children: c.ward
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { severity: c.severity }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-sm",
					children: c.department
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.status }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-xs text-muted-foreground",
					children: format(new Date(c.createdAt), "dd MMM yyyy")
				})
			]
		}, c.id)) })] })
	});
}
function ComplaintsPage() {
	const { t } = useI18n();
	const { officer } = useMuniAuth();
	const { area: areaSearch } = Route$10.useSearch();
	const [complaints, setComplaints] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [filters, setFilters] = (0, import_react.useState)({
		...DEFAULT_COMPLAINT_FILTERS,
		city: officer?.city ?? "all",
		area: areaSearch
	});
	const [filterOpen, setFilterOpen] = (0, import_react.useState)(false);
	const [selected, setSelected] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [sortKey, setSortKey] = (0, import_react.useState)("createdAt");
	const [sortDir, setSortDir] = (0, import_react.useState)("desc");
	const [savedViews, setSavedViews] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (areaSearch) setFilters((f) => ({
			...f,
			area: areaSearch
		}));
	}, [areaSearch]);
	(0, import_react.useEffect)(() => {
		setLoading(true);
		getMuniComplaints(filters).then(setComplaints).finally(() => setLoading(false));
		getSavedViews().then(setSavedViews);
	}, [filters]);
	const sorted = (0, import_react.useMemo)(() => {
		const list = [...complaints];
		list.sort((a, b) => {
			const av = a[sortKey];
			const bv = b[sortKey];
			const cmp = String(av).localeCompare(String(bv));
			return sortDir === "asc" ? cmp : -cmp;
		});
		return list;
	}, [
		complaints,
		sortKey,
		sortDir
	]);
	function onSort(key) {
		if (sortKey === key) setSortDir((d) => d === "asc" ? "desc" : "asc");
		else {
			setSortKey(key);
			setSortDir("asc");
		}
	}
	async function bulkAssign(dept) {
		if (selected.size === 0) return;
		await bulkUpdateComplaints([...selected], {
			department: dept,
			status: "Assigned"
		});
		toast.success(`Assigned ${selected.size} complaints to ${dept}`);
		setSelected(/* @__PURE__ */ new Set());
		const refreshed = await getMuniComplaints(filters);
		setComplaints(refreshed);
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading complaints..." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "muni-page-enter space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.complaint_management") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 text-2xl font-semibold",
						children: t("ui.all_civic_reports")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							sorted.length,
							" ",
							t("ui.complaints_prototype_intellige")
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
						variant: "outline",
						size: "sm",
						onClick: () => setFilterOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3.5 w-3.5" }), t("ui.filters")]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
						variant: "outline",
						size: "sm",
						onClick: () => toast.info("Export is not available in the prototype."),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), t("ui.export")]
					})]
				})]
			}),
			savedViews.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: savedViews.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setFilters((f) => ({
						...f,
						...v.filters["category"] ? { category: v.filters["category"] } : {},
						...v.filters["severity"] ? { severity: v.filters["severity"] } : {},
						...v.filters["ward"] ? { ward: v.filters["ward"] } : {}
					})),
					className: "press rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-1 text-xs text-muted-foreground hover:text-foreground",
					children: v.name
				}, v.id))
			}),
			selected.size > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				elevation: "flat",
				className: "flex flex-wrap items-center gap-3 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted-foreground",
						children: [
							selected.size,
							" ",
							t("ui.selected")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void bulkAssign("Water Supply"),
						className: "action-btn bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20",
						children: t("ui.bulk_verify")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => toast.success("Opening bulk classification..."),
						className: "action-btn",
						children: t("ui.bulk_classify")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComplaintTable, {
				complaints: sorted,
				selected,
				onSelect: setSelected,
				sortKey,
				sortDir,
				onSort
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterDrawer, {
				open: filterOpen,
				onOpenChange: setFilterOpen,
				filters,
				onChange: (p) => setFilters((f) => ({
					...f,
					...p
				})),
				onApply: () => setFilterOpen(false),
				onClear: () => setFilters({
					...DEFAULT_COMPLAINT_FILTERS,
					city: officer?.city ?? "all"
				})
			})
		]
	});
}
//#endregion
export { ComplaintsPage as component };
