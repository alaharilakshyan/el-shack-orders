import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Flame } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center max-w-md">
        <Flame className="h-10 w-10 text-primary mx-auto mb-6 animate-pulse" />
        <p className="text-[11px] uppercase tracking-[0.32em] text-primary mb-3">404 · Cold Plate</p>
        <h1 className="font-display text-7xl mb-4 leading-none">
          Lost in the <span className="italic text-primary">smoke</span>.
        </h1>
        <p className="text-muted-foreground mb-8">
          That page wandered off. Let's get you back to the menu before the food gets cold.
        </p>
        <Link to="/menu" className="btn-amber">Back to Menu</Link>
      </div>
    </div>
  );
};

export default NotFound;
