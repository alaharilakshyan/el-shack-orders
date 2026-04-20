import { useEffect } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function CartSidebar() {
  const { items, isOpen, close, setQty, remove, subtotal } = useCart();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const sub = subtotal();
  const tax = +(sub * 0.0875).toFixed(2);
  const delivery = sub > 0 ? 4.99 : 0;
  const total = +(sub + tax + delivery).toFixed(2);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 h-full w-full sm:w-[440px] bg-surface border-l border-border z-50 flex flex-col"
          >
            <header className="flex items-center justify-between px-6 h-20 border-b border-border">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Your Order</p>
                <h2 className="font-display text-2xl">The Shack</h2>
              </div>
              <button onClick={close} className="p-2 hover:text-primary transition-colors">
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-16">
                  <div className="p-6 border border-border">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="font-display text-xl">Your table is empty</p>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Smoke is rising. Pick something off the menu and we'll start the fire.
                  </p>
                  <Link
                    to="/menu"
                    onClick={close}
                    className="btn-ghost-amber mt-2"
                  >
                    Browse Menu
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {items.map((item) => (
                    <li key={item.id} className="py-4 flex gap-4">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover border border-border"
                          loading="lazy"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-base leading-tight">{item.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">${item.price.toFixed(2)} ea</p>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="flex items-center border border-border">
                            <button
                              onClick={() => setQty(item.id, item.quantity - 1)}
                              className="p-1.5 hover:bg-muted transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-3 text-sm w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => setQty(item.id, item.quantity + 1)}
                              className="p-1.5 hover:bg-muted transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => remove(item.id)}
                            className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="font-display text-base text-primary self-start">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-border px-6 py-5 space-y-4">
                <div className="space-y-1.5 text-sm">
                  <Row label="Subtotal" value={sub} />
                  <Row label="Tax" value={tax} />
                  <Row label="Delivery" value={delivery} />
                  <div className="ember-divider my-2" />
                  <Row label="Total" value={total} bold />
                </div>
                <Link
                  to="/checkout"
                  onClick={close}
                  className={cn("btn-amber w-full block text-center")}
                >
                  Checkout · ${total.toFixed(2)}
                </Link>
                <p className="text-[10px] text-center text-muted-foreground tracking-wider uppercase">
                  Stripe · Secure Payment
                </p>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className={cn("flex justify-between", bold ? "text-base font-display text-foreground" : "text-muted-foreground")}>
      <span>{label}</span>
      <span className={bold ? "text-primary" : ""}>${value.toFixed(2)}</span>
    </div>
  );
}
