import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Command,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  if (user) return <Navigate to="/dashboard" replace />;
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const result = register(form);
    if (result.ok) navigate("/dashboard", { replace: true });
    else setError(result.message);
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f8fc] px-5 py-10">
      <div className="w-full max-w-[480px] rounded-3xl border border-slate-100 bg-white p-7 shadow-soft sm:p-10">
        <Link to="/login" className="mb-9 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600 text-white">
            <Command size={22} />
          </div>
          <span className="text-xl font-bold text-slate-900">LeadSphere</span>
        </Link>
        <p className="text-xs font-bold uppercase tracking-[.16em] text-indigo-600">
          Get started
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Set up your demo workspace in a few seconds.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Full name
            </label>
            <div className="relative">
              <UserRound
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                name="name"
                value={form.name}
                onChange={change}
                className="field pl-11"
                placeholder="Your full name"
                required
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Work email
            </label>
            <div className="relative">
              <Mail
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={change}
                className="field pl-11"
                placeholder="you@company.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Password</label>
            <div className="relative">
              <LockKeyhole
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                name="password"
                type="password"
                minLength="6"
                value={form.password}
                onChange={change}
                className="field pl-11"
                placeholder="At least 6 characters"
                required
              />
            </div>
          </div>
          {error && (
            <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </p>
          )}
          <button className="btn-primary w-full py-3.5">
            Create account <ArrowRight size={17} />
          </button>
        </form>
        <p className="mt-7 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-indigo-600">
            Sign in
          </Link>
        </p>
        <p className="mt-6 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">
          This registration is stored only in this browser for frontend testing.
          It does not create a secure server account.
        </p>
      </div>
    </div>
  );
}
