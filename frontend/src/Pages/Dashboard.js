import React from "react";
import {
  AreaChart,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  CalendarDays,
  Clock3,
  Download,
  MoreHorizontal,
  Plus,
  Target,
  User,
  UserCheck,
} from "lucide-react";
import { CartesianGrid, Tooltip, XAxis, Area } from "recharts";
import { Link } from "react-router-dom";
import { initialLeads, initialTasks } from "../data/mockData";
import StatusBadge from "../components/FollowUps/StatusBadge";
import { ResponsiveContainer } from "recharts";

const chartData = [
  { month: "Jan", leads: 180, won: 70 },
  { month: "Fab", leads: 230, won: 93 },
  { month: "Mar", leads: 205, won: 80 },
  { month: "Apr", leads: 310, won: 73 },
  { month: "May", leads: 185, won: 120 },
  { month: "Jun", leads: 192, won: 135 },
  { month: "Jul", leads: 280, won: 260 },
  { month: "Aug", leads: 425, won: 163 },
  { month: "Sep", leads: 390, won: 183 },
  { month: "Oct", leads: 125, won: 201 },
  { month: "Nov", leads: 470, won: 190 },
  { month: "Dec", leads: 126, won: 228 },
];
const metrics = [
  {
    lable: "Total leads",
    value: "2,420",
    change: "+12.8%",
    icon: User,
    desc: "Vs.last month",
    tone: "bg-indigo-50 text-indigo-600",
    up: true,
  },
  {
    lable: "Qualifiend leads",
    value: "846",
    change: "+8.2%",
    desc: "Vs.last month",
    icon: UserCheck,
    tone: "bg-emerald-50 text-emerald-600",
    up: true,
  },
  {
    lable: "Conversion rate",
    value: "24.8%",
    change: "+2.4%",
    desc: "Vs.last month",
    icon: Target,
    tone: "bg-violet-50 text-violet-600",
    up: true,
  },
  {
    lable: "pending follow-up",
    value: "38",
    change: "-4.1%",
    desc: "Vs.last month",
    icon: Clock3,
    tone: "bg-amber-50 text-amber-600",
    up: true,
  },
];
export default function Dashboard() {
  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-500">Tuesday, October 13, 2026</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Good morning, Hasti <span>✦</span>
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Here’s what’s happening with your sales today.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-secondary">
            <CalendarDays size={16} /> Last 30 days
          </button>
          <button className="btn-secondary">
            <Download size={16} /> Export
          </button>
          <Link to="/leads" className="btn-primary">
            <Plus size={17} /> Add new lead
          </Link>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="panel p-5">
            <div className="flex items-start justify-between">
              <div
                className={`grid h-10 w-10 place-items-center rounded-xl ${m.tone}`}
              >
                <m.icon size={19} />
              </div>
              <button className="rounded-lg p-1 text-slate-300 hover:bg-slate-50">
                <MoreHorizontal size={19} />
              </button>
            </div>
            <p className="mt-5 text-sm font-medium text-slate-500">{m.label}</p>
            <div className="mt-1 flex flex-wrap items-baseline gap-2">
              <span className="text-[28px] font-bold tracking-tight text-slate-900">
                {m.value}
              </span>
              <span
                className={`inline-flex items-center text-xs font-semibold ${m.up ? "text-emerald-600" : "text-rose-600"}`}
              >
                {m.up ? (
                  <ArrowUpRight size={14} />
                ) : (
                  <ArrowDownRight size={14} />
                )}{" "}
                {m.change}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">{m.desc}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
        <section className="panel p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900">Lead performance</h3>
              <p className="mt-1 text-xs text-slate-500">
                Track lead generation and conversions over time
              </p>
            </div>
            <button className="btn-secondary !px-3 !py-2 text-xs">
              This year <ArrowRight size={14} />
            </button>
          </div>
          <div className="mt-5 flex flex-wrap gap-6">
            <div>
              <p className="text-xs text-slate-500">Total generated</p>
              <p className="mt-1 text-xl font-bold">
                4,825{" "}
                <span className="ml-1 text-xs font-semibold text-emerald-600">
                  +18.2%
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Converted</p>
              <p className="mt-1 text-xl font-bold">
                1,245{" "}
                <span className="ml-1 text-xs font-semibold text-emerald-600">
                  +12.4%
                </span>
              </p>
            </div>
            <div className="ml-auto hidden items-center gap-4 sm:flex">
              <span className="flex items-center gap-2 text-xs text-slate-500">
                <i className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                Leads
              </span>
              <span className="flex items-center gap-2 text-xs text-slate-500">
                <i className="h-2.5 w-2.5 rounded-full bg-violet-200" />
                Conversions
              </span>
            </div>
          </div>
          <div className="mt-4 h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="wonFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c4b5fd" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#c4b5fd" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#eef0f6" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  dy={10}
                />
                <Tooltip
                  contentStyle={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    fontSize: 12,
                    boxShadow: "0 8px 30px #0f172a12",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#leadsFill)"
                />
                <Area
                  type="monotone"
                  dataKey="won"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  fill="url(#wonFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-slate-900">Lead sources</h3>
              <p className="mt-1 text-xs text-slate-500">
                Where your leads come from
              </p>
            </div>
            <button className="rounded-lg p-1 text-slate-400">
              <MoreHorizontal size={19} />
            </button>
          </div>
          <div className="mt-6 space-y-5">
            {[
              {
                name: "Website",
                value: 42,
                count: "1,016",
                color: "bg-indigo-500",
              },
              {
                name: "Referral",
                value: 28,
                count: "678",
                color: "bg-violet-400",
              },
              {
                name: "LinkedIn",
                value: 18,
                count: "436",
                color: "bg-sky-400",
              },
              {
                name: "Campaign",
                value: 12,
                count: "290",
                color: "bg-amber-400",
              },
            ].map((s) => (
              <div key={s.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{s.name}</span>
                  <span className="text-xs text-slate-500">
                    {s.count} <b className="ml-2 text-slate-800">{s.value}%</b>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${s.color}`}
                    style={{ width: `${s.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/reports"
            className="mt-7 flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            View source report <ArrowRight size={14} />
          </Link>
        </section>
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <section className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <h3 className="font-bold text-slate-900">Recent leads</h3>
              <p className="mt-1 text-xs text-slate-500">
                Keep an eye on your latest opportunities
              </p>
            </div>
            <Link
              to="/leads"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View all leads →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-3">Lead</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Value</th>
                  <th className="px-6 py-3">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {initialLeads.slice(0, 5).map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/70">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-xs font-bold text-indigo-600">
                          {l.name
                            .split(" ")
                            .map((s) => s[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">
                            {l.name}
                          </p>
                          <p className="mt-1 text-[11px] text-slate-400">
                            {l.company}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge value={l.status} />
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">
                      {l.source}
                    </td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-slate-700">
                      ${l.value.toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-slate-400">
                      {l.updated}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="panel p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-slate-900">Upcoming follow-ups</h3>
              <p className="mt-1 text-xs text-slate-500">
                Your next important tasks
              </p>
            </div>
            <Link
              to="/follow-ups"
              className="text-xs font-semibold text-indigo-600"
            >
              View all →
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {initialTasks
              .filter((t) => !t.done)
              .slice(0, 3)
              .map((t, i) => (
                <div key={t.id} className="flex gap-3">
                  <div
                    className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ${i === 0 ? "bg-rose-50 text-rose-500" : i === 1 ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"}`}
                  >
                    <CalendarDays size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className=" text-xs font-semibold text-slate-800">
                      {t.title}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {t.lead} · {t.due}
                    </p>
                  </div>
                  {/* <StatusBadge value={t.priority} /> */}
                </div>
              ))}
          </div>
          <div className="mt-6 rounded-xl bg-indigo-50/70 p-4">
            <div className="flex items-center gap-2 text-indigo-700">
              <TrendingUp size={16} />
              <span className="text-xs font-bold">You’re on a roll!</span>
            </div>
            <p className="mt-1.5 text-xs leading-5 text-indigo-700/80">
              Your team completed 18 follow-ups this week. Keep the momentum
              going.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
