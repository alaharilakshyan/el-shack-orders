import { DashShell } from "@/components/DashShell";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Heart, Receipt, Bookmark } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders(data ?? []));
  }, [user]);

  return (
    <DashShell eyebrow="Customer Dashboard" title="Your Table">
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <Stat icon={<Receipt className="h-4 w-4" />} label="Past Orders" value={orders.length} />
        <Stat icon={<Heart className="h-4 w-4" />} label="Favorites" value={0} />
        <Stat icon={<Bookmark className="h-4 w-4" />} label="Saved Cards" value={0} />
      </div>

      <div className="bg-surface border border-border">
        <header className="px-6 py-5 border-b border-border flex justify-between items-center">
          <h2 className="font-display text-2xl">Order History</h2>
        </header>
        <div className="divide-y divide-border">
          {orders.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              <p className="font-display text-2xl text-foreground">No orders yet</p>
              <p className="text-sm mt-2">When you order, it'll show up here.</p>
            </div>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="px-6 py-4 flex justify-between items-center">
                <div>
                  <p className="font-display">Order #{o.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(o.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-primary">${Number(o.total).toFixed(2)}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
                    {o.status}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashShell>
  );
};

const Stat = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) => (
  <div className="bg-surface border border-border p-6">
    <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
      {icon} {label}
    </div>
    <p className="font-display text-4xl text-primary mt-3">{value}</p>
  </div>
);

export default Profile;
