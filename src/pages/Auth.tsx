import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Flame, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Auth = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && role) {
      const dest = role === "admin" ? "/admin" : role === "seller" ? "/seller" : "/profile";
      navigate(dest, { replace: true });
    }
  }, [user, role, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { name },
          },
        });
        if (error) throw error;
        toast.success("Welcome to the Shack 🔥", { description: "Account created. You're in." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (which: "admin" | "seller" | "customer") => {
    setMode("login");
    setEmail(`${which}@escobars.test`);
    setPassword("Escobar123!");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="container h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> <span className="text-xs uppercase tracking-[0.2em]">Back</span>
        </Link>
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-primary" />
          <span className="font-display tracking-wide">Escobar's <span className="text-primary">Shack</span></span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <p className="text-[11px] uppercase tracking-[0.32em] text-primary text-center mb-3">
            {mode === "login" ? "Welcome Back" : "Pull Up a Chair"}
          </p>
          <h1 className="font-display text-5xl text-center leading-tight mb-8">
            {mode === "login" ? "Sign in" : "Create an account"}
          </h1>

          <div className="grid grid-cols-2 mb-8 border border-border">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  "py-3 text-xs uppercase tracking-[0.22em] transition-colors",
                  mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "signup" && (
              <Field label="Name">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-shack"
                  placeholder="Your name"
                />
              </Field>
            )}
            <Field label="Email">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-shack"
                placeholder="you@email.com"
              />
            </Field>
            <Field label="Password">
              <input
                required
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-shack"
                placeholder="••••••••"
              />
            </Field>
            <button type="submit" disabled={loading} className="btn-amber w-full disabled:opacity-50">
              {loading ? "..." : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-border">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground text-center mb-4">
              Try a Demo Account
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(["customer", "seller", "admin"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => fillDemo(r)}
                  className="py-2.5 border border-border hover:border-primary hover:text-primary text-xs uppercase tracking-wider transition-colors"
                >
                  {r}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-3 leading-relaxed">
              Password for all demo accounts: <span className="text-primary font-mono">Escobar123!</span>
            </p>
          </div>
        </div>
      </main>

      <style>{`
        .input-shack {
          width: 100%;
          background: hsl(var(--input));
          border: 1px solid hsl(var(--border));
          padding: 0.875rem 1rem;
          font-size: 0.9rem;
          color: hsl(var(--foreground));
          transition: border-color 0.2s;
        }
        .input-shack:focus { outline: none; border-color: hsl(var(--primary)); }
      `}</style>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground block mb-2">{label}</span>
    {children}
  </label>
);

export default Auth;
