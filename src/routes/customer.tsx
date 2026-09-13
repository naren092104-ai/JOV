import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authService } from "@/services/auth.service";

export const Route = createFileRoute("/customer")({
  component: CustomerLayout,
  beforeLoad: ({ context, location }) => {
    if (typeof window === "undefined") return;
    const session = authService.getSession() ?? (context.session as { role?: string } | undefined);
    const isLoginRoute = location.pathname === "/customer/login";

    if (!isLoginRoute && (!session || session.role !== "customer")) {
      throw redirect({ to: "/customer/login" });
    }
  },
});

function CustomerLayout() {
  return <Outlet />;
}
