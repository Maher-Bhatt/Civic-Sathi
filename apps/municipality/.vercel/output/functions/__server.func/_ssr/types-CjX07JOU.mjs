//#region node_modules/.nitro/vite/services/ssr/assets/types-CjX07JOU.js
/** Shared civic domain types — kept in sync with the citizen portal API contract. */
var ISSUE_TYPES = [
	"Water Supply",
	"Road Damage",
	"Garbage Collection",
	"Drainage",
	"Sewage",
	"Street Lighting",
	"Electricity",
	"Public Transport",
	"Sanitation"
];
var COMPLAINT_STATUSES = [
	"Received",
	"Under Review",
	"Assigned",
	"In Progress",
	"Resolved",
	"Closed"
];
var DEPARTMENTS = [
	"Municipal Water",
	"Public Works",
	"Sanitation",
	"Drainage",
	"Electrical",
	"Transport"
];
var DEFAULT_COMPLAINT_FILTERS = {
	search: "",
	city: "all",
	area: "",
	ward: "",
	category: "all",
	severity: "all",
	department: "all",
	status: "all",
	dateFrom: "",
	dateTo: "",
	riskMin: 0,
	riskMax: 100
};
function riskLevel(score) {
	if (score >= 85) return "Critical";
	if (score >= 70) return "High";
	if (score >= 40) return "Moderate";
	return "Low";
}
function alertPriority(score) {
	if (score >= 85) return "Critical";
	if (score >= 70) return "High";
	if (score >= 40) return "Moderate";
	return "Informational";
}
var VALID_TRANSITIONS = {
	DRAFT: {
		officer: ["PENDING_APPROVAL"],
		supervisor: ["PENDING_APPROVAL", "APPROVED"]
	},
	PENDING_APPROVAL: {
		supervisor: ["APPROVED", "DRAFT"],
		department_head: ["APPROVED", "DRAFT"],
		admin: ["APPROVED", "DRAFT"]
	},
	APPROVED: {
		officer: ["CONTRACTOR_ASSIGNED"],
		supervisor: ["CONTRACTOR_ASSIGNED"]
	},
	CONTRACTOR_ASSIGNED: {
		officer: ["PENDING_ACCEPTANCE"],
		supervisor: ["PENDING_ACCEPTANCE"]
	},
	PENDING_ACCEPTANCE: { contractor: ["ACCEPTED", "DRAFT"] },
	ACCEPTED: { contractor: ["MOBILIZATION"] },
	MOBILIZATION: { contractor: ["IN_PROGRESS"] },
	IN_PROGRESS: { contractor: ["SUBMITTED_FOR_INSPECTION"] },
	SUBMITTED_FOR_INSPECTION: {
		officer: ["INSPECTION_PASSED", "INSPECTION_FAILED"],
		supervisor: ["INSPECTION_PASSED", "INSPECTION_FAILED"]
	},
	INSPECTION_FAILED: { contractor: ["REWORK"] },
	REWORK: { contractor: ["RESUBMITTED"] },
	RESUBMITTED: {
		officer: ["INSPECTION_PASSED", "INSPECTION_FAILED"],
		supervisor: ["INSPECTION_PASSED", "INSPECTION_FAILED"]
	},
	INSPECTION_PASSED: {
		officer: ["COMPLETED"],
		supervisor: ["COMPLETED"]
	},
	COMPLETED: {
		officer: ["MEASUREMENT_PENDING"],
		supervisor: ["MEASUREMENT_PENDING"],
		contractor: ["MEASUREMENT_PENDING"]
	},
	MEASUREMENT_PENDING: { contractor: ["BILL_SUBMITTED"] },
	BILL_SUBMITTED: {
		officer: ["BILL_VERIFIED"],
		supervisor: ["BILL_VERIFIED"]
	},
	BILL_VERIFIED: {
		supervisor: ["PAYMENT_APPROVED"],
		department_head: ["PAYMENT_APPROVED"],
		admin: ["PAYMENT_APPROVED"]
	},
	PAYMENT_APPROVED: {
		officer: ["CLOSED"],
		supervisor: ["CLOSED"],
		admin: ["CLOSED"]
	},
	CLOSED: {}
};
function validateWorkOrderTransition(current, next, role) {
	if ((VALID_TRANSITIONS[current]?.[role] ?? []).includes(next)) return { valid: true };
	return {
		valid: false,
		reason: `Role '${role}' cannot transition work order from '${current}' to '${next}'.`
	};
}
function workOrderStatusLabel(status) {
	return {
		DRAFT: "Draft",
		PENDING_APPROVAL: "Pending Approval",
		APPROVED: "Approved",
		CONTRACTOR_ASSIGNED: "Contractor Assigned",
		PENDING_ACCEPTANCE: "Pending Acceptance",
		ACCEPTED: "Accepted",
		MOBILIZATION: "Mobilization",
		IN_PROGRESS: "In Progress",
		SUBMITTED_FOR_INSPECTION: "Submitted for Inspection",
		INSPECTION_FAILED: "Inspection Failed",
		REWORK: "Rework",
		RESUBMITTED: "Resubmitted",
		INSPECTION_PASSED: "Inspection Passed",
		COMPLETED: "Completed",
		MEASUREMENT_PENDING: "Measurement Pending",
		BILL_SUBMITTED: "Bill Submitted",
		BILL_VERIFIED: "Bill Verified",
		PAYMENT_APPROVED: "Payment Approved",
		CLOSED: "Closed"
	}[status] ?? status;
}
function workOrderStatusColor(status) {
	if (status === "CLOSED" || status === "PAYMENT_APPROVED") return "success";
	if (status === "INSPECTION_FAILED" || status === "REWORK" || status === "DRAFT" || status === "PENDING_APPROVAL") return "warning";
	if (status === "IN_PROGRESS" || status === "MOBILIZATION" || status === "ACCEPTED") return "primary";
	return "muted";
}
//#endregion
export { alertPriority as a, workOrderStatusColor as c, ISSUE_TYPES as i, workOrderStatusLabel as l, DEFAULT_COMPLAINT_FILTERS as n, riskLevel as o, DEPARTMENTS as r, validateWorkOrderTransition as s, COMPLAINT_STATUSES as t };
