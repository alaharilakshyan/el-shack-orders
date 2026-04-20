import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";
import { DishCard, type Dish } from "@/components/DishCard";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "All" },
  { id: "mains", label: "Mains" },
  { id: "sides", label: "Sides" },
  { id: "drinks", label: "Drinks" },
  { id: "desserts", label: "Desserts" },
] as const;

type Cat = (typeof categories)[number]["id"];

const Menu = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [active, setActive] = useState<Cat>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("dishes")
      .select("*")
      .eq("available", true)
      .order("category")
      .order("price", { ascending: false })
      .then(({ data }) => {
        if (data) setDishes(data as Dish[]);
        setLoading(false);
      });
  }, []);

  const filtered = active === "all" ? dishes : dishes.filter((d) => d.category === active);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />

      <section className="container pt-36 pb-12">
        <p className="text-[11px] uppercase tracking-[0.32em] text-primary mb-4">Full Menu</p>
        <h1 className="font-display text-6xl md:text-7xl leading-tight max-w-3xl">
          The whole <span className="italic text-primary">spread</span>.
        </h1>
        <p className="mt-5 text-muted-foreground max-w-xl">
          Smoked, charred, soaked, or stirred — pick your weapon.
        </p>
      </section>

      {/* Filter */}
      <div className="container">
        <div className="border-y border-border flex flex-wrap gap-px bg-border">
          {categories.map((c) => {
            const count = c.id === "all" ? dishes.length : dishes.filter((d) => d.category === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={cn(
                  "flex-1 min-w-[120px] py-5 text-xs uppercase tracking-[0.22em] transition-colors bg-background",
                  active === c.id
                    ? "text-primary bg-surface"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {c.label} <span className="ml-1 opacity-60">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <section className="container py-12">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-surface border border-border animate-pulse h-[400px]" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">Nothing here yet. Check back soon.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((d) => (
              <DishCard key={d.id} dish={d} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Menu;
