import React from "react";
import { X } from "lucide-react";
import {
  leadOptions,
  teamMembers,
} from "../../data/followUpData";

export default function FollowUpFormModal({
  modal,
  form,
  setForm,
  onSubmit,
  onClose,
}) {
  if (!modal) return null;

  const updateForm = (field, value) => {
    setForm((old) => ({ ...old, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
      <form
        onSubmit={onSubmit}
        className="my-6 w-full max-w-2xl space-y-5 rounded-2xl bg-white p-5 shadow-xl sm:p-7"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {modal.mode === "edit"
                ? "Edit follow-up"
                : "Schedule follow-up"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add activity details and assign an owner.
            </p>
          </div>

          <button type="button" onClick={onClose} aria-label="Close form">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700 sm:col-span-2">
            Activity title *
            <input
              required
              value={form.title}
              onChange={(e) => updateForm("title", e.target.value)}
              placeholder="e.g. Follow-up call"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5"
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Lead *
            <select
              required
              value={form.leadId}
              onChange={(e) => updateForm("leadId", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5"
            >
              {leadOptions.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Activity type
            <select
              value={form.type}
              onChange={(e) => updateForm("type", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5"
            >
              {["Call", "Email", "Meeting", "Task", "Demo"].map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Assigned team member *
            <select
              required
              value={form.assignedTo}
              onChange={(e) => updateForm("assignedTo", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5"
            >
              {teamMembers.map((member) => (
                <option key={member} value={member}>
                  {member}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-slate-700">
            Due date and time *
            <input
              required
              type="datetime-local"
              value={form.dueDate}
              onChange={(e) => updateForm("dueDate", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5"
            />
          </label>

          <label className="text-sm font-medium text-slate-700 sm:col-span-2">
            Priority
            <select
              value={form.priority}
              onChange={(e) => updateForm("priority", e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5"
            >
              {["Low", "Medium", "High"].map((priority) => (
                <option key={priority}>{priority}</option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-slate-700 sm:col-span-2">
            Notes
            <textarea
              rows={4}
              value={form.notes}
              onChange={(e) => updateForm("notes", e.target.value)}
              placeholder="Add call notes, next steps or reminders..."
              className="mt-1 w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            {modal.mode === "edit" ? "Save changes" : "Schedule activity"}
          </button>
        </div>
      </form>
    </div>
  );
}