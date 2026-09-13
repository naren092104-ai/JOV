import { createFileRoute } from "@tanstack/react-router";
import { DriverEarnings } from "@/components/app-pages";

export const Route = createFileRoute("/driver/earnings")({
  component: DriverEarnings,
});
