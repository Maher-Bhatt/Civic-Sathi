import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { K as Activity, L as ChevronRight, S as MapPin, u as ShieldCheck, y as MessageSquareText, z as Camera } from "../_libs/lucide-react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { O as useI18n, c as GlassButton, d as SectionLabel, l as GlassCard, u as PageShell } from "./router-DtTrPgUG.mjs";
import { a as DEFAULT_FILTERS, i as ClientCivicMap, l as areaActivity } from "./civic-map-panel-BpR_xYXg.mjs";
import { t as ISSUE_TYPES } from "./types-DzMfRmJh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CqlaopFs.js
var import_jsx_runtime = require_jsx_runtime();
function Landing() {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, {
		className: "pt-24 sm:pt-32",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "animate-rise space-y-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass)] px-3 py-1.5 backdrop-blur-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
								className: "h-3.5 w-3.5 text-primary",
								"aria-hidden": true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[0.68rem] tracking-[0.14em] text-muted-foreground uppercase",
								children: t("home.hero.badge", "Citizen portal")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-3xl leading-[1.08] font-semibold sm:text-5xl lg:text-[3.4rem]",
								children: t("home.hero.subtitle", "Tell us what's happening in your city.")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground",
								children: t("home.hero.desc", "Report a civic problem with your location and evidence. JANMIND helps connect similar reports so important issues can be identified faster.")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 sm:flex-row sm:items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								asChild: true,
								size: "lg",
								className: "w-full sm:w-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/report",
									children: [t("nav.report", "Report a problem"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
										className: "h-4 w-4",
										"aria-hidden": true
									})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								asChild: true,
								size: "lg",
								variant: "glass",
								className: "w-full sm:w-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#how-it-works",
									children: t("home.hero.howitworks", "How it works")
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs leading-relaxed text-subtle",
							children: t("home.hero.smallprint", "Takes about a minute. You don't need to know the department or the category — JANMIND suggests them for you.")
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "animate-rise [animation-delay:120ms]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						elevation: "raised",
						className: "overflow-hidden p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientCivicMap, {
							cityId: "vadodara",
							mode: "health",
							activities: areaActivity("vadodara", DEFAULT_FILTERS),
							points: [],
							selectedAreaId: null,
							onSelectArea: () => {},
							compact: true,
							className: "h-[320px] sm:h-[420px]"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3 px-1.5 pt-2.5 pb-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[0.68rem] tracking-[0.08em] text-subtle uppercase",
								children: t("map.card.label", "Locality civic activity — sample data")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/map",
								className: "text-xs text-primary underline-offset-4 transition-opacity hover:underline hover:opacity-80",
								children: t("map.card.open", "Open Civic Map")
							})]
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "how-it-works",
				className: "scroll-mt-28 pt-20 sm:pt-28",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("hiw.label", "How it works") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 max-w-xl text-2xl font-semibold sm:text-3xl",
						children: t("hiw.heading", "Four steps from a problem on your street to a tracked civic record.")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
						children: [
							{
								n: "01",
								titleKey: "hiw.step1.title",
								bodyKey: "hiw.step1.body",
								icon: MessageSquareText
							},
							{
								n: "02",
								titleKey: "hiw.step2.title",
								bodyKey: "hiw.step2.body",
								icon: MapPin
							},
							{
								n: "03",
								titleKey: "hiw.step3.title",
								bodyKey: "hiw.step3.body",
								icon: Camera
							},
							{
								n: "04",
								titleKey: "hiw.step4.title",
								bodyKey: "hiw.step4.body",
								icon: Activity
							}
						].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							interactive: true,
							className: "animate-rise p-5",
							style: { animationDelay: `${i * 90}ms` },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "label-xs",
										children: s.n
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, {
										className: "h-4 w-4 text-primary",
										"aria-hidden": true
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-6 text-base font-semibold",
									children: t(s.titleKey)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1.5 text-sm text-muted-foreground",
									children: t(s.bodyKey)
								})
							]
						}, s.n))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "pt-20 sm:pt-28",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					elevation: "raised",
					className: "grid gap-8 p-6 sm:p-9 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("pattern.label", "Pattern detection") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-semibold sm:text-3xl",
								children: t("pattern.heading", "One report is a complaint. Many reports are a pattern.")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-relaxed text-muted-foreground",
								children: t("pattern.desc", "When several citizens describe a similar issue nearby, JANMIND groups them into an aggregated hotspot — without exposing anyone's identity or exact private address.")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-2.5 pt-1",
								children: [
									t("pattern.bullet1", "23 similar reports within approximately 500m"),
									t("pattern.bullet2", "127 related reports in Ward 14"),
									t("pattern.bullet3", "Aggregate view only — no personal details shared")
								].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2.5 text-sm text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" }), item]
								}, item))
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("pattern.issues.label", "Issues you can report") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: ISSUE_TYPES.map((type) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full border border-border bg-[var(--glass)] px-3 py-1.5 text-xs text-muted-foreground transition-colors duration-200 hover:text-foreground",
									children: type
								}, type))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								asChild: true,
								className: "mt-4",
								variant: "glass",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/report",
									children: t("pattern.startreport", "Start a report")
								})
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "pt-14 sm:pt-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("stats.label", "Civic intelligence — sample data") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4",
					children: [
						["127", t("stats.reports", "Related reports in Ward 14")],
						["9", t("stats.types", "Issue types")],
						["24h", t("stats.update", "Median first update")],
						["2", t("stats.cities", "Cities supported")]
					].map(([v, k]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "px-4 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-xl font-semibold",
							children: v
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "label-xs mt-1",
							children: k
						})]
					}, k))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mt-20 border-t border-border pt-8 pb-4 text-xs text-subtle",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tracking-[0.14em] uppercase",
						children: t("footer.brand", "JANMIND — Citizen Portal")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("footer.note", "Prototype interface. Data shown is sample data.") })]
				})
			})
		]
	});
}
//#endregion
export { Landing as component };
