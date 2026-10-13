import React, { useState } from "react";
import {
  Mail,
  Plus,
  Search,
  ShieldCheck,
  Users,
  MoreHorizontal,
} from "lucide-react";
import { teamMembers } from "../data/mockData";
export default function Team() {
  const [query, setQuery] = useState("");
  const [members, setMembers] = useState(teamMembers);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "Employee" });
  const shown = members.filter((m) =>
    `${m.name} ${m.email} ${m.role}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const add = (e) => {
    e.preventDefault();
    setMembers((ms) => [
      ...ms,
      {
        ...form,
        leads: 0,
        activity: "Invited just now",
        initials: form.name
          .split(" ")
          .map((s) => s[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        color: "bg-indigo-100 text-indigo-700",
      },
    ]);
    setShow(false);
    setForm({ name: "", email: "", role: "Employee" });
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-500">
            Manage people, responsibilities, and team capacity.
          </p>
          <h2 className="mt-1 text-2xl font-bold">Team members</h2>
        </div>
        <button onClick={() => setShow(true)} className="btn-primary">
          <Plus size={17} /> Add team member
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total members", value: members.length, icon: Users },
          {
            label: "Managers",
            value: members.filter((m) => m.role === "Manager").length,
            icon: ShieldCheck,
          },
          {
            label: "Assigned leads",
            value: members.reduce((sum, m) => sum + m.leads, 0),
            icon: Mail,
          },
        ].map((s) => (
          <div key={s.label} className="panel flex items-center gap-4 p-5">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500">{s.label}</p>
              <p className="mt-1 text-2xl font-bold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="panel overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-bold">Everyone on your team</h3>
            <p className="mt-1 text-xs text-slate-500">
              Static demo records — backend permissions come later.
            </p>
          </div>
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className="field !py-2 !pl-9 sm:w-64"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search team..."
            />
          </div>
        </div>
        <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((m) => (
            <div
              key={m.email}
              className="rounded-2xl border border-slate-100 p-5 transition hover:border-indigo-100 hover:shadow-soft"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`grid h-12 w-12 place-items-center rounded-2xl text-sm font-bold ${m.color}`}
                >
                  {m.initials}
                </div>
                <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50">
                  <MoreHorizontal size={18} />
                </button>
              </div>
              <h4 className="mt-4 font-bold text-slate-900">{m.name}</h4>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <Mail size={13} />
                {m.email}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${m.role === "Manager" ? "bg-violet-50 text-violet-700" : "bg-slate-100 text-slate-600"}`}
                >
                  {m.role}
                </span>
                <span className="text-xs text-slate-500">{m.leads} leads</span>
              </div>
              <p className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                <span
                  className={`h-2 w-2 rounded-full ${m.activity === "Active now" ? "bg-emerald-500" : "bg-slate-300"}`}
                />
                {m.activity}
              </p>
            </div>
          ))}
        </div>
        {shown.length === 0 && (
          <p className="p-10 text-center text-sm text-slate-500">
            No team members found.
          </p>
        )}
      </div>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <form
            onSubmit={add}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h3 className="text-lg font-bold">Add team member</h3>
            <p className="mt-1 text-sm text-slate-500">
              Create a static team record.
            </p>
            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold">
                  Full name
                </label>
                <input
                  className="field"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold">
                  Email
                </label>
                <input
                  className="field"
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold">
                  Role
                </label>
                <select
                  className="field"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  {["Administrator", "Manager", "Employee"].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShow(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button className="btn-primary">Add member</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
