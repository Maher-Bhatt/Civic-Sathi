import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useContractorAuth } from "@/lib/contractor-auth";
import { 
  getWorkOrder, 
  submitFieldEvidence,
  getWorkOrderEvents, 
  updateWorkOrderStatus, 
  submitMeasurement,
  submitBill,
  getBill
} from "@/services/api";
import { 
  WorkOrder, 
  WorkOrderEvent, 
  workOrderStatusLabel, 
  workOrderStatusColor,
  validateWorkOrderTransition,
  Bill
} from "@/services/types";
import { GlassCard, SectionLabel } from "@/components/ui/glass-card";
import { LoadingState, ErrorState } from "@/components/ui/states";
import { toast } from "sonner";
import { Calendar, Clock, MapPin, User, FileText, IndianRupee, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/contractor/work-orders/$id")({
  head: ({ params }: any) => ({ meta: [{ title: `Work Order ${params.id} - JANMIND` }] }),
  component: ContractorWorkOrderDetail,
});

function ContractorWorkOrderDetail() {
  const { id } = Route.useParams();
  const router = useRouter();
  const { contractor } = useContractorAuth();
  
  const [wo, setWo] = useState<WorkOrder | null>(null);
  const [events, setEvents] = useState<WorkOrderEvent[]>([]);
  const [bill, setBill] = useState<Bill | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form states
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressDesc, setProgressDesc] = useState("");
  const [evidenceStage, setEvidenceStage] = useState("");
  const [fileData, setFileData] = useState("");
  const [measurementAmount, setMeasurementAmount] = useState<string>("");
  const [measurementRemarks, setMeasurementRemarks] = useState("");
  
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getWorkOrder(id);
      if (!data) throw new Error("Work order not found");
      
      // Security check
      if (data.contractorId !== contractor?.contractorId) {
        throw new Error("Unauthorized access to work order");
      }
      
      setWo(data);
      const evts = await getWorkOrderEvents(id);
      setEvents(evts);
      
      if (data.status === 'BILL_SUBMITTED' || data.status === 'COMPLETED' || data.status === 'CLOSED') {
        const b = await getBill(id);
        setBill(b);
      }
      
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contractor?.contractorId) {
      loadData();
    }
  }, [id, contractor]);

  if (loading) return <LoadingState message="Loading work order details..." />;
  if (error) return <ErrorState description={error?.message ?? "Error loading work order."} />;
  if (!wo) return null;

  const handleStatusChange = async (nextStatus: string, remarks?: string) => {
    if (!validateWorkOrderTransition(wo.status, nextStatus as any, "contractor")) {
      toast.error("Invalid status transition");
      return;
    }
    
    setActionLoading(true);
    try {
      await updateWorkOrderStatus(
        wo.id,
        nextStatus as any,
        contractor!.contractorId,
        contractor!.companyName,
        "contractor",
        remarks,
      );
      toast.success(`Work order marked as ${workOrderStatusLabel(nextStatus as any)}`);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEvidenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceStage || !fileData) {
      toast.error("Stage and file are required");
      return;
    }
    setActionLoading(true);
    try {
      // Use real API for field evidence upload
      await submitFieldEvidence(wo.id, fileData, evidenceStage);
      toast.success(`Evidence for stage ${evidenceStage} uploaded successfully.`);
      
      setEvidenceStage("");
      setFileData("");
      await loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to upload evidence");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMeasurementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const amount = parseFloat(measurementAmount);
      if (isNaN(amount) || amount <= 0) throw new Error("Invalid amount");
      
      await submitMeasurement(
        {
          workOrderId: wo.id,
          totalAmount: amount,
          items: [],
          measuredBy: contractor!.contractorId,
          measuredByName: contractor!.companyName,
          measurementDate: new Date().toISOString(),
          verificationStatus: "PENDING",
          contractorAcknowledged: true,
          contractorAcknowledgedAt: new Date().toISOString(),
        },
        contractor!.contractorId,
        contractor!.companyName,
      );
      toast.success("Measurement submitted");
      await handleStatusChange("BILL_SUBMITTED", "Submitted measurements for review");
      setMeasurementAmount("");
      setMeasurementRemarks("");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit measurement");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitBill = async () => {
    setActionLoading(true);
    try {
      await submitBill(
        {
          workOrderId: wo.id,
          contractorId: contractor!.contractorId,
          submittedAmount: wo.estimatedCost ?? (wo as any).budget ?? 0,
          status: "SUBMITTED",
          submittedBy: contractor!.companyName,
        },
        contractor!.contractorId,
        contractor!.companyName,
      );
      toast.success("Bill submitted successfully");
      await handleStatusChange("BILL_SUBMITTED", "Invoice submitted");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit bill");
    } finally {
      setActionLoading(false);
    }
  };

  // Helper for SLA days remaining
  const slaDeadline = new Date(wo.slaDeadline);
  const now = new Date();
  const diffTime = Math.max(0, slaDeadline.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isOverdue = now > slaDeadline && wo.status !== 'COMPLETED' && wo.status !== 'CLOSED';

  return (
    <div className="space-y-6 animate-fade pb-12">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">{wo.title}</h1>
            <span 
              className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider border border-[var(--glass-border)] bg-[var(--surface-elevated)] shadow-sm" 
              style={{ color: workOrderStatusColor(wo.status) }}
            >
              {workOrderStatusLabel(wo.status)}
            </span>
          </div>
          <p className="text-sm font-mono text-[var(--muted-foreground)]">ID: {wo.id}</p>
        </div>
        
        {/* Dynamic Action Buttons based on Status */}
        <div className="flex flex-wrap gap-2">
          {wo.status === 'PENDING_ACCEPTANCE' && (
            <>
              <button 
                onClick={() => handleStatusChange('ACCEPTED')} 
                disabled={actionLoading}
                className="action-btn primary bg-[var(--success)] text-white hover:opacity-90 px-4 py-2 rounded-md font-medium text-sm disabled:opacity-50"
              >
                Accept Work Order
              </button>
              <button 
                onClick={() => alert("Decline functionality mocked.")}
                disabled={actionLoading}
                className="action-btn bg-[var(--surface-elevated)] text-[var(--critical)] border border-[var(--critical)]/30 hover:bg-[var(--critical)]/10 px-4 py-2 rounded-md font-medium text-sm disabled:opacity-50"
              >
                Decline
              </button>
            </>
          )}
          
          {wo.status === 'ACCEPTED' && (
            <button 
              onClick={() => handleStatusChange('MOBILIZATION')} 
              disabled={actionLoading}
              className="action-btn primary bg-[var(--primary)] text-white hover:opacity-90 px-4 py-2 rounded-md font-medium text-sm disabled:opacity-50"
            >
              Start Mobilization
            </button>
          )}

          {wo.status === 'MOBILIZATION' && (
            <button 
              onClick={() => handleStatusChange('IN_PROGRESS')} 
              disabled={actionLoading}
              className="action-btn primary bg-[var(--primary)] text-white hover:opacity-90 px-4 py-2 rounded-md font-medium text-sm disabled:opacity-50"
            >
              Confirm Work Started
            </button>
          )}
          
          {wo.status === 'IN_PROGRESS' && (
            <button 
              onClick={() => handleStatusChange('SUBMITTED_FOR_INSPECTION', 'Work completed, ready for inspection')} 
              disabled={actionLoading}
              className="action-btn primary bg-[var(--success)] text-white hover:opacity-90 px-4 py-2 rounded-md font-medium text-sm disabled:opacity-50"
            >
              Submit for Inspection
            </button>
          )}

          {wo.status === 'MEASUREMENT_PENDING' && (
            <button 
              onClick={handleSubmitBill} 
              disabled={actionLoading}
              className="action-btn primary bg-[var(--primary)] text-white hover:opacity-90 px-4 py-2 rounded-md font-medium text-sm disabled:opacity-50"
            >
              Generate & Submit Bill
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & BOQ */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-5 glass-strong">
            <SectionLabel>Work Order Details</SectionLabel>
            <p className="text-[var(--foreground)] mt-2 mb-6 text-sm leading-relaxed">
              {wo.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="text-[var(--muted-foreground)] shrink-0 mt-0.5" size={16} />
                  <div>
                    <div className="text-[var(--muted-foreground)] text-xs">Location</div>
                    <div className="text-[var(--foreground)] font-medium">{wo.ward ? `${wo.ward}, ${wo.area}` : `${(wo as any).location?.ward ?? ""}, ${(wo as any).location?.zone ?? ""}`}</div>
                    <div className="text-[var(--muted-foreground)]">
                      {(wo.lat ?? (wo as any).location?.coordinates?.lat ?? 0).toFixed(4)}, {(wo.lng ?? (wo as any).location?.coordinates?.lng ?? 0).toFixed(4)}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="text-[var(--muted-foreground)] shrink-0 mt-0.5" size={16} />
                  <div>
                    <div className="text-[var(--muted-foreground)] text-xs">Municipality Dept</div>
                    <div className="text-[var(--foreground)] font-medium">{wo.department}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="text-[var(--muted-foreground)] shrink-0 mt-0.5" size={16} />
                  <div>
                    <div className="text-[var(--muted-foreground)] text-xs">Dates</div>
                    <div className="text-[var(--foreground)]">Issued: <span className="font-medium">{new Date(wo.createdAt || (wo as any).issueDate || Date.now()).toLocaleDateString()}</span></div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className={`shrink-0 mt-0.5 ${isOverdue ? 'text-[var(--critical)]' : 'text-[var(--muted-foreground)]'}`} size={16} />
                  <div>
                    <div className={`text-xs ${isOverdue ? 'text-[var(--critical)]' : 'text-[var(--muted-foreground)]'}`}>SLA Deadline</div>
                    <div className={`font-medium ${isOverdue ? 'text-[var(--critical)]' : 'text-[var(--foreground)]'}`}>
                      {slaDeadline.toLocaleDateString()}
                    </div>
                    {wo.status !== 'COMPLETED' && wo.status !== 'CLOSED' && (
                      <div className={`text-xs mt-0.5 font-bold ${isOverdue ? 'text-[var(--critical)]' : 'text-[var(--warning)]'}`}>
                        {isOverdue ? `${Math.abs(diffDays)} days overdue` : `${diffDays} days remaining`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-0 glass-strong overflow-hidden">
            <div className="p-5 border-b border-[var(--glass-border)]">
              <SectionLabel>Bill of Quantities (BOQ)</SectionLabel>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-[var(--muted-foreground)] uppercase bg-[var(--surface)] border-b border-[var(--glass-border)]">
                  <tr>
                    <th className="px-5 py-3 font-medium">Item</th>
                    <th className="px-5 py-3 font-medium">Unit</th>
                    <th className="px-5 py-3 font-medium text-right">Qty</th>
                    <th className="px-5 py-3 font-medium text-right">Rate (₹)</th>
                    <th className="px-5 py-3 font-medium text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--glass-border)] text-[var(--foreground)]">
                  {wo.boqItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[var(--surface-elevated)] transition-colors">
                      <td className="px-5 py-3 font-medium">{item.description}</td>
                      <td className="px-5 py-3 text-[var(--muted-foreground)]">{item.unit}</td>
                      <td className="px-5 py-3 text-right">{item.quantity}</td>
                      <td className="px-5 py-3 text-right">{(item.unitRate ?? (item as any).rate ?? 0).toLocaleString()}</td>
                      <td className="px-5 py-3 text-right font-medium">{(item.amount ?? (item.quantity * ((item.unitRate ?? (item as any).rate) ?? 0))).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-[var(--surface-elevated)] font-semibold border-t border-[var(--glass-border)]">
                  <tr>
                    <td colSpan={4} className="px-5 py-3 text-right text-[var(--foreground)]">Total Budget:</td>
                    <td className="px-5 py-3 text-right text-[var(--primary)] text-base">₹ {(wo.estimatedCost ?? (wo as any).budget ?? 0).toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Actions & Timeline */}
        <div className="space-y-6">
          
          {/* Action Panels based on status */}
          {wo.status === 'IN_PROGRESS' && (
            <GlassCard className="p-5 border border-[var(--primary)]/30 shadow-[0_0_15px_rgba(var(--primary-rgb),0.1)]">
              <SectionLabel className="text-[var(--primary)] flex items-center gap-2">
                <FileText size={16} /> Evidence Submission
              </SectionLabel>
              <form onSubmit={handleEvidenceSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="label-xs block mb-1">Evidence Stage</label>
                  <select 
                    value={evidenceStage}
                    onChange={(e) => setEvidenceStage(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-[var(--surface-elevated)] text-[var(--foreground)] border border-[var(--glass-border)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    required
                  >
                    <option value="">Select Stage</option>
                    <option value="BEFORE">Before Repair</option>
                    <option value="START">Start of Work</option>
                    <option value="DURING">During Execution</option>
                    <option value="COMPLETION">Completion</option>
                  </select>
                </div>
                <div>
                  <label className="label-xs block mb-1">Photo Evidence</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                           setFileData(reader.result as string);
                        }
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="filter-input w-full ambient-field px-3 py-2 rounded-md bg-[var(--surface)] text-sm"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={actionLoading || !fileData || !evidenceStage}
                  className="w-full action-btn primary bg-[var(--surface-elevated)] border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Upload & Verify Evidence
                </button>
              </form>
            </GlassCard>
          )}

          {wo.status === 'MEASUREMENT_PENDING' && (
            <GlassCard className="p-5 border border-[var(--warning)]/50 shadow-[0_0_15px_rgba(var(--warning-rgb),0.1)] bg-[var(--warning)]/5">
              <SectionLabel className="text-[var(--warning)] flex items-center gap-2">
                <IndianRupee size={16} /> Submit Measurements
              </SectionLabel>
              <form onSubmit={handleMeasurementSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="label-xs block mb-1">Total Measured Amount (₹)</label>
                  <input 
                    type="number" 
                    value={measurementAmount}
                    onChange={(e) => setMeasurementAmount(e.target.value)}
                    className="filter-input w-full ambient-field px-3 py-2 rounded-md bg-[var(--surface)] text-sm"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="label-xs block mb-1">Remarks (Optional)</label>
                  <textarea 
                    value={measurementRemarks}
                    onChange={(e) => setMeasurementRemarks(e.target.value)}
                    className="filter-input w-full ambient-field px-3 py-2 rounded-md bg-[var(--surface)] text-sm"
                    placeholder="Notes on measurement..."
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={actionLoading}
                  className="w-full action-btn bg-[var(--warning)] text-white hover:opacity-90 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Submit Measurement Book
                </button>
              </form>
            </GlassCard>
          )}

          {bill && (
            <GlassCard className="p-5 border border-[var(--success)]/30 bg-[var(--success)]/5">
              <SectionLabel className="text-[var(--success)] flex items-center gap-2">
                <CheckCircle2 size={16} /> Bill Submitted
              </SectionLabel>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Invoice No:</span>
                  <span className="font-mono">{bill.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Amount:</span>
                  <span className="font-medium">₹ {(bill.submittedAmount ?? 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Date:</span>
                  <span>{new Date(bill.submittedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[var(--glass-border)] mt-2">
                  <span className="text-[var(--muted-foreground)]">Status:</span>
                  <span className="font-bold text-[var(--foreground)]">{bill.status}</span>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Timeline */}
          <GlassCard className="p-5 glass-strong">
            <SectionLabel>Work Order Timeline</SectionLabel>
            <div className="mt-6 space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[var(--glass-border)] before:to-transparent">
              {events.map((event) => (
                <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-[var(--surface)] bg-[var(--primary)] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ml-[-0.3rem] md:ml-0 relative z-10" />
                  
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded-lg border border-[var(--glass-border)] bg-[var(--surface)] shadow-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold uppercase" style={{ color: event.toStatus ? workOrderStatusColor(event.toStatus) : 'var(--foreground)' }}>
                        {event.toStatus ? workOrderStatusLabel(event.toStatus) : event.title}
                      </span>
                      <span className="text-[10px] text-[var(--muted-foreground)]">
                        {new Date(event.at).toLocaleString()}
                      </span>
                    </div>
                    {event.description && (
                      <p className="mt-2 text-xs text-[var(--foreground)] leading-relaxed bg-[var(--surface-elevated)] p-2 rounded">
                        {event.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

        </div>
      </div>
    </div>
  );
}
