import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Command,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("admin@leadsphere.com");
  const [password, setPassword] = useState("admin123");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  if (user) return <Navigate to="/dashboard" replace />;
  const submit = (e) => {
    e.preventDefault();
    const result = login(email, password);
    if (result.ok)
      navigate(location.state?.from?.pathname || "/", {
        replace: true,
      });
    else setError(result.message);
  };
   return (
     <div className="min-h-screen bg-white lg:grid lg:grid-cols-[1.02fr_.98fr]">
       <section className="relative hidden overflow-hidden bg-[#11152b] p-12 text-white 
       lg:flex lg:flex-col lg:justify-between xl:p-16">
         <div className="absolute -right-28 -top-24 h-96 w-96 rounded-full bg-indigo-500/20 
         blur-3xl" />
         <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-fuchsia-500/10
          blur-3xl" />
         <div className="relative flex items-center gap-3">
           <div className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-500">
             <Command size={23} />
           </div>
           <span className="text-xl font-bold tracking-tight">LeadSphere</span>
         </div>
         <div className="relative max-w-xl">
           <div className="mb-6 inline-flex items-center gap-2 rounded-full border
            border-indigo-300/20 bg-indigo-400/10 px-3 py-1.5 text-xs font-medium
             text-indigo-200">
             <span className="h-2 w-2 rounded-full bg-emerald-400" />
             Your sales, in sync
           </div>
           <h1 className="text-5xl font-semibold leading-[1.12] tracking-tight xl:text-6xl">
             Build better
             <br />
             <span className="bg-gradient-to-r from-indigo-300 to-fuchsia-300 bg-clip-text 
             text-transparent">
               relationships.
             </span>
             <br />
             Close more deals.
           </h1>
           <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
             A calmer, clearer way to manage leads, stay on top of follow-ups,
             and help your team do its best work.
           </p>
           <div className="mt-10 grid max-w-lg grid-cols-3 gap-5 border-t border-white/10 pt-6">
             <div>
               <p className="text-2xl font-bold">24.8k</p>
               <p className="mt-1 text-xs text-slate-500">Leads managed</p>
             </div>
             <div>
               <p className="text-2xl font-bold">38.6%</p>
               <p className="mt-1 text-xs text-slate-500">Avg. conversion</p>
             </div>
             <div>
               <p className="text-2xl font-bold">4.9/5</p>
               <p className="mt-1 text-xs text-slate-500">Team happiness</p>
             </div>
           </div>
         </div>
         <div className="relative flex items-center justify-between text-xs text-slate-500">
           <span>© 2026 LeadSphere Inc.</span>
           <span className="flex items-center gap-2">
             <LockKeyhole size={13} /> Secure workspace
           </span>
         </div>
       </section>
 
       <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
         <div className="w-full max-w-[420px]">
           <div className="mb-10 flex items-center gap-3 lg:hidden">
             <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-600
              text-white">
               <Command size={22} />
             </div>
             <span className="text-xl font-bold">LeadSphere</span>
           </div>
           <div className="mb-8">
             <p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-indigo-600">
               Welcome back
             </p>
             <h2 className="text-3xl font-bold tracking-tight text-slate-900">
               Sign in to your account
             </h2>
             <p className="mt-2 text-sm text-slate-500">
               Enter your details to access your workspace.
             </p>
           </div>
           <form onSubmit={submit} className="space-y-5">
             <div>
               <label className="mb-2 block text-sm font-semibold text-slate-700">
                 Email address
               </label>
               <div className="relative">
                 <Mail
                   size={17}
                   className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                 />
                 <input
                   className="field pl-11"
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="you@company.com"
                   required
                 />
               </div>
             </div>
             <div>
               <div className="mb-2 flex items-center justify-between">
                 <label className="text-sm font-semibold text-slate-700">
                   Password
                 </label>
                 <button
                   type="button"
                   className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                 >
                   Forgot password?
                 </button>
               </div>
               <div className="relative">
                 <LockKeyhole
                   size={17}
                   className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                 />
                 <input
                   className="field pl-11 pr-12"
                   type={show ? "text" : "password"}
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="Enter your password"
                   required
                 />
                 <button
                   type="button"
                   onClick={() => setShow(!show)}
                   className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                 >
                   {show ? <EyeOff size={17} /> : <Eye size={17} />}
                 </button>
               </div>
             </div>
             {error && (
               <p
                 role="alert"
                 className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700"
               >
                 {error}
               </p>
             )}
             <div className="flex items-center gap-2">
               <input
                 id="remember"
                 type="checkbox"
                 defaultChecked
                 className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
               />
               <label htmlFor="remember" className="text-sm text-slate-500">
                 Keep me signed in
               </label>
             </div>
             <button className="btn-primary w-full py-3.5">
               Sign in <ArrowRight size={17} />
             </button>
           </form>
           <div className="my-7 flex items-center gap-4">
             <div className="h-px flex-1 bg-slate-200" />
             <span className="text-xs text-slate-400">DEMO ACCESS</span>
             <div className="h-px flex-1 bg-slate-200" />
           </div>
           <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
             <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-indigo-900">
               <CheckCircle2 size={16} /> Ready-to-use demo account
             </div>
             <p className="text-xs leading-6 text-indigo-800">
               Email: <b>admin@leadsphere.com</b>
               <br />
               Password: <b>admin123</b>
             </p>
           </div>
           <p className="mt-8 text-center text-sm text-slate-500">
             New to LeadSphere?{" "}
             <Link
               to="/register"
               className="font-semibold text-indigo-600 hover:text-indigo-700"
             >
               Create an account
             </Link>
           </p>
           <p className="mt-8 text-center text-[11px] leading-5 text-slate-400">
             Demo-only authentication. Connect the backend before using real
             accounts.
           </p>
         </div>
       </section>
     </div>
   );


}
