
export function getTaskState(task) {
  if (task.status === "Completed") return "Completed";

  if (!task.dueDate) return "Pending";

  const due = new Date(task.dueDate).getTime();

  if (!Number.isFinite(due)) return "Pending";

  return due < Date.now() ? "Overdue" : "Upcoming";
}

export function formatDate(value) {
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

export function makeHistory(action, note, user = "Admin") {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    action,
    note,
    user,
    date: new Date().toISOString(),
  };
}

export function toDateTimeLocal(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 16);
}
