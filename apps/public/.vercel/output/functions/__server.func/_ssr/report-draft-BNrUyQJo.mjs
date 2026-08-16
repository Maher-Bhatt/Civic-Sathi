//#region node_modules/.nitro/vite/services/ssr/assets/report-draft-BNrUyQJo.js
var KEY = "janmind.draft";
var emptyDraft = {
	description: "",
	location: null,
	marker: null,
	city: "vadodara",
	photo: null,
	category: null,
	severity: null,
	analysis: null
};
function loadDraft() {
	if (typeof window === "undefined") return emptyDraft;
	try {
		const raw = window.sessionStorage.getItem(KEY);
		return raw ? {
			...emptyDraft,
			...JSON.parse(raw)
		} : emptyDraft;
	} catch {
		return emptyDraft;
	}
}
function saveDraft(draft) {
	if (typeof window === "undefined") return;
	try {
		window.sessionStorage.setItem(KEY, JSON.stringify(draft));
	} catch {}
}
function clearDraft() {
	if (typeof window !== "undefined") window.sessionStorage.removeItem(KEY);
}
//#endregion
export { saveDraft as i, emptyDraft as n, loadDraft as r, clearDraft as t };
