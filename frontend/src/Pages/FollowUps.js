
import React, { useMemo, useState } from "react";
import {
  Bell,
  CalendarClock,
  CheckCircle2,
  History,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import useFollowUps from "../hooks/useFollowUps";

import {
  leadOptions,
  teamMembers,
} from "../data/followUpData";

import {
  formatDate,
  toDateTimeLocal,
} from "../utils/followUpUtils";

import StatusBadge from "../components/FollowUps/StatusBadge";
import FollowUpStats from "../components/FollowUps/FollowUpStats";
import FollowUpFilters from "../components/FollowUps/FollowUpFilters";
import FollowUpFormModal from "../components/FollowUps/FollowUpFormModal";
import ActivityHistoryModal from "../components/FollowUps/ActivityHistoryModal";const blankForm = {
  leadId: String(leadOptions[0]?.id ?? ""),
  title: "",
  type: "Call",
  assignedTo: teamMembers[0] || "",
  dueDate: "",
  priority: "Medium",
  notes: "",
};

export default function FollowUps() {
  const {
    tasks,
    enrichedTasks,
    counts,
    saveTask,
    deleteTask,
    toggleComplete,
    enableNotifications,
    notice,
    setNotice,
  } = useFollowUps();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All");

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [historyId, setHistoryId] = useState(null);

  // Keep the history modal synchronized with updated tasks
  const historyTask = tasks.find(
    (task) => String(task.id) === String(historyId)
  ) || null;

  // Search, filter and sort activities
  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return enrichedTasks
      .filter((task) => {
        const searchableText = [
          task.title,
          task.leadName,
          task.assignedTo,
          task.notes,
          task.type,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch = searchableText.includes(query);

        const matchesStatus =
          filter === "All" ||
          (filter === "Pending"
            ? task.status === "Pending"
            : task.computedStatus === filter);

        const matchesPriority =
          priorityFilter === "All" ||
          task.priority === priorityFilter;

        const matchesAssignee =
          assigneeFilter === "All" ||
          task.assignedTo === assigneeFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPriority &&
          matchesAssignee
        );
      })
      .sort((a, b) => {
        const first = new Date(a.dueDate).getTime();
        const second = new Date(b.dueDate).getTime();

        return (
          (Number.isFinite(first) ? first : Infinity) -
          (Number.isFinite(second) ? second : Infinity)
        );
      });
  }, [
    enrichedTasks,
    search,
    filter,
    priorityFilter,
    assigneeFilter,
  ]);

  function openNew() {
    setForm({
      ...blankForm,
      leadId: String(leadOptions[0]?.id ?? ""),
    });

    setModal({ mode: "new" });
  }

  function openEdit(task) {
    setForm({
      leadId: String(task.leadId ?? ""),
      title: task.title || "",
      type: task.type || "Call",
      assignedTo: task.assignedTo || teamMembers[0] || "",
      dueDate: toDateTimeLocal(task.dueDate),
      priority: task.priority || "Medium",
      notes: task.notes || "",
    });

    setModal({ mode: "edit", id: task.id });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim() || !form.dueDate || !form.leadId) {
      setNotice("Please complete the title, lead and due date.");
      return;
    }

    const selectedLead = leadOptions.find(
      (lead) => String(lead.id) === String(form.leadId)
    );

    if (!selectedLead) {
      setNotice("Please select a valid lead.");
      return;
    }

    if (new Date(form.dueDate).getTime() < Date.now()) {
      const confirmed = window.confirm(
        "This due date is in the past. Save this follow-up anyway?"
      );

      if (!confirmed) return;
    }

    const success = saveTask(
      form,
      selectedLead,
      modal?.mode === "edit" ? modal.id : null
    );

    if (success) {
      setModal(null);
    }
  }

  function handleDelete(task) {
    const deleted = deleteTask(task);

    if (deleted && String(historyId) === String(task.id)) {
      setHistoryId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-500">
            Plan activities and keep every lead moving forward.
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Follow-ups & Activities
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={enableNotifications}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Bell size={16} />
            Enable notifications
          </button>

          <button
            type="button"
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <Plus size={17} />
            Schedule follow-up
          </button>
        </div>
      </div>

      {/* Notification / success message */}
      {notice && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800"
        >
          <span>{notice}</span>

          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss message"
          >
            ×
          </button>
        </div>
      )}

      {/* Reusable statistics */}
      <FollowUpStats counts={counts} />

      {/* Reusable filters */}
      <FollowUpFilters
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        assigneeFilter={assigneeFilter}
        setAssigneeFilter={setAssigneeFilter}
      />

      {/* Activity table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Activity schedule
          </h2>

          <span className="text-sm text-slate-500">
            {filteredTasks.length} activities
          </span>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <CalendarClock
              className="mx-auto text-slate-400"
              size={34}
            />

            <h3 className="mt-3 font-semibold text-slate-800">
              No follow-ups found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try another filter or schedule a new activity.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Activity / Lead</th>
                  <th className="px-5 py-3">Due date</th>
                  <th className="px-5 py-3">Assigned to</th>
                  <th className="px-5 py-3">Priority</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {task.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {task.leadName} · {task.type}
                      </p>

                      {task.notes && (
                        <p className="mt-1 max-w-xs truncate text-xs text-slate-400">
                          {task.notes}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(task.dueDate)}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {task.assignedTo}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={
                          task.priority === "High"
                            ? "font-semibold text-red-600"
                            : task.priority === "Medium"
                              ? "font-semibold text-amber-600"
                              : "font-semibold text-slate-500"
                        }
                      >
                        {task.priority}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={task.computedStatus} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          title={
                            task.status === "Completed"
                              ? "Reopen"
                              : "Mark completed"
                          }
                          onClick={() => toggleComplete(task)}
                          className="rounded-md p-2 text-emerald-700 hover:bg-emerald-50"
                        >
                          <CheckCircle2 size={17} />
                        </button>

                        <button
                          type="button"
                          title="Activity history"
                          onClick={() => setHistoryId(task.id)}
                          className="rounded-md p-2 text-indigo-700 hover:bg-indigo-50"
                        >
                          <History size={17} />
                        </button>

                        <button
                          type="button"
                          title="Edit"
                          onClick={() => openEdit(task)}
                          className="rounded-md p-2 text-slate-600 hover:bg-slate-100"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          title="Delete"
                          onClick={() => handleDelete(task)}
                          className="rounded-md p-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reusable create/edit modal */}
      <FollowUpFormModal
        modal={modal}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        onClose={() => setModal(null)}
      />

      {/* Reusable history modal */}
      <ActivityHistoryModal
        task={historyTask}
        onClose={() => setHistoryId(null)}
      />
    </div>
  );
}
