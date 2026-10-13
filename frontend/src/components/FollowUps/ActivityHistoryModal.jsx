import React from "react";
import { X } from "lucide-react";
import { formatDate } from "../../utils/followUpUtils";

export default function ActivityHistoryModal({ task, onClose }) {
  if (!task) return null;

  const history = Array.isArray(task.history) ? task.history : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
      <div className="my-6 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Activity history
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {task.leadName}
            </h2>

            <p className="mt-1 text-sm text-slate-500">{task.title}</p>
          </div>

          <button type="button" onClick={onClose} aria-label="Close history">
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {[...history].reverse().map((item, index) => (
            <div
              key={item.id ?? `${item.action}-${index}`}
              className="flex gap-3"
            >
              <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-500" />

              <div className="min-w-0 flex-1 border-b border-slate-100 pb-4">
                <p className="font-semibold text-slate-800">
                  {item.action}
                </p>

                {item.note && (
                  <p className="mt-1 text-sm text-slate-600">
                    {item.note}
                  </p>
                )}

                <p className="mt-1 text-xs text-slate-400">
                  {item.user || "Admin"} · {formatDate(item.date)}
                </p>
              </div>
            </div>
          ))}

          {history.length === 0 && (
            <p className="text-sm text-slate-500">
              No history available for this activity.
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}