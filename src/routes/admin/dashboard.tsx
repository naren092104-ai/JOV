import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/app-pages";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});
