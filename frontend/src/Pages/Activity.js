import React from "react";
import {
  Activity,
  UserPlus,
  Pencil,
  CheckCircle2,
  CalendarClock,
  ShieldCheck,
} from "lucide-react";
const events = [
  {
    icon: UserPlus,
    title: "New lead created",
    desc: "Olivia Rhye was added to the lead pipeline.",
    who: "Hasti Admin",
    when: "Today · 9:42 AM",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Pencil,
    title: "Lead status updated",
    desc: "Lana Steiner moved to Contacted.",
    who: "Aarav Patel",
    when: "Today · 9:18 AM",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: CalendarClock,
    title: "Follow-up scheduled",
    desc: "Pricing proposal follow-up created for Command+R.",
    who: "Noah Desai",
    when: "Today · 8:50 AM",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: CheckCircle2,
    title: "Activity completed",
    desc: "Contract feedback task was marked complete.",
    who: "Mia Shah",
    when: "Yesterday · 4:12 PM",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: ShieldCheck,
    title: "Team member invited",
    desc: "Isha Mehta was added to the workspace.",
    who: "Hasti Admin",
    when: "Yesterday · 2:35 PM",
    color: "bg-sky-50 text-sky-600",
  },
];
export default function ActivityPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">
          A transparent timeline of important workspace events.
        </p>
        <h2 className="mt-1 text-2xl font-bold">Activity log</h2>
      </div>
      <section className="panel p-5 sm:p-7">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
            <Activity size={19} />
          </div>
          <div>
            <h3 className="font-bold">Recent activity</h3>
            <p className="mt-1 text-xs text-slate-500">
              Static example events · audit API will be connected later
            </p>
          </div>
        </div>
        <div className="mt-6">
          {events.map((e, i) => (
            <div key={e.title} className="relative flex gap-4 pb-8 last:pb-0">
              <div className="relative">
                <div
                  className={`relative z-10 grid h-10 w-10 place-items-center rounded-xl ${e.color}`}
                >
                  <e.icon size={17} />
                </div>
                {i < events.length - 1 && (
                  <div className="absolute left-1/2 top-10 h-full w-px -translate-x-1/2 bg-slate-100" />
                )}
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-slate-800">
                    {e.title}
                  </h4>
                  <span className="text-[11px] text-slate-400">{e.when}</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{e.desc}</p>
                <p className="mt-2 text-xs text-slate-400">
                  By{" "}
                  <span className="font-semibold text-slate-600">{e.who}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
