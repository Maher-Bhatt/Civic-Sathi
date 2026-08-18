import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { C as MapPin, E as Landmark, F as Crown, G as Building2, P as Droplets, U as Camera, V as ChevronRight, X as Activity, b as MessageSquareText, c as Sparkles, f as Scroll, o as Trees } from "../_libs/lucide-react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as getDefaultCity, u as setPreferredCity } from "./cities-J8wcazPB.mjs";
import { D as useI18n, E as cn, c as GlassButton, d as SectionLabel, l as GlassCard, u as PageShell } from "./router-CNrgRJRt.mjs";
import { a as DEFAULT_FILTERS, i as ClientCivicMap, l as areaActivity } from "./civic-map-panel-9c2pghJ_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C48f44yF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HERITAGE_DATA = {
	vadodara: {
		cityName: "Vadodara",
		cityTitle: "Sanskari Nagari",
		vernacularName: "વડોદરા · સંસ્કારી નગરી",
		epithet: "The Cultural & Intellectual Capital of Gujarat",
		intro: "Shaped by the visionary governance of Maharaja Sayajirao Gaekwad III, Vadodara was among the first Indian cities to build underground civic drainage, municipal libraries, and public botanical reserves in the 1890s.",
		stories: [
			{
				id: "sayajirao-vision",
				title: "The Sayajirao Gaekwad III Urban Vision",
				vernacular: "મહારાજા સયાજીરાવ ગાયકવાડ ત્રીજાની નગર રચના",
				era: "1875 – 1939 CE",
				category: "civic",
				tagline: "Pioneered India's First Universal Public Drainage & Free Municipal Education",
				civicLegacy: "Maharaja Sayajirao III instituted compulsory free schooling, established the Central Library network, and engineered the 1890 underground drainage & water works long before most global cities.",
				quote: "“The remedy for all ills is education and enlightened civic infrastructure.” — Maharaja Sayajirao III",
				icon: Crown,
				color: "#FF6F00",
				gradient: "from-amber-500/20 via-orange-500/10 to-transparent"
			},
			{
				id: "laxmi-vilas",
				title: "Laxmi Vilas Palace & Royal Planning",
				vernacular: "લક્ષ્મી વિલાસ મહેલ",
				era: "Built 1890 CE",
				category: "palace",
				tagline: "Indo-Saracenic Wonder (4× the Size of Buckingham Palace)",
				civicLegacy: "Designed by Major Charles Mant with European hydraulic elevators and ornate civic courtyards, setting the architectural standard for Baroda's public buildings.",
				quote: "A testament to harmonious blend of Maratha, Mughal, Rajput, and Gothic civic architecture.",
				icon: Building2,
				color: "#D97706",
				gradient: "from-yellow-500/20 via-amber-500/10 to-transparent"
			},
			{
				id: "nyay-mandir",
				title: "Mandvi Gate & Nyay Mandir",
				vernacular: "માંડવી દરવાજો અને ન્યાય મંદિર",
				era: "16th – 19th Century",
				category: "civic",
				tagline: "The Historic Citadel Crossroads & Temple of Justice",
				civicLegacy: "Mandvi Gate stood as the fortified gateway to old Baroda, while Robert Chisholm's Byzantine-inspired Nyay Mandir served as the apex of transparent municipal justice.",
				quote: "The historic central heart where four ancient trade pathways converged.",
				icon: Landmark,
				color: "#0A369D",
				gradient: "from-blue-500/20 via-indigo-500/10 to-transparent"
			},
			{
				id: "sayaji-baug-ajwa",
				title: "Kamati Baug & The Ajwa Water Reservoir",
				vernacular: "કમટી બાગ અને આજવા જળાશય",
				era: "Dedicated 1879 CE",
				category: "water",
				tagline: "113-Acre Botanical Sanctuary & Gravity Water Pipeline",
				civicLegacy: "The Ajwa Reservoir engineered a perennial gravity-fed pure water supply to Vadodara residents, paired with Kamati Baug's 98 rare tree species along the Vishwamitri river.",
				quote: "Lifeline water engineering that still powers Vadodara's east ward distribution.",
				icon: Droplets,
				color: "#0E8A4B",
				gradient: "from-emerald-500/20 via-teal-500/10 to-transparent"
			}
		]
	},
	bengaluru: {
		cityName: "Bengaluru",
		cityTitle: "Garden City & Tech Horizon",
		vernacularName: "ಬೆಂಗಳೂರು · ಉದ್ಯಾನ ನಗರಿ",
		epithet: "The Silicon Valley & Garden Capital of India",
		intro: "From Kempe Gowda's 1537 medieval Pete and 4 watchtowers to Sir M. Visvesvaraya's engineering masterworks, Bengaluru pioneered high-plateau cascade lake systems and Asia's first electrified streetlights.",
		stories: [
			{
				id: "kempegowda-fort",
				title: "Kempe Gowda I & The 1537 Pete Settlement",
				vernacular: "ಕೆಂಪೇಗೌಡರ ಪೇಟೆ ಮತ್ತು ನಾಲ್ಕು ಗೋಪುರಗಳು",
				era: "1537 CE",
				category: "civic",
				tagline: "Visionary Four Watchtowers & Guild Trading Markets",
				civicLegacy: "Kempe Gowda demarcated Bengaluru with 4 cardinal watchtowers (Lalbagh, Kempe Gowda Tower, Bugle Rock, Ulsoor) and created specialized trade petes (Chickpet, Balepet, Tharagupet).",
				quote: "“May this settlement grow to encompass the four watchtowers.” — Kempe Gowda I",
				icon: Crown,
				color: "#FF6F00",
				gradient: "from-orange-500/20 via-amber-500/10 to-transparent"
			},
			{
				id: "lalbagh-gardens",
				title: "Lalbagh Botanical Gardens & The Glass House",
				vernacular: "ಲಾಲ್‌ಬಾಗ್ ಸಸ್ಯತೋಟ ಮತ್ತು ಗಾಜಿನ ಮನೆ",
				era: "1760 – 1889 CE",
				category: "nature",
				tagline: "240-Acre Royal Botanical Haven with 1,854 Species",
				civicLegacy: "Commissioned by Hyder Ali and enriched by Tipu Sultan with exotic saplings from Persia and France. The 1889 Glasshouse was modeled after London's Crystal Palace.",
				quote: "The green lungs that earned Bengaluru its global title of 'The Garden City of India'.",
				icon: Trees,
				color: "#0E8A4B",
				gradient: "from-emerald-500/20 via-green-500/10 to-transparent"
			},
			{
				id: "vidhana-soudha",
				title: "Vidhana Soudha & Attara Kacheri",
				vernacular: "ವಿಧಾನ ಸೌಧ ಮತ್ತು ಅಠಾರಾ ಕಛೇರಿ",
				era: "Built 1956 CE",
				category: "palace",
				tagline: "Neo-Dravidian Architectural Marvel of Public Governance",
				civicLegacy: "Conceived by Chief Minister Kengal Hanumanthaiah as a monument to democratic sovereignty, carved entirely from Bangalore granite and inscribed with 'Government's Work is God's Work'.",
				quote: "“Government’s Work is God’s Work” — Inscribed over the grand entrance portico.",
				icon: Landmark,
				color: "#0A369D",
				gradient: "from-blue-500/20 via-indigo-500/10 to-transparent"
			},
			{
				id: "cascade-lakes",
				title: "The 1537 Cascade Lakes & Visvesvaraya Works",
				vernacular: "ಜಲ ಸಂರಕ್ಷಣೆ ಮತ್ತು ಸರ್ ಎಂ.ವಿ. ತಂತ್ರಜ್ಞಾನ",
				era: "16th – 20th Century",
				category: "water",
				tagline: "Gravity-Fed Interconnected Lake Reservoirs",
				civicLegacy: "Sir M. Visvesvaraya engineered gravity reservoirs and hydro-power schemes, connecting Sankey, Ulsoor, Bellandur, and Hebbal into an intelligent storm-water cascade.",
				quote: "India's greatest engineering marvel of rainwater harvesting on a high granite plateau.",
				icon: Droplets,
				color: "#0F766E",
				gradient: "from-teal-500/20 via-cyan-500/10 to-transparent"
			}
		]
	}
};
function CityHeritagePanel({ cityId, onSelectCity }) {
	const [activeStoryId, setActiveStoryId] = (0, import_react.useState)(null);
	const cityData = HERITAGE_DATA[cityId] || HERITAGE_DATA.vadodara;
	const currentStory = cityData.stories.find((s) => s.id === activeStoryId) || cityData.stories[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "space-y-6 pt-16 sm:pt-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 backdrop-blur-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-amber-600 dark:text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[0.68rem] tracking-[0.14em] font-semibold text-amber-800 dark:text-amber-300 uppercase",
								children: "Civic Heritage & Historical Foundations"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-[var(--foreground)]",
							children: [
								cityData.cityName,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "jm-indian-gradient-text",
									children: ["· ", cityData.cityTitle]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-amber-700 dark:text-amber-400",
							children: cityData.vernacularName
						})
					]
				}), onSelectCity && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							onSelectCity("vadodara");
							setActiveStoryId("sayajirao-vision");
						},
						className: cn("px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200", cityId === "vadodara" ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-orange-800 dark:text-orange-300 border border-orange-500/40 shadow-sm" : "text-muted-foreground hover:text-foreground"),
						children: "🏛️ Vadodara (VMC)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							onSelectCity("bengaluru");
							setActiveStoryId("kempegowda-fort");
						},
						className: cn("px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200", cityId === "bengaluru" ? "bg-gradient-to-r from-blue-500/20 to-emerald-500/20 text-blue-800 dark:text-blue-300 border border-blue-500/40 shadow-sm" : "text-muted-foreground hover:text-foreground"),
						children: "🌸 Bengaluru (BBMP)"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-3xl text-sm leading-relaxed text-muted-foreground",
				children: cityData.intro
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 lg:grid-cols-[1.1fr_1.3fr] items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-1",
					children: cityData.stories.map((story) => {
						const Icon = story.icon;
						const isSelected = currentStory.id === story.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActiveStoryId(story.id),
							className: cn("press relative flex flex-col items-start p-4 rounded-2xl border text-left transition-all duration-300 backdrop-blur-2xl group", isSelected ? "bg-gradient-to-br from-white/95 to-amber-50/80 dark:from-slate-900/90 dark:to-slate-800/90 border-orange-500/50 shadow-[0_12px_32px_rgba(255,111,0,0.12)] -translate-y-0.5" : "bg-white/60 dark:bg-white/5 border-[var(--glass-border)] hover:bg-white/80 dark:hover:bg-white/10 hover:border-orange-500/30"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex w-full items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "flex h-9 w-9 items-center justify-center rounded-xl transition-transform group-hover:scale-110 shadow-sm",
											style: {
												backgroundColor: `${story.color}18`,
												border: `1px solid ${story.color}40`,
												color: story.color
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-sm font-bold text-[var(--foreground)] group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors",
											children: story.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground font-medium",
											children: story.era
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: cn("h-4 w-4 text-muted-foreground transition-transform duration-200", isSelected && "text-orange-500 translate-x-1") })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2.5 text-xs text-subtle line-clamp-2 leading-relaxed",
									children: story.tagline
								}),
								isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-0 inset-x-6 h-0.5 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 rounded-full" })
							]
						}, story.id);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					elevation: "raised",
					className: "jm-heritage-card p-6 sm:p-7 space-y-5 border-orange-500/30 bg-gradient-to-br from-white/95 via-amber-50/40 to-emerald-50/30 dark:from-slate-900/95 dark:via-slate-900/80 dark:to-slate-800/80",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3 border-b border-orange-500/15 pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm",
									style: {
										backgroundColor: `${currentStory.color}20`,
										border: `1px solid ${currentStory.color}50`,
										color: currentStory.color
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(currentStory.icon, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-bold tracking-[0.14em] uppercase text-orange-700 dark:text-orange-400",
									children: [
										currentStory.era,
										" · ",
										cityData.cityName,
										" Heritage"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-lg sm:text-xl font-bold text-[var(--foreground)]",
									children: currentStory.title
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scroll, { className: "h-3 w-3" }), " Historic Record"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-amber-800 dark:text-amber-300",
								children: currentStory.vernacular
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-foreground/90",
								children: currentStory.tagline
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-2xl bg-white/70 dark:bg-black/20 border border-amber-500/20 space-y-1.5 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-bold tracking-wider text-amber-800 dark:text-amber-400 uppercase",
								children: "🏛️ Modern Civic Infrastructure Relevance"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs leading-relaxed text-foreground/80",
								children: currentStory.civicLegacy
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-3.5 rounded-xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-emerald-500/10 border border-orange-500/20 italic text-xs text-muted-foreground leading-relaxed",
							children: currentStory.quote
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "jm-tricolor-bar" })
						})
					]
				})]
			})
		]
	});
}
var steps = [
	{
		n: "01",
		title: "Report Issue",
		body: "Tell JANMIND what happened in your locality.",
		icon: MessageSquareText,
		accent: "#FF6F00"
	},
	{
		n: "02",
		title: "Pinpoint Location",
		body: "Exact ward and GPS coordinates detected automatically.",
		icon: MapPin,
		accent: "#0A369D"
	},
	{
		n: "03",
		title: "Visual Evidence",
		body: "Upload geotagged photos or voice notes securely.",
		icon: Camera,
		accent: "#D97706"
	},
	{
		n: "04",
		title: "Track Resolution",
		body: "Live pipeline from municipality to verified contractors.",
		icon: Activity,
		accent: "#0E8A4B"
	}
];
function Landing() {
	const { t } = useI18n();
	const [cityId, setCityId] = (0, import_react.useState)(() => getDefaultCity());
	const handleCitySelect = (c) => {
		setCityId(c);
		setPreferredCity(c);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, {
		className: "pt-24 sm:pt-32",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "animate-rise space-y-7",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-emerald-500/10 px-3.5 py-1.5 backdrop-blur-xl shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[0.68rem] tracking-[0.14em] font-bold text-orange-950 dark:text-orange-200 uppercase",
								children: [
									"🇮🇳 ",
									t("home.hero.badge", "National Civic Intelligence"),
									" · સત્યમેવ જયતે"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "text-3xl leading-[1.08] font-extrabold sm:text-5xl lg:text-[3.35rem] text-[var(--foreground)]",
								children: [
									"Transforming your city's civic health with",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "jm-indian-gradient-text",
										children: "intelligent action."
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "max-w-xl text-[0.98rem] leading-relaxed text-muted-foreground",
								children: t("home.hero.desc", "Report water contamination, broken roads, sanitation, and streetlights with instant location evidence. JANMIND groups local complaints into transparent municipal patterns.")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 sm:flex-row sm:items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								asChild: true,
								size: "lg",
								className: "w-full sm:w-auto bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-lg shadow-orange-600/20 border border-orange-400/40",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/report",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 mr-1 text-amber-200" }),
										t("nav.report", "Report a problem"),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
											className: "h-4 w-4 ml-1",
											"aria-hidden": true
										})
									]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								asChild: true,
								size: "lg",
								variant: "glass",
								className: "w-full sm:w-auto border-orange-500/25 hover:border-orange-500/50",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#how-it-works",
									children: t("home.hero.howitworks", "How it works")
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4 text-xs text-subtle",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500" }), "100% Privacy Protected"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-amber-500" }), "Municipality & Contractor Linked"]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "animate-rise [animation-delay:120ms]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						elevation: "raised",
						className: "overflow-hidden p-4 space-y-3 border-orange-500/30 bg-gradient-to-br from-white/90 via-amber-50/50 to-emerald-50/40 dark:from-slate-900/90 dark:via-slate-900/70 dark:to-slate-800/70 shadow-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2 px-1 pb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 p-1 rounded-2xl bg-white/70 dark:bg-black/30 border border-orange-500/25 shadow-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => handleCitySelect("vadodara"),
										className: `px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${cityId === "vadodara" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md border border-emerald-400/40" : "text-muted-foreground hover:text-foreground"}`,
										children: "🏛️ Vadodara (VMC)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => handleCitySelect("bengaluru"),
										className: `px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${cityId === "bengaluru" ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md border border-blue-400/40" : "text-muted-foreground hover:text-foreground"}`,
										children: "🌸 Bengaluru (BBMP)"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold text-amber-900 dark:text-amber-300",
									children: cityId === "vadodara" ? "24 Areas · ~2.2M Pop" : "35 Areas · ~13.6M Pop"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientCivicMap, {
								cityId,
								mode: "health",
								activities: areaActivity(cityId, DEFAULT_FILTERS),
								points: [],
								selectedAreaId: null,
								onSelectArea: () => {},
								compact: true,
								className: "h-[320px] sm:h-[420px] rounded-2xl overflow-hidden shadow-inner"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3 px-1.5 pt-1.5 pb-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[0.7rem] tracking-[0.08em] font-semibold text-amber-900 dark:text-amber-200 uppercase",
									children: cityId === "vadodara" ? "વડોદરા લાઈવ વોર્ડ કવરેજ" : "ಬೆಂಗಳೂರು ಲೈವ್ ವಾರ್ಡ್ ಮಾಹಿತಿ"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/map",
									className: "text-xs font-bold text-orange-700 dark:text-orange-400 underline-offset-4 hover:underline",
									children: t("map.card.open", "Explore Full Civic Map →")
								})]
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CityHeritagePanel, {
				cityId,
				onSelectCity: handleCitySelect
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				id: "how-it-works",
				className: "scroll-mt-28 pt-20 sm:pt-28",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("hiw.label", "The Civic Journey") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 max-w-xl text-2xl font-bold sm:text-3xl lg:text-4xl text-[var(--foreground)]",
						children: t("hiw.heading", "Four steps from a problem on your street to a tracked civic record.")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
						children: steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							interactive: true,
							className: "animate-rise p-5 border-orange-500/20 bg-white/75 dark:bg-slate-900/60",
							style: { animationDelay: `${i * 90}ms` },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-800 dark:text-amber-300",
										children: s.n
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex h-8 w-8 items-center justify-center rounded-xl shadow-sm",
										style: {
											backgroundColor: `${s.accent}15`,
											color: s.accent
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, {
											className: "h-4 w-4",
											"aria-hidden": true
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-5 text-base font-bold text-[var(--foreground)]",
									children: s.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1.5 text-xs text-muted-foreground leading-relaxed",
									children: s.body
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
					className: "grid gap-8 p-6 sm:p-9 lg:grid-cols-2 border-orange-500/30 bg-gradient-to-br from-white/90 via-amber-50/40 to-emerald-50/30 dark:from-slate-900/90 dark:via-slate-900/70 dark:to-slate-800/70",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("pattern.label", "AI Pattern Detection") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-bold sm:text-3xl text-[var(--foreground)]",
								children: t("pattern.heading", "One report is a complaint. Many reports are a civic pattern.")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-relaxed text-muted-foreground",
								children: t("pattern.desc", "When several citizens describe a similar issue nearby, JANMIND groups them into an aggregated hotspot — without exposing anyone's identity or exact private address.")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-2.5 pt-1",
								children: [
									"23 similar reports detected within approximately 500m",
									"Automated routing to verified municipal contractors",
									"Public aggregate view only — zero citizen surveillance"
								].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2.5 text-sm text-muted-foreground font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" }), item]
								}, item))
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("pattern.issues.label", "Categories Covered") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2 pt-1",
								children: [
									{
										name: "Water Supply & Purity",
										color: "bg-blue-500/15 text-blue-800 dark:text-blue-300 border-blue-500/30"
									},
									{
										name: "Potholes & Road Damage",
										color: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30"
									},
									{
										name: "Drainage & Sewage Overflow",
										color: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30"
									},
									{
										name: "Sanitation & Garbage Disposal",
										color: "bg-teal-500/15 text-teal-800 dark:text-teal-300 border-teal-500/30"
									},
									{
										name: "Streetlights & Power Outages",
										color: "bg-orange-500/15 text-orange-800 dark:text-orange-300 border-orange-500/30"
									},
									{
										name: "Parks & Urban Encroachment",
										color: "bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30"
									}
								].map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full border px-3 py-1.5 text-xs font-semibold shadow-xs ${cat.color}`,
									children: cat.name
								}, cat.name))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
								asChild: true,
								className: "mt-4 bg-orange-600 text-white hover:bg-orange-500 border border-orange-400",
								variant: "glass",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/report",
									children: t("pattern.startreport", "File a Grievance Now")
								})
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "pt-14 sm:pt-20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("stats.label", "Civic Live Intelligence") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4",
					children: [
						[
							"112,141+",
							"Complaints Monitored",
							"📋"
						],
						[
							"15.8M+",
							"Citizens Protected",
							"👥"
						],
						[
							"< 24h",
							"First Municipal Dispatch",
							"⚡"
						],
						[
							"2 Mega Cities",
							"VMC & BBMP Integrated",
							"🏛️"
						]
					].map(([v, k, icon]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-4 border-orange-500/20 bg-white/70 dark:bg-slate-900/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
							className: "text-xl font-bold text-[var(--foreground)] flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: icon }),
								" ",
								v
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-[0.66rem] tracking-[0.08em] font-semibold text-muted-foreground uppercase mt-1.5",
							children: k
						})]
					}, k))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mt-20 border-t border-orange-500/20 pt-8 pb-6 text-xs text-subtle",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold tracking-[0.14em] uppercase text-amber-900 dark:text-amber-200",
							children: "JANMIND · જન મન"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground",
							children: "· Built for Indian Cities"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground font-medium",
						children: "સત્યમેવ જયતે · सत्यमेव जयते · Satyameva Jayate"
					})]
				})
			})
		]
	});
}
//#endregion
export { Landing as component };
