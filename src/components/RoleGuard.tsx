import { Navigate } from "react-router-dom";
import { useAuth, type AppRole } from "@/hooks/useAuth";

export function RoleGuard({
  allow,
  children,
}: {
  allow: AppRole[];
  children: React.ReactNode;
}) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-xs uppercase tracking-[0.3em] animate-pulse">
          Stoking the fire...
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (role && !allow.includes(role)) {
    const dest = role === "admin" ? "/admin" : role === "seller" ? "/seller" : "/profile";
    return <Navigate to={dest} replace />;
  }
  return <>{children}</>;
}
