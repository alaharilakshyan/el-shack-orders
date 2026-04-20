import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";
import { useCart } from "@/store/cart";
import { Lock, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

const Checkout = () => {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({ street: "", city: "", zip: "" });

  const sub = subtotal();
  const tax = +(sub * 0.0875).toFixed(2);
  const delivery = sub > 0 ? 4.99 : 0;
  const total = +(sub + tax + delivery).toFixed(2);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-40 text-center">
          <h1 className="font-display text-4xl mb-4">Sign in to checkout</h1>
          <Link to="/auth" className="btn-amber inline-block">Sign In</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setPlacing(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          items: items as any,
          subtotal: sub,
          tax,
          delivery_fee: delivery,
          total,
          address: address as any,
          status: "received",
        })
        .select("id")
        .single();
      if (error) throw error;
      clear();
      toast.success("Order placed 🔥", { description: "Tracking your meal now." });
      navigate(`/order/${data.id}`);
    } catch (err: any) {
      toast.error(err.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />
      <section className="container pt-32 pb-20">
        <p className="text-[11px] uppercase tracking-[0.32em] text-primary mb-3">Checkout</p>
        <h1 className="font-display text-5xl md:text-6xl mb-12">Almost at the table.</h1>

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10">
          <form onSubmit={placeOrder} className="space-y-8">
            <Section title="Delivery Details">
              <Input label="Street" value={address.street} onChange={(v) => setAddress({ ...address, street: v })} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="City" value={address.city} onChange={(v) => setAddress({ ...address, city: v })} />
                <Input label="ZIP" value={address.zip} onChange={(v) => setAddress({ ...address, zip: v })} />
              </div>
            </Section>

            <Section title="Payment">
              <div className="bg-input border border-border p-5 flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm">Stripe checkout (demo)</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Full Stripe Elements integration coming next iteration. For now, orders go
                    straight to tracking.
                  </p>
                </div>
              </div>
            </Section>

            <button type="submit" disabled={placing || items.length === 0} className="btn-amber w-full disabled:opacity-50">
              {placing ? "Placing Order..." : `Place Order · $${total.toFixed(2)}`}
            </button>
            <p className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              <Lock className="h-3 w-3" /> 256-bit SSL · PCI DSS Compliant
            </p>
          </form>

          <aside className="bg-surface border border-border p-6 h-fit sticky top-28">
            <p className="text-[11px] uppercase tracking-[0.22em] text-primary mb-4">Order Summary</p>
            <ul className="divide-y divide-border">
              {items.map((i) => (
                <li key={i.id} className="py-3 flex justify-between text-sm">
                  <span>
                    {i.name} <span className="text-muted-foreground">×{i.quantity}</span>
                  </span>
                  <span className="font-display">${(i.price * i.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="ember-divider my-5" />
            <Row l="Subtotal" v={sub} />
            <Row l="Tax" v={tax} />
            <Row l="Delivery" v={delivery} />
            <div className="ember-divider my-3" />
            <div className="flex justify-between font-display text-xl mt-2">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-surface border border-border p-6">
    <h2 className="font-display text-xl mb-5">{title}</h2>
    <div className="space-y-3">{children}</div>
  </div>
);

const Input = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <label className="block">
    <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground block mb-2">{label}</span>
    <input
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-input border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary"
    />
  </label>
);

const Row = ({ l, v }: { l: string; v: number }) => (
  <div className="flex justify-between text-sm text-muted-foreground py-1">
    <span>{l}</span>
    <span>${v.toFixed(2)}</span>
  </div>
);

export default Checkout;
