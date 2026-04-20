import { DashShell } from "@/components/DashShell";
import { Flame, Clock, Package, DollarSign } from "lucide-react";

const Seller = () => (
  <DashShell eyebrow="Seller Dashboard" title="The Kitchen">
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {[
        { i: <Flame className="h-4 w-4" />, l: "Active Orders", v: "0" },
        { i: <Clock className="h-4 w-4" />, l: "Avg Prep Time", v: "—" },
        { i: <Package className="h-4 w-4" />, l: "Delivered Today", v: "0" },
        { i: <DollarSign className="h-4 w-4" />, l: "Revenue Today", v: "$0" },
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
      <p className="text-[11px] uppercase tracking-[0.32em] text-primary mb-3">Coming Up Next</p>
      <h2 className="font-display text-3xl mb-3">Live order panel + menu management</h2>
      <p className="text-muted-foreground max-w-md mx-auto text-sm">
        Once Stripe is wired up and orders start flowing, this dashboard will show incoming orders
        in real-time with accept / mark-ready actions, plus full menu CRUD.
      </p>
    </div>
  </DashShell>
);

export default Seller;
