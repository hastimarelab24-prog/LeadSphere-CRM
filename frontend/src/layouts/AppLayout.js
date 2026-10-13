import React, { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  Bell,
  ChartNoAxesCombined,
  ChevronDown,
  CircleHelp,
  Command,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Users,
  UserRound,
  X,
  CalendarCheck,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
const navGroups = [
  {
    label: "WORKSPACE",
    links: [
      { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { to: "/leads", label: "Leads", icon: Users, count: "10" },
      {
        to: "/follow-ups",
        label: "Follow-ups",
        icon: CalendarCheck,
        count: "3",
      },
      { to: "/team", label: "Team", icon: UserRound },
    ],
  },
  {
    label: "INSIGHTS",
    links: [
      { to: "/reports", label: "Reports", icon: ChartNoAxesCombined },
      { to: "/activity", label: "Activity log", icon: Activity },
    ],
  },
];
const titles = {
  "/dashboard": "Overview",
  "/leads": "Lead management",
  "/follow-ups": "Follow-ups",
  "/team": "Team members",
  "/reports": "Reports",
  "/activity": "Activity log",
  "/settings": "Settings",
};
export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const Sidebar = () => (
    <div className="flex h-full flex-col bg-[#11152b] text-slate-300">
      <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-6">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-900/50">
          <Command size={22} />
        </div>
        <div>
          <div className="text-[17px] font-bold tracking-tight text-white">
            LeadSphere
          </div>
          <div className="mt-0.5 text-[10px] font-semibold tracking-[.18em] text-slate-500">
            CRM WORKSPACE
          </div>
        </div>
      </div>
      <div className="px-4 pt-6">
        <button className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] p-3 text-left hover:bg-white/10">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-400/20 text-xs font-bold text-indigo-200">
            LS
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              LeadSphere Inc.
            </p>
            <p className="mt-0.5 text-xs text-slate-500">Free workspace</p>
          </div>
          <ChevronDown size={15} className="text-slate-500" />
        </button>
      </div>
      <nav className="mt-7 flex-1 space-y-7 overflow-y-auto px-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-3 px-3 text-[10px] font-bold tracking-[.16em] text-slate-500">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.links.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${isActive ? "bg-indigo-500 text-white shadow-md shadow-indigo-950/30" : "text-slate-400 hover:bg-white/[0.06] hover:text-white"}`
                  }
                >
                  <item.icon size={17} />
                  <span className="flex-1">{item.label}</span>
                  {item.count && (
                    <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px]">
                      {item.count}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="mx-4 mb-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <div className="mb-2 flex items-center gap-2 text-white">
          <CircleHelp size={16} />
          <span className="text-xs font-semibold">Need a hand?</span>
        </div>
        <p className="mb-3 text-[11px] leading-relaxed text-slate-500">
          Visit our help center for tips and product guides.
        </p>
        <button className="w-full rounded-lg bg-white/10 py-2 text-xs font-semibold text-slate-200 hover:bg-white/15">
          Open help center
        </button>
      </div>
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-indigo-300 to-fuchsia-300 text-xs font-bold text-indigo-950">
            {(user?.name || "HA")
              .split(" ")
              .map((s) => s[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">
              {user?.name || "Demo User"}
            </p>
            <p className="truncate text-[10px] text-slate-500">{user?.email}</p>
          </div>
          <button
            title="Sign out"
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="rounded-lg p-2 text-slate-500 hover:bg-white/10 hover:text-white"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-[#f7f8fc] lg:flex">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[252px] lg:block">
        <Sidebar />
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-slate-950/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative h-full w-[270px]">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-5 z-10 text-white"
            >
              <X size={20} />
            </button>
            <Sidebar />
          </aside>
        </div>
      )}
      <main className="min-w-0 flex-1 lg:ml-[252px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200/70 bg-white/90 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-slate-400">
                Workspace /{" "}
                <span className="text-indigo-600">
                  {titles[location.pathname] || "Overview"}
                </span>
              </p>
              <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900">
                {titles[location.pathname] || "Overview"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
              <Search size={15} className="text-slate-400" />
              <input
                placeholder="Search anything..."
                className="w-36 bg-transparent text-xs outline-none placeholder:text-slate-400"
              />
              <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">
                ⌘ K
              </kbd>
            </div>
            <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50">
              <Bell size={17} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50"
            >
              <Settings size={17} />
            </button>
            <div className="hidden h-8 w-px bg-slate-200 sm:block" />
            <button className="hidden items-center gap-2 sm:flex">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                {(user?.name || "HA")
                  .split(" ")
                  .map((s) => s[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
          </div>
        </header>
        <div className="mx-auto max-w-[1500px] p-4 sm:p-7 lg:p-9">
          <Outlet />
        </div>
        <footer className="px-6 pb-6 text-center text-[11px] text-slate-400">
          © 2026 LeadSphere CRM <span className="mx-2">·</span> Demo frontend
          using static data
        </footer>
      </main>
    </div>
  );
}
