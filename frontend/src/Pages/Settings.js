import React from "react";
import { Bell, LockKeyhole, Palette, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
export default function Settings() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">
          Manage your personal workspace preferences.
        </p>
        <h2 className="mt-1 text-2xl font-bold">Settings</h2>
      </div>
      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <aside className="panel h-fit p-3">
          {[
            { icon: UserRound, label: "Profile", active: true },
            { icon: Bell, label: "Notifications" },
            { icon: LockKeyhole, label: "Security" },
            { icon: Palette, label: "Appearance" },
          ].map((s) => (
            <button
              key={s.label}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${s.active ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <s.icon size={17} />
              {s.label}
            </button>
          ))}
        </aside>
        <section className="panel p-5 sm:p-7">
          <h3 className="font-bold">Profile information</h3>
          <p className="mt-1 text-sm text-slate-500">
            Your current demo account details.
          </p>
          <div className="mt-6 flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-indigo-100 text-lg font-bold text-indigo-700">
              {(user?.name || "HA")
                .split(" ")
                .map((s) => s[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <p className="font-semibold">{user?.name}</p>
              <p className="mt-1 text-sm text-slate-500">{user?.role}</p>
              <span className="mt-2 inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-semibold text-amber-700">
                Demo account
              </span>
            </div>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Full name
              </label>
              <input className="field" value={user?.name || ""} readOnly />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Email address
              </label>
              <input className="field" value={user?.email || ""} readOnly />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Role
              </label>
              <input className="field" value={user?.role || ""} readOnly />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-600">
                Workspace
              </label>
              <input className="field" value="LeadSphere Inc." readOnly />
            </div>
          </div>
          <p className="mt-6 rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
            Profile editing, password changes, notification preferences, and
            server-side security settings will be implemented when backend APIs
            are connected.
          </p>
        </section>
      </div>
    </div>
  );
}
