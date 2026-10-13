import React, { useMemo, useState } from "react";
import {
  Download,
  Plus,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Building2,
  Mail,
  Phone,
} from "lucide-react";
import { initialLeads } from "../data/mockData";
import StatusBadge from "../components/FollowUps/StatusBadge";
const blank = {
  name: "",
  company: "",
  email: "",
  phone: "",
  source: "Website",
  status: "New",
  assigned: "Aarav Patel",
  value: "",
};
export default function Leads() {
  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [source, setSource] = useState("All sources");
  const [sort, setSort] = useState("name");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(blank);
  const [detail, setDetail] = useState(null);
  const pageSize = 6;
  const filtered = useMemo(
    () =>
      leads
        .filter(
          (l) =>
            `${l.name} ${l.company} ${l.email} ${l.assigned}`
              .toLowerCase()
              .includes(search.toLowerCase()) &&
            (status === "All statuses" || l.status === status) &&
            (source === "All sources" || l.source === source),
        )
        .sort((a, b) =>
          sort === "name"
            ? a.name.localeCompare(b.name)
            : sort === "value"
              ? b.value - a.value
              : sort === "updated"
                ? a.id - b.id
                : a.id - b.id,
        ),
    [leads, search, status, source, sort],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const openNew = () => {
    setForm(blank);
    setModal({ mode: "new" });
  };
  const openEdit = (l) => {
    setForm({ ...l, value: String(l.value) });
    setModal({ mode: "edit", id: l.id });
  };
  const submit = (e) => {
    e.preventDefault();
    const item = {
      ...form,
      id:
        modal.mode === "edit"
          ? modal.id
          : Math.max(0, ...leads.map((l) => l.id)) + 1,
      value: Number(form.value) || 0,
      updated: "Just now",
    };
    setLeads((old) =>
      modal.mode === "edit"
        ? old.map((l) => (l.id === modal.id ? item : l))
        : [item, ...old],
    );
    setModal(null);
    setPage(1);
  };
  const remove = (id) => {
    if (window.confirm("Delete this lead from the demo list?"))
      setLeads((old) => old.filter((l) => l.id !== id));
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-500">
            Keep every opportunity moving forward.
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">
            All leads{" "}
            <span className="ml-2 rounded-full bg-indigo-50 px-2.5 py-1 align-middle text-xs 
            font-bold text-indigo-600">
              {leads.length}
            </span>
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              alert(
                "CSV export will be enabled for the current demo list in a later step.",
              )
            }
            className="btn-secondary"
          >
            <Download size={16} /> Export
          </button>
          <button onClick={openNew} className="btn-primary">
            <Plus size={17} /> Add lead
          </button>
        </div>
      </div>
      <div className="panel overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className="field !py-2.5 pl-10"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search name, company, email..."
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              className="field !w-auto !py-2.5 text-xs"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option>All statuses</option>
              {["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"].map(
                (s) => (
                  <option key={s}>{s}</option>
                ),
              )}
            </select>
            <select
              className="field !w-auto !py-2.5 text-xs"
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                setPage(1);
              }}
            >
              <option>All sources</option>
              {["Website", "Referral", "LinkedIn", "Campaign", "Event"].map(
                (s) => (
                  <option key={s}>{s}</option>
                ),
              )}
            </select>
            <button
              className="btn-secondary !py-2.5"
              onClick={() => setSort(sort === "name" ? "value" : "name")}
            >
              <ArrowUpDown size={15} />
              <span className="hidden sm:inline">
                Sort: {sort === "name" ? "A–Z" : "Value"}
              </span>
            </button>
            <button
              className="btn-secondary !py-2.5"
              onClick={() => {
                setSearch("");
                setStatus("All statuses");
                setSource("All sources");
                setSort("name");
                setPage(1);
              }}
            >
              <SlidersHorizontal size={15} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-4">Lead / Company</th>
                <th className="px-4 py-4">Contact</th>
                <th className="px-4 py-4">Source</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Assigned to</th>
                <th className="px-4 py-4">Value</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map((l) => (
                <tr key={l.id} className="transition hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-100 text-xs font-bold text-indigo-700">
                        {l.name
                          .split(" ")
                          .map((s) => s[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {l.name}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                          <Building2 size={12} />
                          {l.company}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Mail size={12} className="text-slate-400" />
                      {l.email}
                    </p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-400">
                      <Phone size={12} />
                      {l.phone}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-600">
                    {l.source}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge value={l.status} />
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-medium text-slate-600">
                      {l.assigned}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs font-bold text-slate-700">
                    ${Number(l.value).toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        title="View"
                        onClick={() => setDetail(l)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        title="Edit"
                        onClick={() => openEdit(l)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => remove(l.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {visible.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                <Search size={20} />
              </div>
              <h3 className="mt-3 font-semibold text-slate-800">
                No leads found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
              <button
                className="mt-4 text-sm font-semibold text-indigo-600"
                onClick={() => {
                  setSearch("");
                  setStatus("All statuses");
                  setSource("All sources");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Showing{" "}
            <b>
              {filtered.length ? (page - 1) * pageSize + 1 : 0}–
              {Math.min(page * pageSize, filtered.length)}
            </b>{" "}
            of <b>{filtered.length}</b> leads
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="btn-secondary !px-3 !py-2 disabled:opacity-40"
            >
              <ChevronLeft size={15} /> Previous
            </button>
            <span className="px-2 text-xs text-slate-500">
              Page {page} of {pages}
            </span>
            <button
              disabled={page >= pages}
              onClick={() => setPage((p) => p + 1)}
              className="btn-secondary !px-3 !py-2 disabled:opacity-40"
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
          <div className="my-8 w-full max-w-xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h3 className="text-lg font-bold">
                  {modal.mode === "edit" ? "Edit lead" : "Add new lead"}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Fields are stored in local demo state.
                </p>
              </div>
              <button
                onClick={() => setModal(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={submit} className="grid gap-4 p-6 sm:grid-cols-2">
              {[
                { key: "name", label: "Lead name", type: "text" },
                { key: "company", label: "Company", type: "text" },
                { key: "email", label: "Email", type: "email" },
                { key: "phone", label: "Phone", type: "text" },
                { key: "value", label: "Estimated value ($)", type: "number" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    {f.label}
                  </label>
                  <input
                    className="field"
                    type={f.type}
                    required={f.key === "name" || f.key === "email"}
                    value={form[f.key]}
                    onChange={(e) =>
                      setForm({ ...form, [f.key]: e.target.value })
                    }
                    placeholder={f.label}
                  />
                </div>
              ))}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Source
                </label>
                <select
                  className="field"
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                >
                  {["Website", "Referral", "LinkedIn", "Campaign", "Event"].map(
                    (s) => (
                      <option key={s}>{s}</option>
                    ),
                  )}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Status
                </label>
                <select
                  className="field"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {[
                    "New",
                    "Contacted",
                    "Qualified",
                    "Proposal",
                    "Won",
                    "Lost",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Assigned employee
                </label>
                <select
                  className="field"
                  value={form.assigned}
                  onChange={(e) =>
                    setForm({ ...form, assigned: e.target.value })
                  }
                >
                  {["Aarav Patel", "Mia Shah", "Noah Desai", "Isha Mehta"].map(
                    (s) => (
                      <option key={s}>{s}</option>
                    ),
                  )}
                </select>
              </div>
              <div className="mt-2 flex justify-end gap-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button className="btn-primary">
                  {modal.mode === "edit" ? "Save changes" : "Create lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-50 font-bold text-indigo-700">
                  {detail.name
                    .split(" ")
                    .map((s) => s[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="font-bold">{detail.name}</h3>
                  <p className="text-sm text-slate-500">{detail.company}</p>
                </div>
              </div>
              <button
                onClick={() => setDetail(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-6 space-y-4 text-sm">
              {[
                ["Email", detail.email],
                ["Phone", detail.phone],
                ["Source", detail.source],
                ["Assigned to", detail.assigned],
                [
                  "Estimated value",
                  `$${Number(detail.value).toLocaleString()}`,
                ],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between gap-4 border-b border-slate-100 pb-3"
                >
                  <span className="text-slate-500">{k}</span>
                  <span className="text-right font-medium text-slate-800">
                    {v}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Status</span>
                <StatusBadge value={detail.status} />
              </div>
            </div>
            <button
              onClick={() => setDetail(null)}
              className="btn-primary mt-6 w-full"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
