
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  CalendarClock,
  CheckCircle2,
  CircleAlert,
  Clock,
  History,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  initialFollowUps,
  leadOptions,
  teamMembers,
} from "../data/followUpData";

const STORAGE_KEY = "leadsphere_followups";

const blankForm = {
  leadId: String(leadOptions[0]?.id ?? ""),
  title: "",
  type: "Call",
  assignedTo: teamMembers[0] || "",
  dueDate: "",
  priority: "Medium",
  notes: "",
};

function readSavedFollowUps() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Unable to read saved follow-ups:", error);
  }

  return initialFollowUps;
}

function getTaskState(task) {
  if (task.status === "Completed") return "Completed";

  const due = new Date(task.dueDate).getTime();

  if (!Number.isFinite(due)) return "Pending";

  return due < Date.now() ? "Overdue" : "Upcoming";
}

function formatDate(value) {
  if (!value) return "No due date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function makeHistory(action, note, user = "Admin") {
  return {
    id: Date.now() + Math.random(),
    action,
    note,
    user,
    date: new Date().toISOString(),
  };
}

function StatusBadge({ status }) {
  const styles = {
    Upcoming: "bg-blue-50 text-blue-700",
    Pending: "bg-amber-50 text-amber-700",
    Overdue: "bg-red-50 text-red-700",
    Completed: "bg-emerald-50 text-emerald-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

export default function FollowUps() {
  const [tasks, setTasks] = useState(readSavedFollowUps);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [historyTask, setHistoryTask] = useState(null);
  const [notice, setNotice] = useState("");
  const notifiedIds = useRef(new Set());

  // Save demo data locally in this browser.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Unable to save follow-ups:", error);
    }
  }, [tasks]);

  const enrichedTasks = useMemo(() => {
    return tasks.map((task) => ({
      ...task,
      computedStatus: getTaskState(task),
    }));
  }, [tasks]);

  const counts = useMemo(() => {
    return {
      total: tasks.length,
      upcoming: enrichedTasks.filter(
        (task) => task.computedStatus === "Upcoming"
      ).length,
      overdue: enrichedTasks.filter(
        (task) => task.computedStatus === "Overdue"
      ).length,
      completed: tasks.filter((task) => task.status === "Completed").length,
    };
  }, [tasks, enrichedTasks]);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return enrichedTasks
      .filter((task) => {
        const matchesSearch = [
          task.title,
          task.leadName,
          task.assignedTo,
          task.notes,
          task.type,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);

        const matchesStatus =
          filter === "All" ||
          (filter === "Pending"
            ? task.status === "Pending"
            : task.computedStatus === filter);

        const matchesPriority =
          priorityFilter === "All" || task.priority === priorityFilter;

        const matchesAssignee =
          assigneeFilter === "All" || task.assignedTo === assigneeFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPriority &&
          matchesAssignee
        );
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [enrichedTasks, search, filter, priorityFilter, assigneeFilter]);

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
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().slice(0, 16)
        : "",
      priority: task.priority || "Medium",
      notes: task.notes || "",
    });

    setModal({ mode: "edit", id: task.id });
  }

  function updateForm(field, value) {
    setForm((old) => ({ ...old, [field]: value }));
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
      const confirmPastDate = window.confirm(
        "This due date is in the past. Save this follow-up anyway?"
      );

      if (!confirmPastDate) return;
    }

    const editing = modal?.mode === "edit";
    const current = editing
      ? tasks.find((task) => task.id === modal.id)
      : null;

    const newTask = {
      ...form,
      leadId: Number(form.leadId),
      leadName: selectedLead.name,
      title: form.title.trim(),
      notes: form.notes.trim(),
      id: editing
        ? modal.id
        : Math.max(0, ...tasks.map((task) => Number(task.id) || 0)) + 1,
      status: current?.status || "Pending",
      createdAt: current?.createdAt || new Date().toISOString(),
      history: [
        ...(current?.history || []),
        makeHistory(
          editing ? "Follow-up updated" : "Follow-up created",
          `${form.title.trim()} — due ${formatDate(form.dueDate)}`
        ),
      ],
    };

    setTasks((old) =>
      editing
        ? old.map((task) => (task.id === modal.id ? newTask : task))
        : [newTask, ...old]
    );

    setModal(null);
    setNotice(editing ? "Follow-up updated successfully." : "Follow-up scheduled.");
  }

  function deleteTask(task) {
    if (!window.confirm(`Delete "${task.title}"?`)) return;

    setTasks((old) => old.filter((item) => item.id !== task.id));

    if (historyTask?.id === task.id) setHistoryTask(null);

    setNotice("Follow-up deleted.");
  }

  function toggleComplete(task) {
    const completing = task.status !== "Completed";

    setTasks((old) =>
      old.map((item) =>
        item.id === task.id
          ? {
              ...item,
              status: completing ? "Completed" : "Pending",
              history: [
                ...(item.history || []),
                makeHistory(
                  completing ? "Marked completed" : "Reopened follow-up",
                  completing
                    ? "Follow-up marked as completed."
                    : "Follow-up changed back to pending."
                ),
              ],
            }
          : item
      )
    );

    setNotice(completing ? "Follow-up completed." : "Follow-up reopened.");
  }

  async function enableNotifications() {
    if (!("Notification" in window)) {
      setNotice("This browser does not support notifications.");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      setNotice("Notifications were not enabled. Check browser permissions.");
      return;
    }

    setNotice("Notifications enabled while this page is open.");

    const upcoming = tasks.filter((task) => {
      const due = new Date(task.dueDate).getTime();
      return (
        task.status !== "Completed" &&
        due >= Date.now() &&
        due <= Date.now() + 24 * 60 * 60 * 1000
      );
    });

    upcoming.forEach((task) => {
      const key = String(task.id);
      if (notifiedIds.current.has(key)) return;

      new Notification("Upcoming LeadSphere follow-up", {
        body: `${task.title} — ${task.leadName}, due ${formatDate(task.dueDate)}`,
      });

      notifiedIds.current.add(key);
    });
  }

  // Check every minute for tasks due within the next 24 hours.
  useEffect(() => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return undefined;
    }

    function checkUpcoming() {
      tasks.forEach((task) => {
        const due = new Date(task.dueDate).getTime();
        const key = String(task.id);

        if (
          task.status !== "Completed" &&
          due >= Date.now() &&
          due <= Date.now() + 24 * 60 * 60 * 1000 &&
          !notifiedIds.current.has(key)
        ) {
          new Notification("Upcoming LeadSphere follow-up", {
            body: `${task.title} — ${task.leadName}, due ${formatDate(task.dueDate)}`,
          });

          notifiedIds.current.add(key);
        }
      });
    }

    checkUpcoming();

    const timer = window.setInterval(checkUpcoming, 60 * 1000);
    return () => window.clearInterval(timer);
  }, [tasks]);

  return (
    <div className="space-y-6">
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
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total follow-ups",
            value: counts.total,
            icon: CalendarClock,
            color: "text-indigo-600 bg-indigo-50",
          },
          {
            label: "Upcoming",
            value: counts.upcoming,
            icon: Clock,
            color: "text-blue-600 bg-blue-50",
          },
          {
            label: "Overdue",
            value: counts.overdue,
            icon: CircleAlert,
            color: "text-red-600 bg-red-50",
          },
          {
            label: "Completed",
            value: counts.completed,
            icon: CheckCircle2,
            color: "text-emerald-600 bg-emerald-50",
          },
        ].map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {card.label}
                </p>
                <span className={`rounded-lg p-2 ${card.color}`}>
                  <Icon size={19} />
                </span>
              </div>
              <p className="mt-3 text-3xl font-bold text-slate-900">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search activities, leads..."
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          >
            <option value="All">All statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          >
            <option value="All">All priorities</option>
            <option value="High">High priority</option>
            <option value="Medium">Medium priority</option>
            <option value="Low">Low priority</option>
          </select>

          <select
            value={assigneeFilter}
            onChange={(event) => setAssigneeFilter(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          >
            <option value="All">All team members</option>
            {teamMembers.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Activity schedule</h2>
          <span className="text-sm text-slate-500">
            {filteredTasks.length} activities
          </span>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <CalendarClock className="mx-auto text-slate-400" size={34} />
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
                  <tr key={task.id} className="hover:bg-slate-50/70">
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
                          onClick={() => setHistoryTask(task)}
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
                          onClick={() => deleteTask(task)}
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

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <form
            onSubmit={handleSubmit}
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
              <button
                type="button"
                onClick={() => setModal(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                Activity title *
                <input
                  required
                  value={form.title}
                  onChange={(event) => updateForm("title", event.target.value)}
                  placeholder="e.g. Follow-up call"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500"
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Lead *
                <select
                  required
                  value={form.leadId}
                  onChange={(event) => updateForm("leadId", event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500"
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
                  onChange={(event) => updateForm("type", event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500"
                >
                  <option>Call</option>
                  <option>Email</option>
                  <option>Meeting</option>
                  <option>Task</option>
                  <option>Demo</option>
                </select>
              </label>

              <label className="text-sm font-medium text-slate-700">
                Assigned team member *
                <select
                  required
                  value={form.assignedTo}
                  onChange={(event) =>
                    updateForm("assignedTo", event.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500"
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
                  onChange={(event) =>
                    updateForm("dueDate", event.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500"
                />
              </label>

              <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                Priority
                <select
                  value={form.priority}
                  onChange={(event) =>
                    updateForm("priority", event.target.value)
                  }
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>

              <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                Notes
                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={(event) => updateForm("notes", event.target.value)}
                  placeholder="Add call notes, next steps or reminders..."
                  className="mt-1 w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-500"
                />
              </label>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
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
      )}

      {historyTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div className="my-6 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  Activity history
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {historyTask.leadName}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {historyTask.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHistoryTask(null)}
                className="rounded-lg p-2 hover:bg-slate-100"
                aria-label="Close history"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {[...(historyTask.history || [])]
                .reverse()
                .map((item) => (
                  <div key={item.id} className="flex gap-3">
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
                        {item.user} · {formatDate(item.date)}
                      </p>
                    </div>
                  </div>
                ))}

              {(!historyTask.history || historyTask.history.length === 0) && (
                <p className="text-sm text-slate-500">
                  No history available for this activity.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setHistoryTask(null)}
              className="mt-5 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
