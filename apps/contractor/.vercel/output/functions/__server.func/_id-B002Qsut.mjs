import { i as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/react+tanstack__react-query.mjs";
import { h as Link, v as useRouter } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { r as Route$2, s as getTenderDetails, u as submitBid } from "./_ssr/router-D4KhRL4Q.mjs";
import { S as ArrowLeft } from "./_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-B002Qsut.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TenderDetail() {
	const { id } = Route$2.useParams();
	const router = useRouter();
	const queryClient = useQueryClient();
	const [bidAmount, setBidAmount] = (0, import_react.useState)("");
	const [proposal, setProposal] = (0, import_react.useState)("");
	const { data: tender, isLoading: loading } = useQuery({
		queryKey: ["tender", id],
		queryFn: () => getTenderDetails(id)
	});
	const submitMutation = useMutation({
		mutationFn: () => submitBid(id, Number(bidAmount), proposal),
		onSuccess: () => {
			toast.success("Sealed bid submitted successfully!");
			queryClient.invalidateQueries({ queryKey: ["contractor-tenders"] });
			router.navigate({ to: "/contractor/tenders" });
		},
		onError: (err) => toast.error(err.message || "Failed to submit bid")
	});
	async function handleBid(e) {
		e.preventDefault();
		if (!bidAmount || !proposal) return toast.error("Please fill all fields.");
		submitMutation.mutate();
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center text-[var(--muted-foreground)]",
		children: "Loading tender..."
	});
	if (!tender) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-8 text-center text-[var(--critical)]",
		children: "Tender not found."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 max-w-4xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/contractor/tenders",
				className: "inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), "Back to Tenders"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "rounded-xl border border-[var(--glass-border)] bg-[var(--surface-elevated)] p-6 md:p-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col md:flex-row justify-between gap-4 items-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold",
						children: tender.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 text-sm text-[var(--muted-foreground)]",
						children: ["ID: ", tender.id]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold text-[var(--primary)]",
							children: "Est. Budget"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-2xl font-medium tabular-nums",
							children: ["₹", tender.estimated_budget?.toLocaleString()]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold mb-2",
						children: "Description"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[var(--muted-foreground)] text-sm leading-relaxed",
						children: tender.description
					})] }), tender.scope_of_work && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold mb-2",
						children: "Scope of Work"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[var(--muted-foreground)] text-sm leading-relaxed whitespace-pre-wrap",
						children: tender.scope_of_work
					})] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-[var(--glass-border)] bg-[var(--surface)] p-6 md:p-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-semibold mb-6",
					children: "Submit Sealed Bid"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleBid,
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-medium mb-2",
							children: "Quoted Amount (₹)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							required: true,
							min: "0",
							value: bidAmount,
							onChange: (e) => setBidAmount(e.target.value),
							className: "w-full bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]",
							placeholder: "e.g. 500000"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-medium mb-2",
							children: "Technical Proposal / Notes"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							required: true,
							rows: 5,
							value: proposal,
							onChange: (e) => setProposal(e.target.value),
							className: "w-full bg-[var(--surface-elevated)] border border-[var(--glass-border)] rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]",
							placeholder: "Detail your approach, timeline, and resources..."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: submitMutation.isPending,
							className: "w-full bg-[var(--primary)] text-white font-medium py-3 rounded-md hover:bg-[var(--primary)]/90 transition-colors disabled:opacity-50",
							children: submitMutation.isPending ? "Submitting securely..." : "Submit Sealed Bid"
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { TenderDetail as component };
