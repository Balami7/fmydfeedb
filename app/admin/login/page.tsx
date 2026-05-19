"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) return router.push("/admin/dashboard");
      
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Login failed");
    } catch {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-black rounded-xl p-6 shadow-sm">
        <div className="flex flex-col items-center mb-5">
          <img src="/fmyd.png" alt="FMYD Logo" className="h-10 w-auto mb-2" />
          <h1 className="text-black text-lg font-black uppercase tracking-tight">Welcome back</h1>
          <p className="text-black/40 text-[10px]">Sign in</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[9px] font-black uppercase tracking-widest text-black mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="w-full border border-black text-black text-xs px-3 py-2 outline-none focus:border-emerald-500 placeholder:text-black/20" placeholder="admin@deallock.ng" />
          </div>
          <div>
            <label className="block text-[9px] font-black uppercase tracking-widest text-black mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="w-full border border-black text-black text-xs px-3 py-2 outline-none focus:border-emerald-500 placeholder:text-black/20" placeholder="••••••••" />
          </div>

          {error && <div className="bg-red-50 border border-red-200 px-3 py-2 text-red-600 text-[11px] font-medium rounded">{error}</div>}

          <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black uppercase tracking-widest text-xs py-2.5 transition-colors mt-2">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
      <a href="/marketplace" className="text-black hover:text-emerald-500 text-[10px] uppercase tracking-widest mt-4 transition-colors">← Back to store</a>
    </div>
  );
}
