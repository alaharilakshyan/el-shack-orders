import { Plus } from "lucide-react";
import { useCart } from "@/store/cart";
import { resolveDishImage } from "@/lib/dishImages";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type Dish = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  badge: "chef" | "spicy" | "veg" | null;
};

const badgeStyles: Record<string, string> = {
  chef: "bg-primary/15 text-primary border-primary/40",
  spicy: "bg-destructive/15 text-destructive border-destructive/40",
  veg: "bg-emerald-700/15 text-emerald-400 border-emerald-700/40",
};
const badgeLabels: Record<string, string> = {
  chef: "Chef's Pick",
  spicy: "Spicy",
  veg: "Veg",
};

export function DishCard({ dish, large }: { dish: Dish; large?: boolean }) {
  const add = useCart((s) => s.add);
  const img = resolveDishImage(dish.name, dish.image_url);

  return (
    <article className="group relative bg-surface border border-border hover:border-primary/40 transition-colors overflow-hidden flex flex-col">
      <div className={cn("relative overflow-hidden bg-background", large ? "aspect-[4/3]" : "aspect-square")}>
        <img
          src={img}
          alt={dish.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/0 to-transparent" />
        {dish.badge && (
          <span
            className={cn(
              "absolute top-3 left-3 text-[10px] uppercase tracking-[0.18em] px-2.5 py-1 border",
              badgeStyles[dish.badge]
            )}
          >
            {badgeLabels[dish.badge]}
          </span>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl leading-tight">{dish.name}</h3>
          <span className="font-display text-xl text-primary whitespace-nowrap">
            ${Number(dish.price).toFixed(2)}
          </span>
        </div>
        {dish.description && (
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">{dish.description}</p>
        )}
        <button
          onClick={() => {
            add({ id: dish.id, name: dish.name, price: Number(dish.price), image: img });
            toast.success("Added to your order", {
              description: dish.name,
              icon: "🔥",
            });
          }}
          className="mt-5 self-start btn-ghost-amber inline-flex items-center gap-2"
        >
          <Plus className="h-3 w-3" /> Add to Order
        </button>
      </div>
    </article>
  );
}
