import { createFileRoute } from "@tanstack/react-router";
import { AdminRides } from "@/components/app-pages";

export const Route = createFileRoute("/admin/rides")({
  component: AdminRides,
});
