import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Check, Flame, Package, Truck, Home, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "received" | "preparing" | "ready" | "delivering" | "delivered";

const steps: { id: Status; label: string; icon: React.ReactNode }[] = [
  { id: "received", label: "Order Received", icon: <Check className="h-4 w-4" /> },
  { id: "preparing", label: "Being Prepared", icon: <Flame className="h-4 w-4" /> },
  { id: "ready", label: "Ready for Pickup", icon: <Package className="h-4 w-4" /> },
  { id: "delivering", label: "Out for Delivery", icon: <Truck className="h-4 w-4" /> },
  { id: "delivered", label: "Delivered", icon: <Home className="h-4 w-4" /> },
];

const Order = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    supabase.from("orders").select("*").eq("id", id).maybeSingle().then(({ data }) => setOrder(data));

    const channel = supabase
      .channel(`order-${id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${id}` },
        (payload) => setOrder(payload.new)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-40 text-center text-muted-foreground">Loading order…</div>
      </div>
    );
  }

  const activeIdx = steps.findIndex((s) => s.id === order.status);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="container pt-32 pb-20">
        <p className="text-[11px] uppercase tracking-[0.32em] text-primary mb-3">Order #{order.id.slice(0, 8)}</p>
        <h1 className="font-display text-5xl md:text-6xl mb-2">It's on the way.</h1>
        <p className="text-muted-foreground mb-12">Estimated arrival in 25–35 minutes.</p>

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10">
          <div className="bg-surface border border-border p-8">
            <h2 className="font-display text-2xl mb-8">Live Tracking</h2>
            <ol className="relative">
              {steps.map((s, i) => {
                const done = i < activeIdx;
                const active = i === activeIdx;
                return (
                  <li key={s.id} className="flex gap-5 pb-8 last:pb-0 relative">
                    {i < steps.length - 1 && (
                      <span
                        className={cn(
                          "absolute left-[19px] top-10 bottom-0 w-px",
                          done ? "bg-primary" : "bg-border"
                        )}
                      />
                    )}
                    <div
                      className={cn(
                        "relative z-10 flex items-center justify-center w-10 h-10 border transition-colors",
                        done && "bg-primary border-primary text-primary-foreground",
                        active && "border-primary text-primary animate-pulse-amber",
                        !done && !active && "border-border text-muted-foreground"
                      )}
                    >
                      {s.icon}
                    </div>
                    <div className="pt-2">
                      <p
                        className={cn(
                          "font-display text-lg",
                          active && "text-primary",
                          !done && !active && "text-muted-foreground"
                        )}
                      >
                        {s.label}
                      </p>
                      {active && (
                        <p className="text-xs text-muted-foreground mt-1">In progress…</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-10 aspect-[16/8] bg-input border border-border flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-xs uppercase tracking-wider">Live map · coming soon</p>
              </div>
            </div>
          </div>

          <aside className="bg-surface border border-border p-6 h-fit">
            <p className="text-[11px] uppercase tracking-[0.22em] text-primary mb-4">Your Order</p>
            <ul className="divide-y divide-border">
              {(order.items as any[]).map((i: any) => (
                <li key={i.id} className="py-3 flex justify-between text-sm">
                  <span>
                    {i.name} <span className="text-muted-foreground">×{i.quantity}</span>
                  </span>
                  <span className="font-display">${(i.price * i.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="ember-divider my-5" />
            <div className="flex justify-between font-display text-xl">
              <span>Total</span>
              <span className="text-primary">${Number(order.total).toFixed(2)}</span>
            </div>
            <Link to="/menu" className="btn-ghost-amber w-full block text-center mt-6">Order Again</Link>
          </aside>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Order;
