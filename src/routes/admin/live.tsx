import { createFileRoute } from "@tanstack/react-router";
import { AdminLive } from "@/components/app-pages";

export const Route = createFileRoute("/admin/live")({
  component: AdminLive,
});
