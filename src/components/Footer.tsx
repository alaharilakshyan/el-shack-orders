import { Flame, Instagram, Twitter, Facebook } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-32">
      <div className="container py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            <span className="font-display text-xl">
              Escobar's <span className="text-primary">Shack</span>
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-md leading-relaxed">
            Slow-smoked meats, wood-fired classics, and craft cocktails — served loud, served late.
          </p>
          <div className="mt-6 flex gap-3">
            <Social><Instagram className="h-4 w-4" /></Social>
            <Social><Twitter className="h-4 w-4" /></Social>
            <Social><Facebook className="h-4 w-4" /></Social>
          </div>
        </div>

        <Column title="Visit">
          <li>1492 Smokestack Ave</li>
          <li>Brooklyn, NY 11211</li>
          <li>Tue–Sun · 4pm–late</li>
        </Column>

        <Column title="The Shack">
          <li><Link to="/menu" className="hover:text-primary">Menu</Link></li>
          <li><Link to="/auth" className="hover:text-primary">Account</Link></li>
          <li><a href="#about" className="hover:text-primary">Our Story</a></li>
          <li><a href="#testimonials" className="hover:text-primary">Reviews</a></li>
        </Column>
      </div>
      <div className="border-t border-border">
        <div className="container py-5 flex flex-col sm:flex-row justify-between gap-3 text-xs text-muted-foreground tracking-wider uppercase">
          <span>© {new Date().getFullYear()} Escobar's Shack — All rights reserved</span>
          <span>Built with smoke, fire, and a little bourbon.</span>
        </div>
      </div>
    </footer>
  );
}

const Column = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <p className="text-[10px] uppercase tracking-[0.22em] text-primary mb-4">{title}</p>
    <ul className="space-y-2 text-sm text-muted-foreground">{children}</ul>
  </div>
);

const Social = ({ children }: { children: React.ReactNode }) => (
  <a href="#" className="p-2.5 border border-border hover:border-primary hover:text-primary transition-colors">
    {children}
  </a>
);
