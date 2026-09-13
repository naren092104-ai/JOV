import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authService } from "@/services/auth.service";

export const Route = createFileRoute("/driver")({
  component: DriverLayout,
  beforeLoad: ({ context, location }) => {
    if (typeof window === "undefined") return;
    const session = authService.getSession() ?? (context.session as { role?: string } | undefined);
    const isLoginRoute = location.pathname === "/driver/login";

    if (!isLoginRoute && (!session || session.role !== "driver")) {
      throw redirect({ to: "/driver/login" });
    }
  },
});

function DriverLayout() {
  return <Outlet />;
}
