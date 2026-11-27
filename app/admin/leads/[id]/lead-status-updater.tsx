"use client";

import { useState } from "react";
import { Check, LoaderCircle, Save } from "lucide-react";
import {
  ADMIN_BTN_PRIMARY,
  ADMIN_INPUT_CLASS,
  ADMIN_LABEL_CLASS,
  ADMIN_SELECT_CLASS,
  ADMIN_TEXTAREA_CLASS,
} from "@/components/admin/admin-styles";
import type { LeadStatus } from "@/lib/crm-types";
import { updateLeadStatus } from "../actions";

type Props = {
  leadId: string;
  initialStatus: LeadStatus;
  initialNotes: string;
  initialFollowUpDate: string;
};

const statusOptions: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New (Unprocessed)" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified Requirement" },
  { value: "quote_sent", label: "Quote Estimate Sent" },
  { value: "negotiation", label: "Negotiating / Reviewing" },
  { value: "won", label: "Won (Contract Signed)" },
  { value: "lost", label: "Lost / Abandoned" },
  { value: "spam", label: "Spam / Irrelevant" },
];

export default function LeadStatusUpdater({
  leadId,
  initialStatus,
  initialNotes,
  initialFollowUpDate,
}: Props) {
  const [status, setStatus] = useState<LeadStatus>(initialStatus);
  const [notes, setNotes] = useState(initialNotes);
  const [followUpDate, setFollowUpDate] = useState(initialFollowUpDate);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      await updateLeadStatus(leadId, status, notes, followUpDate || null);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update lead");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-5 rounded-xl border border-white/10 bg-[#0d0d0d] p-4 sm:p-6">
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-textGold">
        Pipeline Actions
      </h2>

      <div>
        <label htmlFor="lead-status-select" className={ADMIN_LABEL_CLASS}>
          Lead Status
        </label>
        <select
          id="lead-status-select"
          value={status}
          onChange={(e) => setStatus(e.target.value as LeadStatus)}
          className={ADMIN_SELECT_CLASS}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="lead-follow-up-date" className={ADMIN_LABEL_CLASS}>
          Follow-up Date
        </label>
        <input
          id="lead-follow-up-date"
          type="date"
          value={followUpDate}
          onChange={(e) => setFollowUpDate(e.target.value)}
          className={ADMIN_INPUT_CLASS}
        />
      </div>

      <div>
        <label htmlFor="lead-internal-notes" className={ADMIN_LABEL_CLASS}>
          Internal Workshop Notes
        </label>
        <textarea
          id="lead-internal-notes"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add pricing details, measurement notes, or customer requirements..."
          className={`${ADMIN_TEXTAREA_CLASS} resize-y`}
        />
      </div>

      <div aria-live="polite" className="space-y-2">
        {error && (
          <p role="alert" className="rounded-lg bg-red-500/15 p-3 text-xs text-red-200">
            {error}
          </p>
        )}
        {saved && (
          <p className="flex items-center gap-1.5 rounded-lg bg-emerald-500/15 p-3 text-xs text-emerald-300">
            <Check size={14} /> Changes saved successfully!
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className={`${ADMIN_BTN_PRIMARY} w-full`}
      >
        {saving ? (
          <>
            <LoaderCircle size={15} className="animate-spin" />
            <span>Saving...</span>
          </>
        ) : (
          <>
            <Save size={15} />
            <span>Update Lead</span>
          </>
        )}
      </button>
    </section>
  );
}
