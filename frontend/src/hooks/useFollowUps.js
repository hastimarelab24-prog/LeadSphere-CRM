
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  initialFollowUps,
} from "../data/followUpData";

import {
  getTaskState,
  makeHistory,
  formatDate,
} from "../utils/followUpUtils";

const STORAGE_KEY = "leadsphere_followups";

function readSavedFollowUps() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Unable to read follow-ups:", error);
  }

  return initialFollowUps;
}

export default function useFollowUps() {
  const [tasks, setTasks] = useState(readSavedFollowUps);
  const [notice, setNotice] = useState("");

  const notifiedIds = useRef(new Set());

  // Save tasks in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Unable to save follow-ups:", error);
    }
  }, [tasks]);

  // Calculate status for every task
  const enrichedTasks = useMemo(
    () =>
      tasks.map((task) => ({
        ...task,
        computedStatus: getTaskState(task),
      })),
    [tasks]
  );

  // Dashboard counts
  const counts = useMemo(
    () => ({
      total: tasks.length,
      upcoming: enrichedTasks.filter(
        (task) => task.computedStatus === "Upcoming"
      ).length,
      overdue: enrichedTasks.filter(
        (task) => task.computedStatus === "Overdue"
      ).length,
      completed: tasks.filter(
        (task) => task.status === "Completed"
      ).length,
    }),
    [tasks, enrichedTasks]
  );

  // Add or update a follow-up
  const saveTask = useCallback((form, selectedLead, editId = null) => {
    if (!form.title?.trim() || !form.dueDate || !form.leadId) {
      setNotice("Please complete the title, lead and due date.");
      return false;
    }

    if (!selectedLead) {
      setNotice("Please select a valid lead.");
      return false;
    }

    const editing = editId !== null && editId !== undefined;
    const current = editing
      ? tasks.find((task) => String(task.id) === String(editId))
      : null;

    if (editing && !current) {
      setNotice("Follow-up not found.");
      return false;
    }

    const newTask = {
      ...form,
      leadId: Number(form.leadId),
      leadName: selectedLead.name,
      title: form.title.trim(),
      notes: (form.notes || "").trim(),
      id: editing
        ? current.id
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
        ? old.map((task) =>
            String(task.id) === String(editId) ? newTask : task
          )
        : [newTask, ...old]
    );

    setNotice(
      editing
        ? "Follow-up updated successfully."
        : "Follow-up scheduled."
    );

    return true;
  }, [tasks]);

  // Delete a follow-up
  const deleteTask = useCallback((task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return false;

    setTasks((old) =>
      old.filter((item) => String(item.id) !== String(task.id))
    );

    setNotice("Follow-up deleted.");
    return true;
  }, []);

  // Complete or reopen a follow-up
  const toggleComplete = useCallback((task) => {
    const completing = task.status !== "Completed";

    setTasks((old) =>
      old.map((item) =>
        String(item.id) === String(task.id)
          ? {
              ...item,
              status: completing ? "Completed" : "Pending",
              history: [
                ...(item.history || []),
                makeHistory(
                  completing
                    ? "Marked completed"
                    : "Reopened follow-up",
                  completing
                    ? "Follow-up marked as completed."
                    : "Follow-up changed back to pending."
                ),
              ],
            }
          : item
      )
    );

    setNotice(
      completing ? "Follow-up completed." : "Follow-up reopened."
    );
  }, []);

  // Request browser notification permission
  const enableNotifications = useCallback(async () => {
    if (!("Notification" in window)) {
      setNotice("This browser does not support notifications.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        setNotice("Notifications were not enabled. Check browser permissions.");
        return;
      }

      setNotice("Notifications enabled while this page is open.");

      tasks.forEach((task) => {
        const due = new Date(task.dueDate).getTime();
        const key = String(task.id);

        if (
          task.status !== "Completed" &&
          Number.isFinite(due) &&
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
    } catch (error) {
      console.error("Notification error:", error);
      setNotice("Unable to enable notifications.");
    }
  }, [tasks]);

  // Check every minute for tasks due in the next 24 hours
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("Notification" in window) ||
      Notification.permission !== "granted"
    ) {
      return undefined;
    }

    const checkUpcoming = () => {
      const now = Date.now();
      const next24Hours = now + 24 * 60 * 60 * 1000;

      tasks.forEach((task) => {
        const due = new Date(task.dueDate).getTime();
        const key = String(task.id);

        if (
          task.status !== "Completed" &&
          Number.isFinite(due) &&
          due >= now &&
          due <= next24Hours &&
          !notifiedIds.current.has(key)
        ) {
          new Notification("Upcoming LeadSphere follow-up", {
            body: `${task.title} — ${task.leadName}, due ${formatDate(task.dueDate)}`,
          });

          notifiedIds.current.add(key);
        }
      });
    };

    checkUpcoming();

    const timer = window.setInterval(checkUpcoming, 60 * 1000);

    return () => window.clearInterval(timer);
  }, [tasks]);

  return {
    tasks,
    setTasks,
    enrichedTasks,
    counts,
    saveTask,
    deleteTask,
    toggleComplete,
    enableNotifications,
    notice,
    setNotice,
  };
}
