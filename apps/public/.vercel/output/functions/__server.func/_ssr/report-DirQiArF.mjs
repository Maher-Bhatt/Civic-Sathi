import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { B as Camera, C as MapPin, G as ArrowRight, K as ArrowLeft, L as CircleAlert, N as Crosshair, O as Image, c as Trash2, d as ShieldCheck, i as Upload, l as Sparkles, m as RefreshCw, v as Mic, w as LoaderCircle, y as MicOff, z as Check } from "../_libs/lucide-react.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as saveDraft, n as emptyDraft, r as loadDraft } from "./report-draft-BNrUyQJo.mjs";
import { a as clustersForCity, c as nearestWardOrArea, o as getCity, s as nearestCity } from "./cities-CP3Vvkkz.mjs";
import { C as uploadComplaintPhoto, D as useI18n, E as cn, c as GlassButton, d as SectionLabel, l as GlassCard, n as AuthGate, p as analyzeComplaintPhoto, u as PageShell } from "./router-DYLopdf1.mjs";
import { n as ClientCityMap, t as CitySelector } from "./city-map-panel-D5QmpsxM.mjs";
import { n as GlassTextarea } from "./glass-input-C05CvLHo.mjs";
import { t as ISSUE_TYPES } from "./types-DzMfRmJh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/report-DirQiArF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LocationPicker({ location, marker, city, onChange }) {
	const { t } = useI18n();
	const [phase, setPhase] = (0, import_react.useState)(marker ? "ready" : "idle");
	const [mapMode, setMapMode] = (0, import_react.useState)(!!marker);
	const commit = (pos, cityId) => {
		const { ward, area } = nearestWardOrArea(cityId, pos.lat, pos.lng);
		onChange({
			location: {
				lat: pos.lat,
				lng: pos.lng,
				ward,
				area
			},
			marker: pos,
			city: cityId
		});
	};
	function detect() {
		setPhase("detecting");
		const fallback = () => {
			const c = getCity(city);
			commit({
				lat: c.center[0],
				lng: c.center[1]
			}, city);
			setPhase("error");
			setMapMode(true);
		};
		if (typeof navigator === "undefined" || !navigator.geolocation) {
			fallback();
			return;
		}
		navigator.geolocation.getCurrentPosition((pos) => {
			const found = nearestCity(pos.coords.latitude, pos.coords.longitude);
			commit({
				lat: pos.coords.latitude,
				lng: pos.coords.longitude
			}, found.id);
			setPhase("ready");
			setMapMode(true);
		}, fallback, {
			enableHighAccuracy: true,
			timeout: 8e3
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			phase === "idle" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "space-y-3 p-4 sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
						className: "h-4 w-4 text-primary",
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.why_we_ask_for_location") })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted-foreground",
					children: t("ui.your_location_helps_us_underst")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 sm:flex-row sm:flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
					type: "button",
					onClick: detect,
					disabled: phase === "detecting",
					className: "w-full sm:w-auto",
					children: [phase === "detecting" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
						className: "h-4 w-4 animate-spin",
						"aria-hidden": true
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crosshair, {
						className: "h-4 w-4",
						"aria-hidden": true
					}), t("ui.use_my_current_location")]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
					type: "button",
					variant: "glass",
					className: "w-full sm:w-auto",
					onClick: () => {
						setMapMode(true);
						if (!marker) {
							const c = getCity(city);
							commit({
								lat: c.center[0],
								lng: c.center[1]
							}, city);
							setPhase("ready");
						}
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
						className: "h-4 w-4",
						"aria-hidden": true
					}), t("ui.choose_on_map")]
				})]
			}),
			phase === "detecting" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				role: "status",
				children: t("ui.waiting_for_your_device_locati")
			}),
			phase === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				role: "status",
				children: t("ui.we_couldn_t_read_your_device_l")
			}),
			phase === "ready" && location && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				elevation: "raised",
				className: "animate-rise flex items-center gap-3 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklab,var(--primary)_16%,transparent)] text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
						className: "h-4 w-4",
						"aria-hidden": true
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.location_detected") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 truncate text-sm font-medium",
							children: location.area
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-subtle tabular-nums",
							children: [
								location.lat.toFixed(5),
								", ",
								location.lng.toFixed(5)
							]
						})
					]
				})]
			}),
			mapMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CitySelector, {
						cityId: city,
						onChange: (id) => {
							const c = getCity(id);
							commit({
								lat: c.center[0],
								lng: c.center[1]
							}, id);
							setPhase("ready");
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientCityMap, {
						cityId: city,
						clusters: clustersForCity(city),
						className: "h-[300px] sm:h-[380px]",
						marker,
						onMarkerChange: (pos) => commit(pos, city),
						focus: marker,
						showLegend: false,
						ariaLabel: "Map for choosing the location of your report"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs leading-relaxed text-subtle",
						children: t("ui.tap_the_map_or_drag_the_marker")
					})
				]
			})
		]
	});
}
function PhotoUploader({ photo, onPhoto, onCategorySuggestion }) {
	const { t } = useI18n();
	const inputRef = (0, import_react.useRef)(null);
	const cameraRef = (0, import_react.useRef)(null);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [analyzing, setAnalyzing] = (0, import_react.useState)(false);
	const [analysis, setAnalysis] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [changing, setChanging] = (0, import_react.useState)(false);
	async function handleFile(file) {
		if (!file) return;
		setError(null);
		setAnalysis(null);
		setUploading(true);
		setProgress(8);
		const tick = setInterval(() => setProgress((p) => Math.min(92, p + 11)), 90);
		try {
			onPhoto(await uploadComplaintPhoto(file));
			setProgress(100);
			setAnalyzing(true);
			const result = await analyzeComplaintPhoto(file.name);
			setAnalysis(result);
		} catch {
			setError("We couldn't process that image. Try another photo.");
		} finally {
			clearInterval(tick);
			setUploading(false);
			setAnalyzing(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				type: "file",
				accept: "image/*",
				className: "sr-only",
				onChange: (e) => handleFile(e.target.files?.[0])
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: cameraRef,
				type: "file",
				accept: "image/*",
				capture: "environment",
				className: "sr-only",
				onChange: (e) => handleFile(e.target.files?.[0])
			}),
			!photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				interactive: true,
				className: "flex flex-col items-center gap-4 px-6 py-12 text-center",
				onClick: () => inputRef.current?.click(),
				role: "button",
				tabIndex: 0,
				onKeyDown: (e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						inputRef.current?.click();
					}
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-12 w-12 items-center justify-center rounded-full border border-border bg-[var(--glass-strong)] text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
							className: "h-5 w-5",
							"aria-hidden": true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: t("ui.add_a_photo_of_the_problem")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: t("ui.optional_a_photo_helps_the_dep")
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
							size: "sm",
							variant: "glass",
							type: "button",
							onClick: (e) => {
								e.stopPropagation();
								cameraRef.current?.click();
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, {
								className: "h-3.5 w-3.5",
								"aria-hidden": true
							}), t("ui.camera")]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
							size: "sm",
							variant: "glass",
							type: "button",
							onClick: (e) => {
								e.stopPropagation();
								inputRef.current?.click();
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
								className: "h-3.5 w-3.5",
								"aria-hidden": true
							}), t("ui.gallery")]
						})]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "overflow-hidden p-2.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative overflow-hidden rounded-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: photo,
							alt: "Photo attached to your civic report",
							loading: "lazy",
							className: "h-56 w-full object-cover sm:h-72"
						}), (uploading || analyzing) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[color-mix(in_oklab,var(--background)_72%,transparent)] backdrop-blur-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
								className: "h-5 w-5 animate-pulse text-primary",
								"aria-hidden": true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs tracking-[0.14em] text-muted-foreground uppercase",
								children: uploading ? "Uploading image" : "Analyzing image"
							})]
						})]
					}),
					uploading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2.5 h-1 overflow-hidden rounded-full bg-[var(--glass-strong)]",
						role: "progressbar",
						"aria-valuenow": progress,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-primary transition-[width] duration-200 ease-out",
							style: { width: `${progress}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2 px-1 pt-3 pb-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
							size: "sm",
							variant: "glass",
							type: "button",
							onClick: () => inputRef.current?.click(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
								className: "h-3.5 w-3.5",
								"aria-hidden": true
							}), t("ui.replace")]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
							size: "sm",
							variant: "ghost",
							type: "button",
							onClick: () => {
								onPhoto(null);
								setAnalysis(null);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
								className: "h-3.5 w-3.5",
								"aria-hidden": true
							}), t("ui.remove")]
						})]
					})
				]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-critical",
				role: "alert",
				children: error
			}),
			analysis && !analyzing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				elevation: "raised",
				className: "animate-rise space-y-4 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
							className: "h-4 w-4 text-primary",
							"aria-hidden": true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.ai_assisted_image_reading") })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "grid gap-3 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "label-xs",
								children: t("ui.detected")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 text-sm font-medium",
								children: analysis.detected
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "label-xs",
								children: t("ui.suggested_category")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 text-sm font-medium",
								children: analysis.category
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "label-xs",
								children: t("ui.confidence")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 text-sm font-medium",
								children: analysis.confidence
							})] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-subtle",
						children: t("ui.this_is_an_ai_assisted_suggest")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
							size: "sm",
							type: "button",
							onClick: () => {
								onCategorySuggestion(analysis.category);
								setChanging(false);
							},
							children: t("ui.confirm")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
							size: "sm",
							variant: "glass",
							type: "button",
							onClick: () => setChanging((v) => !v),
							children: t("ui.change_category")
						})]
					}),
					changing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2 pt-1",
						children: ISSUE_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								onCategorySuggestion(t);
								setChanging(false);
							},
							className: cn("press rounded-full border border-border bg-[var(--glass)] px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"),
							children: t
						}, t))
					})
				]
			})
		]
	});
}
function VoiceInput({ onResult, className, lang }) {
	const { t } = useI18n();
	const [state, setState] = (0, import_react.useState)("idle");
	const recognitionRef = (0, import_react.useRef)(null);
	const onResultRef = (0, import_react.useRef)(onResult);
	onResultRef.current = onResult;
	const stateRef = (0, import_react.useRef)(state);
	stateRef.current = state;
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") {
			const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
			if (SpeechRecognition) {
				const recognition = new SpeechRecognition();
				recognition.continuous = false;
				recognition.interimResults = false;
				recognition.onstart = () => {
					setState("listening");
				};
				recognition.onresult = (event) => {
					setState("processing");
					const transcript = event.results[0][0].transcript;
					onResultRef.current(transcript);
					setState("idle");
				};
				recognition.onerror = (event) => {
					console.error("Speech recognition error", event.error);
					setState("idle");
				};
				recognition.onend = () => {
					if (stateRef.current === "listening") setState("idle");
				};
				recognitionRef.current = recognition;
			} else setState("unsupported");
		}
	}, []);
	const toggleListen = () => {
		if (state === "unsupported") return;
		if (state === "listening") {
			recognitionRef.current?.stop();
			setState("idle");
		} else {
			if (lang && recognitionRef.current) recognitionRef.current.lang = lang;
			recognitionRef.current?.start();
		}
	};
	if (state === "unsupported") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center gap-2 text-xs text-muted-foreground", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5 text-warning" }), t("ui.voice_input_not_supported_in_t")]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
		type: "button",
		size: "sm",
		variant: state === "listening" ? "danger" : "glass",
		onClick: toggleListen,
		className: cn("transition-all duration-300", className),
		children: state === "listening" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "h-3.5 w-3.5 animate-pulse" }), t("ui.listening")] }) : state === "processing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-3.5 w-3.5 opacity-50" }), t("ui.processing")] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-3.5 w-3.5" }), t("ui.describe_by_voice")] })
	});
}
var steps = [
	{
		n: "01",
		tKey: "report.step.problem",
		label: "Problem"
	},
	{
		n: "02",
		tKey: "report.step.location",
		label: "Location"
	},
	{
		n: "03",
		tKey: "report.step.evidence",
		label: "Evidence"
	},
	{
		n: "04",
		tKey: "report.step.review",
		label: "Review"
	}
];
function ReportPage() {
	const navigate = useNavigate();
	const { t } = useI18n();
	const [step, setStep] = (0, import_react.useState)(0);
	const [draft, setDraft] = (0, import_react.useState)(emptyDraft);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setDraft(loadDraft());
		setHydrated(true);
	}, []);
	const update = (patch) => setDraft((d) => {
		const next = {
			...d,
			...patch
		};
		saveDraft(next);
		return next;
	});
	const canContinue = step === 0 ? draft.description.trim().length > 12 : step === 1 ? !!draft.marker : true;
	function submit() {
		saveDraft(draft);
		navigate({ to: "/analyzing" });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "animate-rise space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.new_report") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-semibold sm:text-3xl",
						children: t("ui.tell_janmind_what_happened")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: t("ui.you_don_t_need_to_pick_a_categ")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-7 flex items-center gap-2",
				"aria-label": t("ui.report_progress"),
				children: steps.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-1 items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[0.7rem] font-medium tabular-nums transition-colors duration-300", i < step ? "border-[color-mix(in_oklab,var(--primary)_55%,transparent)] bg-[color-mix(in_oklab,var(--primary)_18%,transparent)] text-primary" : i === step ? "border-primary bg-[var(--glass-strong)] text-foreground" : "border-border text-subtle"),
							"aria-current": i === step ? "step" : void 0,
							children: i < step ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : s.n
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("hidden text-xs tracking-[0.1em] uppercase sm:inline", i === step ? "text-foreground" : "text-muted-foreground"),
							children: t(s.tKey, s.label)
						}),
						i < steps.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-px flex-1 bg-border",
							"aria-hidden": true
						})
					]
				}, s.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				elevation: "raised",
				className: "animate-rise mt-6 p-5 sm:p-7",
				children: [
					step === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-semibold",
								children: t("ui.describe_the_problem")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassTextarea, {
								rows: 7,
								value: draft.description,
								onChange: (e) => update({ description: e.target.value }),
								placeholder: t("ui.describe_the_problem_in_your_o"),
								hint: "Example: There has been no water supply in our area for three days.",
								"aria-label": t("ui.describe_the_problem")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceInput, { onResult: (text) => {
									const newDesc = draft.description ? `${draft.description} ${text}` : text;
									update({ description: newDesc });
								} }), hydrated && !draft.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
									type: "button",
									size: "sm",
									variant: "ghost",
									onClick: () => update({ description: "There has been no water supply in our area for three days." }),
									children: t("ui.use_the_example")
								})]
							})
						]
					}),
					step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold",
							children: t("ui.where_is_the_problem")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocationPicker, {
							location: draft.location,
							marker: draft.marker,
							city: draft.city,
							onChange: ({ location, marker, city }) => update({
								location,
								marker,
								city
							})
						})]
					}),
					step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold",
							children: t("ui.add_photo_or_evidence")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoUploader, {
							photo: draft.photo,
							onPhoto: (photo) => update({ photo }),
							onCategorySuggestion: (category) => update({ category })
						})]
					}),
					step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-semibold",
								children: t("ui.your_report")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "divide-y divide-border overflow-hidden rounded-2xl border border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewRow, {
										label: t("ui.description"),
										onEdit: () => setStep(0),
										children: draft.description || "Not provided"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewRow, {
										label: t("ui.suggested_category"),
										onEdit: () => setStep(2),
										children: draft.category ?? "JANMIND will suggest one"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewRow, {
										label: t("ui.location"),
										onEdit: () => setStep(1),
										children: draft.location ? `${draft.location.area} (${draft.location.lat.toFixed(4)}, ${draft.location.lng.toFixed(4)})` : "Not selected"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewRow, {
										label: t("ui.photo"),
										onEdit: () => setStep(2),
										children: draft.photo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: draft.photo,
											alt: "Photo attached to your report",
											className: "h-20 w-28 rounded-lg border border-border object-cover"
										}) : "No photo attached"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs leading-relaxed text-subtle",
								children: t("ui.janmind_will_analyse_your_desc")
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-7 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
							type: "button",
							variant: "ghost",
							className: "w-full sm:w-auto",
							onClick: () => setStep((s) => Math.max(0, s - 1)),
							disabled: step === 0,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
								className: "h-4 w-4",
								"aria-hidden": true
							}), step === 3 ? t("report.btn.back", "Go back") : t("report.btn.back", "Back")]
						}), step < steps.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
							type: "button",
							className: "w-full sm:w-auto",
							onClick: () => setStep((s) => s + 1),
							disabled: !canContinue,
							children: [t("report.btn.continue", "Continue"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								className: "h-4 w-4",
								"aria-hidden": true
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassButton, {
							type: "button",
							className: "w-full sm:w-auto",
							onClick: submit,
							children: [t("report.btn.submit", "Submit report"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								className: "h-4 w-4",
								"aria-hidden": true
							})]
						})]
					})
				]
			})
		]
	});
}
function ReviewRow({ label, children, onEdit }) {
	const { t } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 bg-[var(--glass)] px-4 py-3.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
				className: "label-xs",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
				className: "mt-1 text-sm break-words text-foreground",
				children
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassButton, {
			type: "button",
			size: "sm",
			variant: "ghost",
			onClick: onEdit,
			children: t("ui.edit")
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthGate, {
	redirectTo: "/report",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportPage, {})
});
//#endregion
export { SplitComponent as component };
