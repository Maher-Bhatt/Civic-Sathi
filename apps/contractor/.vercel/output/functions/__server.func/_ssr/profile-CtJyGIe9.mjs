import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as getContractor, i as useContractorAuth, p as useI18n } from "./router-CLnZYXuw.mjs";
import { n as SectionLabel, t as GlassCard } from "./glass-card-CoNgXAty.mjs";
import { _ as CircleCheck, a as Phone, b as Building, o as MapPin, p as FileText, s as Mail } from "../_libs/lucide-react.mjs";
import { n as LoadingState, t as ErrorState } from "./states-BSypa5q_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-CtJyGIe9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ContractorProfile() {
	const { t } = useI18n();
	const { contractor: contractorAuth, signOut } = useContractorAuth();
	const [contractor, setContractor] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		async function loadData() {
			if (!contractorAuth?.id) {
				setLoading(false);
				return;
			}
			try {
				const data = await getContractor(contractorAuth.id);
				setContractor(data);
			} catch (err) {} finally {
				setLoading(false);
			}
		}
		loadData();
	}, [contractorAuth]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { message: "Loading profile..." });
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { description: error?.message ?? "Error loading profile." });
	const displayName = contractor?.companyName ?? contractorAuth?.name ?? "Unknown";
	const displayEmail = contractor?.email ?? contractorAuth?.email ?? "";
	const displayId = contractor?.id ?? contractorAuth?.id ?? "";
	const displayPhone = contractor?.phone ?? "";
	const displayAddress = contractor?.address ?? "";
	const displayRegNum = contractor?.registrationNumber ?? "—";
	const displayGSTIN = contractor?.gstin ?? "—";
	const displayContactPerson = contractor?.contactPerson ?? contractorAuth?.name ?? "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-4xl mx-auto space-y-6 animate-fade",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-semibold text-[var(--foreground)] tracking-tight",
			children: t("ui.company_profile")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[var(--muted-foreground)] text-sm",
			children: t("ui.manage_your_business_informati")
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 md:grid-cols-3 gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:col-span-1 space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "p-6 glass-strong flex flex-col items-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-24 h-24 bg-[var(--surface-elevated)] border-2 border-[var(--primary)]/30 rounded-2xl flex items-center justify-center text-3xl font-bold text-[var(--primary)] shadow-sm mb-4",
							children: displayName.substring(0, 1)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold text-[var(--foreground)] leading-tight mb-1",
							children: displayName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-1.5 px-2 py-1 bg-[var(--success)]/10 text-[var(--success)] border border-[var(--success)]/20 rounded-md text-xs font-medium mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { size: 14 }), t("ui.verified_contractor")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => void signOut(),
							className: "w-full py-2 bg-[var(--surface)] border border-[var(--glass-border)] text-[var(--foreground)] hover:bg-[var(--critical)]/10 hover:text-[var(--critical)] hover:border-[var(--critical)]/30 transition-colors rounded-md text-sm font-medium",
							children: t("ui.sign_out")
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "p-5 glass-strong space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionLabel, { children: t("ui.contact_details") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
								className: "text-[var(--muted-foreground)] shrink-0 mt-0.5",
								size: 16
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[var(--muted-foreground)] text-xs",
								children: t("ui.phone")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[var(--foreground)] text-sm",
								children: displayPhone || "—"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
								className: "text-[var(--muted-foreground)] shrink-0 mt-0.5",
								size: 16
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[var(--muted-foreground)] text-xs",
								children: t("ui.email")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 font-medium break-all",
								children: displayEmail
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
								className: "text-[var(--muted-foreground)] shrink-0 mt-0.5",
								size: 16
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[var(--muted-foreground)] text-xs",
								children: t("ui.address")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[var(--foreground)] text-sm leading-relaxed",
								children: displayAddress || "—"
							})] })]
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:col-span-2 space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "p-6 glass-strong",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionLabel, {
						className: "mb-4 flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { size: 18 }),
							" ",
							t("ui.company_information")
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 bg-[var(--surface)] border border-[var(--glass-border)] rounded-lg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[var(--muted-foreground)] text-xs mb-1",
								children: t("ui.company_name")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[var(--foreground)] font-medium",
								children: displayName
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 bg-[var(--surface)] border border-[var(--glass-border)] rounded-lg",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-2xl font-semibold mt-3 mb-1",
									children: displayName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[var(--muted-foreground)]",
									children: [t("ui.id"), displayId]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[var(--muted-foreground)] text-sm",
									children: displayContactPerson
								})
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "p-6 glass-strong",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionLabel, {
						className: "mb-4 flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 18 }),
							" ",
							t("ui.legal_registration")
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[var(--surface)] border border-[var(--glass-border)] rounded-lg gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[var(--muted-foreground)] text-xs mb-1",
									children: t("ui.registration_number")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[var(--foreground)] font-mono",
									children: displayRegNum
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-widest text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded",
									children: t("ui.active")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[var(--surface)] border border-[var(--glass-border)] rounded-lg gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[var(--muted-foreground)] text-xs mb-1",
									children: t("ui.gstin")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[var(--foreground)] font-mono",
									children: displayGSTIN
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-widest text-[var(--success)] bg-[var(--success)]/10 px-2 py-1 rounded",
									children: t("ui.verified")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[var(--surface)] border border-[var(--glass-border)] rounded-lg gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[var(--muted-foreground)] text-xs mb-1",
									children: t("ui.pan")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-medium text-[var(--foreground)]",
									children: [
										displayName,
										" ",
										t("ui.user")
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-widest text-[var(--success)] bg-[var(--success)]/10 px-2 py-1 rounded",
									children: t("ui.verified")
								})]
							})
						]
					})]
				})]
			})]
		})]
	});
}
//#endregion
export { ContractorProfile as component };
