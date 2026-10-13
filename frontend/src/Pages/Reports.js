import React from "react";
import {
  Download,
  CalendarDays,
  TrendingUp,
  Users,
  Target,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
const monthly = [
  { month: "May", leads: 260, won: 84 },
  { month: "Jun", leads: 320, won: 102 },
  { month: "Jul", leads: 290, won: 96 },
  { month: "Aug", leads: 390, won: 141 },
  { month: "Sep", leads: 350, won: 126 },
  { month: "Oct", leads: 420, won: 164 },
];
const sources = [
  { name: "Website", value: 42, color: "#6366f1" },
  { name: "Referral", value: 28, color: "#a78bfa" },
  { name: "LinkedIn", value: 18, color: "#38bdf8" },
  { name: "Campaign", value: 12, color: "#fbbf24" },
];
export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-500">
            Understand your pipeline and make data-driven decisions.
          </p>
          <h2 className="mt-1 text-2xl font-bold">Reports & analytics</h2>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary">
            <CalendarDays size={16} /> Last 6 months
          </button>
          <button
            onClick={() =>
              alert(
                "CSV report export will be connected in a later frontend step.",
              )
            }
            className="btn-primary"
          >
            <Download size={16} /> Export report
          </button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Lead generation",
            value: "2,048",
            sub: "+16.8% vs previous period",
            icon: Users,
          },
          {
            label: "Win rate",
            value: "24.8%",
            sub: "+3.2% vs previous period",
            icon: Target,
          },
          {
            label: "Pipeline growth",
            value: "$284.5k",
            sub: "+11.4% vs previous period",
            icon: TrendingUp,
          },
        ].map((s) => (
          <div key={s.label} className="panel p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{s.label}</p>
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <s.icon size={17} />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold">{s.value}</p>
            <p className="mt-2 text-xs font-medium text-emerald-600">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <section className="panel p-5 sm:p-6">
          <h3 className="font-bold">Lead conversion trend</h3>
          <p className="mt-1 text-xs text-slate-500">
            Generated leads compared to won deals
          </p>
          <div className="mt-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly} barGap={7}>
                <CartesianGrid stroke="#eef0f6" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="leads"
                  name="Leads"
                  fill="#c7d2fe"
                  radius={[5, 5, 0, 0]}
                />
                <Bar
                  dataKey="won"
                  name="Won"
                  fill="#6366f1"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel p-5 sm:p-6">
          <h3 className="font-bold">Lead source breakdown</h3>
          <p className="mt-1 text-xs text-slate-500">
            Share of total leads by source
          </p>
          <div className="relative mt-4 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sources}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={88}
                  paddingAngle={4}
                  stroke="none"
                >
                  {sources.map((s) => (
                    <Cell key={s.name} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">100%</span>
              <span className="text-[11px] text-slate-400">Total leads</span>
            </div>
          </div>
          <div className="mt-2 space-y-3">
            {sources.map((s) => (
              <div
                key={s.name}
                className="flex items-center justify-between text-xs"
              >
                <span className="flex items-center gap-2 text-slate-600">
                  <i
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: s.color }}
                  />
                  {s.name}
                </span>
                <b className="text-slate-800">{s.value}%</b>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="panel overflow-hidden">
        <div className="border-b border-slate-100 p-5">
          <h3 className="font-bold">Employee activity summary</h3>
          <p className="mt-1 text-xs text-slate-500">
            Demo activity for the current reporting period
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[550px] text-left">
            <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Calls</th>
                <th className="px-5 py-3">Meetings</th>
                <th className="px-5 py-3">Follow-ups</th>
                <th className="px-5 py-3">Deals won</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                {
                  name: "Aarav Patel",
                  calls: 48,
                  meetings: 16,
                  tasks: 32,
                  won: 8,
                },
                {
                  name: "Mia Shah",
                  calls: 41,
                  meetings: 13,
                  tasks: 29,
                  won: 7,
                },
                {
                  name: "Noah Desai",
                  calls: 35,
                  meetings: 11,
                  tasks: 25,
                  won: 5,
                },
                {
                  name: "Isha Mehta",
                  calls: 29,
                  meetings: 9,
                  tasks: 22,
                  won: 4,
                },
              ].map((r) => (
                <tr key={r.name}>
                  <td className="px-5 py-4 text-sm font-semibold">{r.name}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {r.calls}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {r.meetings}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {r.tasks}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-emerald-600">
                    {r.won}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
