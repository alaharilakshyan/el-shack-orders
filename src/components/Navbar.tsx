import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Flame, User, LogOut } from "lucide-react";
import { useCart } from "@/store/cart";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const links = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/#about", label: "Story" },
  { to: "/#testimonials", label: "Reviews" },
];

export function Navbar() {
  const { count, open, lastAddedAt } = useCart();
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const itemCount = count();
  const [pulse, setPulse] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!lastAddedAt) return;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 1500);
    return () => clearTimeout(t);
  }, [lastAddedAt]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashboardPath = role === "admin" ? "/admin" : role === "seller" ? "/seller" : "/profile";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/60"
          : "bg-gradient-to-b from-background/70 to-transparent"
      )}
    >
      <div className="container flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-2 group">
          <Flame className="h-5 w-5 text-primary group-hover:text-primary-glow transition-colors" />
          <span className="font-display text-xl tracking-wide">
            Escobar's <span className="text-primary">Shack</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "uppercase text-[11px] tracking-[0.22em] transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={open}
            aria-label="Open cart"
            className={cn(
              "relative p-3 border border-border/60 hover:border-primary transition-colors",
              pulse && "animate-pulse-amber"
            )}
          >
            <ShoppingBag className="h-4 w-4" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-semibold h-5 min-w-5 px-1 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => navigate(dashboardPath)}
                className="p-3 border border-border/60 hover:border-primary transition-colors"
                aria-label="Account"
              >
                <User className="h-4 w-4" />
              </button>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate("/");
                }}
                className="p-3 border border-border/60 hover:border-primary transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="hidden sm:inline-block btn-amber">
              Order Now
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
