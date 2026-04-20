import { DashShell } from "@/components/DashShell";
import { Users, ShoppingCart, DollarSign, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const [counts, setCounts] = useState({ orders: 0, dishes: 0 });

  useEffect(() => {
    (async () => {
      const [{ count: orders }, { count: dishes }] = await Promise.all([
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("dishes").select("*", { count: "exact", head: true }),
      ]);
      setCounts({ orders: orders ?? 0, dishes: dishes ?? 0 });
    })();
  }, []);

  return (
    <DashShell eyebrow="Admin Dashboard" title="Mission Control">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { i: <ShoppingCart className="h-4 w-4" />, l: "Total Orders", v: counts.orders },
          { i: <DollarSign className="h-4 w-4" />, l: "Revenue", v: "$0" },
          { i: <Truck className="h-4 w-4" />, l: "Active Deliveries", v: 0 },
          { i: <Users className="h-4 w-4" />, l: "Menu Items", v: counts.dishes },
        ].map((s) => (
          <div key={s.l} className="bg-surface border border-border p-6">
            <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
              {s.i} {s.l}
            </div>
            <p className="font-display text-4xl text-primary mt-3">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border p-12 text-center">
        <p className="text-[11px] uppercase tracking-[0.32em] text-primary mb-3">Phase 2</p>
        <h2 className="font-display text-3xl mb-3">User management & analytics charts</h2>
        <p className="text-muted-foreground max-w-md mx-auto text-sm">
          Recharts visualizations, user role management, delivery assignment, and platform settings
          land in the next iteration.
        </p>
      </div>
    </DashShell>
  );
};

export default Admin;
