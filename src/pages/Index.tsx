import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Star, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CartSidebar } from "@/components/CartSidebar";
import { DishCard, type Dish } from "@/components/DishCard";
import { supabase } from "@/integrations/supabase/client";
import hero from "@/assets/hero-smokehouse.jpg";
import about from "@/assets/about-interior.jpg";

const stats = [
  { n: "9+", l: "Signature Dishes" },
  { n: "4.9★", l: "Diner Rating" },
  { n: "30min", l: "Avg Delivery" },
];

const testimonials = [
  {
    name: "Marcus T.",
    date: "2 weeks ago",
    text: "The brisket is a religious experience. 18 hours and it shows — falls apart at the touch.",
  },
  {
    name: "Lena R.",
    date: "1 month ago",
    text: "Smoked Old Fashioned arrived still smoking under the dome. Worth every cent of $13.",
  },
  {
    name: "Diego A.",
    date: "3 weeks ago",
    text: "Tacos hit harder than my last breakup. The mango habanero salsa is illegal in 4 states.",
  },
];

const Index = () => {
  const [featured, setFeatured] = useState<Dish[]>([]);

  useEffect(() => {
    supabase
      .from("dishes")
      .select("*")
      .eq("featured", true)
      .order("price", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setFeatured(data as Dish[]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CartSidebar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={hero}
            alt="Smokehouse fire and brisket"
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/40 to-transparent" />
        </div>

        <div className="relative container pt-32 pb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-[11px] uppercase tracking-[0.4em] text-primary mb-6"
          >
            ✦ Est. 2018 · Brooklyn, NY ✦
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-display text-6xl md:text-8xl lg:text-9xl leading-[0.95] max-w-4xl text-balance"
          >
            Smoke. <span className="italic text-primary text-amber-glow">Fire.</span>
            <br />
            <span className="text-muted-foreground">A little</span> chaos.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed"
          >
            Eighteen-hour brisket. Wood-fire ribs. Smoked cocktails under glass.
            Escobar's Shack serves the kind of food you remember in your sleep.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link to="/menu" className="btn-amber">Order Now</Link>
            <a href="#about" className="btn-ghost-amber">Our Story</a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-20 grid grid-cols-3 max-w-xl gap-px bg-border border border-border"
          >
            {stats.map((s) => (
              <div key={s.l} className="bg-background/80 backdrop-blur p-5 text-center">
                <p className="font-display text-3xl text-primary">{s.n}</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-1">{s.l}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <a
          href="#about"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground animate-bounce"
        >
          <ChevronDown className="h-6 w-6" />
        </a>
      </section>

      {/* ABOUT */}
      <section id="about" className="container py-32 grid md:grid-cols-2 gap-16 items-center scroll-mt-20">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-primary mb-5">Our Story</p>
          <h2 className="font-display text-5xl md:text-6xl leading-[1.05] text-balance">
            Born in a back-alley, raised on <span className="italic text-primary">mesquite smoke</span>.
          </h2>
          <div className="ember-divider my-8 max-w-[120px]" />
          <p className="text-muted-foreground leading-relaxed text-lg">
            What started as a single offset smoker behind a Brooklyn dive bar in 2018 became the
            neighborhood's best-kept secret. We don't take reservations, we don't rush the meat,
            and we don't apologize for the smell.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            Every brisket gets eighteen hours. Every cocktail gets ice cut by hand. Every guest
            gets the same table our grandmother would've sat them at — close to the fire.
          </p>
        </div>
        <div className="relative">
          <img
            src={about}
            alt="Atmospheric restaurant interior"
            loading="lazy"
            className="w-full aspect-[4/5] object-cover border border-border"
          />
          <div className="absolute -bottom-6 -left-6 bg-surface border border-primary/40 p-5 max-w-[200px] hidden md:block">
            <p className="font-display text-3xl text-primary">7yrs</p>
            <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
              of stoking the fire
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="container py-24">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-primary mb-3">Off the Grill</p>
            <h2 className="font-display text-5xl md:text-6xl leading-tight">House Favorites</h2>
          </div>
          <Link to="/menu" className="btn-ghost-amber">View Full Menu</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((d) => (
            <DishCard key={d.id} dish={d} large />
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="container py-24 scroll-mt-20">
        <p className="text-[11px] uppercase tracking-[0.32em] text-primary mb-3 text-center">
          From the Crowd
        </p>
        <h2 className="font-display text-5xl md:text-6xl text-center mb-14">
          Word on the street
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <article key={t.name} className="bg-surface border border-border p-8 relative">
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/20" />
              <div className="flex gap-1 text-primary mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="font-display text-lg leading-snug text-balance">"{t.text}"</p>
              <div className="mt-6 pt-5 border-t border-border flex justify-between items-baseline">
                <span className="font-display text-base">{t.name}</span>
                <span className="text-xs text-muted-foreground">{t.date}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
