import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authService } from "@/services/auth.service";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  beforeLoad: ({ context, location }) => {
    if (typeof window === "undefined") return;
    const session = authService.getSession() ?? (context.session as { role?: string } | undefined);
    const isLoginRoute = location.pathname === "/admin/login";

    if (!isLoginRoute && (!session || session.role !== "admin")) {
      throw redirect({ to: "/admin/login" });
    }
  },
});

function AdminLayout() {
  return <Outlet />;
}
