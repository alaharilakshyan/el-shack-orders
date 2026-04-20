import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

type DashShellProps = {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
};

export function DashShell({ eyebrow, title, children }: DashShellProps) {
  const { user, role } = useAuth();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("name")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setName(data?.name ?? null));
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />
      <section className="container pt-32 pb-12">
        <p className="text-[11px] uppercase tracking-[0.32em] text-primary mb-3">{eyebrow}</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-5xl md:text-6xl leading-tight">{title}</h1>
          {name && (
            <p className="text-sm text-muted-foreground">
              Signed in as <span className="text-foreground">{name}</span>
              {role && <> · <span className="text-primary uppercase tracking-wider">{role}</span></>}
            </p>
          )}
        </div>
      </section>
      <section className="container pb-20">{children}</section>
      <Footer />
    </div>
  );
}
